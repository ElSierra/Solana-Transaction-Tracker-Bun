import axios from "axios";
import { rateLimitedCall } from "./rateLimiter";

export function solanaRpcCall<T>(method: string, params: unknown[]): Promise<T> {
  return rateLimitedCall(async () => {
    const { data } = await axios.post(
      Bun.env.SOLANA_RPC ||
        (Bun.env.HELIUS_KEY
          ? `https://mainnet.helius-rpc.com/?api-key=${encodeURIComponent(Bun.env.HELIUS_KEY)}`
          : "https://api.mainnet-beta.solana.com"),
      { jsonrpc: "2.0", id: 1, method, params },
      { timeout: 15_000 }
    );
    if (data?.error) {
      const error = new Error(`Solana RPC ${method}: ${data.error.message}`);
      throw Object.assign(error, { code: data.error.code });
    }
    if (!data || !("result" in data)) {
      throw new Error(`Invalid Solana RPC response for ${method}`);
    }
    return data.result as T;
  });
}
