export function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

interface LimiterOptions {
  intervalMs?: number;
  maxRetries?: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
}

// One queue per process: concurrent API handlers cannot create RPC bursts.
export class RateLimiter {
  private tail: Promise<unknown> = Promise.resolve();
  private nextStart = 0;
  private readonly intervalMs: number;
  private readonly maxRetries: number;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly random: () => number;

  constructor(options: LimiterOptions = {}) {
    this.intervalMs = options.intervalMs ?? 500;
    this.maxRetries = options.maxRetries ?? 4;
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    this.random = options.random ?? Math.random;
  }

  run<T>(apiCall: () => Promise<T>): Promise<T> {
    const task = this.tail.then(async () => {
      for (let attempt = 0; ; attempt++) {
        // Loop so an early timer wakeup cannot bypass a provider's cooldown.
        while (this.nextStart > this.now()) {
          await this.sleep(Math.min(this.nextStart - this.now(), 2_147_483_647));
        }
        this.nextStart = this.now() + this.intervalMs;
        try {
          return await apiCall();
        } catch (error: any) {
          const status = error?.response?.status ?? error?.code;
          if (status !== 429) throw error;
          const header = error?.response?.headers?.["retry-after"];
          const seconds = header == null ? NaN : Number(header);
          const retryAfter = Number.isFinite(seconds)
            ? seconds * 1000
            : Date.parse(String(header)) - this.now();
          const backoff = Math.min(1000 * 2 ** attempt, 30_000) + Math.floor(this.random() * 250);
          // Keep the cooldown even when this caller has exhausted its retries.
          this.nextStart = this.now() + Math.max(this.intervalMs, backoff, Number.isFinite(retryAfter) ? retryAfter : 0);
          if (attempt >= this.maxRetries) throw error;
        }
      }
    });
    // A failed request must not poison subsequent queued work.
    this.tail = task.catch(() => undefined);
    return task;
  }
}

export const solanaApiLimiter = new RateLimiter({
  intervalMs: positiveInteger(Bun.env.SOLANA_RPC_INTERVAL_MS, 500),
});

export function rateLimitedCall<T>(apiCall: () => Promise<T>): Promise<T> {
  return solanaApiLimiter.run(apiCall);
}
