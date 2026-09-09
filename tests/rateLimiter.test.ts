import { describe, expect, test } from "bun:test";
import { RateLimiter, positiveInteger } from "../src/util/rateLimiter";

function fixture(maxRetries = 4) {
  let time = 0;
  const limiter = new RateLimiter({
    intervalMs: 500, maxRetries, now: () => time,
    sleep: async (ms) => { time += ms; }, random: () => 0,
  });
  return { limiter, now: () => time };
}

describe("shared RPC queue", () => {
  test("paces concurrent callers and allows only one in-flight request", async () => {
    const { limiter, now } = fixture();
    const starts: number[] = [];
    let active = 0;
    let peak = 0;
    const results = await Promise.all(Array.from({ length: 10 }, (_, i) => limiter.run(async () => {
      starts.push(now());
      peak = Math.max(peak, ++active);
      await Promise.resolve();
      active--;
      return i;
    })));
    expect(peak).toBe(1);
    expect(starts).toEqual(Array.from({ length: 10 }, (_, i) => i * 500));
    expect(results).toEqual(Array.from({ length: 10 }, (_, i) => i));
  });

  for (const header of ["3", new Date(3000).toUTCString()]) {
    test(`honors Retry-After ${header} before retry and queued work`, async () => {
      const { limiter, now } = fixture();
      const starts: number[] = [];
      const first = limiter.run(async () => {
        starts.push(now());
        if (starts.length === 1) throw { response: { status: 429, headers: { "retry-after": header } } };
        return "ok";
      });
      const second = limiter.run(async () => { starts.push(now()); });
      await Promise.all([first, second]);
      expect(starts).toEqual([0, 3000, 3500]);
    });
  }

  test("bounds retries and preserves cooldown for the next caller", async () => {
    const { limiter, now } = fixture(2);
    const starts: number[] = [];
    const error = { code: 429 };
    await expect(limiter.run(async () => { starts.push(now()); throw error; })).rejects.toEqual(error);
    await limiter.run(async () => { starts.push(now()); });
    expect(starts).toEqual([0, 1000, 3000, 7000]);
  });

  test("does not retry other errors or poison the queue", async () => {
    const { limiter } = fixture();
    let calls = 0;
    await expect(limiter.run(async () => { calls++; throw new Error("bad request"); })).rejects.toThrow("bad request");
    expect(await limiter.run(async () => "ok")).toBe("ok");
    expect(calls).toBe(1);
  });

  test("invalid environment settings fall back to safe defaults", () => {
    for (const value of [undefined, "", "0", "-1", "1.5", "NaN", "Infinity"]) {
      expect(positiveInteger(value, 500)).toBe(500);
    }
    expect(positiveInteger("1000", 500)).toBe(1000);
  });
});
