class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();

    // Remove requests older than the window
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      // Calculate how long to wait for the oldest request to expire
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest) + 10; // Add 10ms buffer

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.waitForSlot(); // Recursive call to check again
      }
    }

    // Add current request timestamp
    this.requests.push(now);
  }
}

// Create a global rate limiter for Solana API calls (15 requests per second)
export const solanaApiLimiter = new RateLimiter(15, 1000);

// Wrapper function to rate limit API calls
export async function rateLimitedCall<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  await solanaApiLimiter.waitForSlot();
  return apiCall();
}
