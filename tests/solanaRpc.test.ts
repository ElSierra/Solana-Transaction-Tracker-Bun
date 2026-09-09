import { afterEach, expect, spyOn, test } from "bun:test";
import axios from "axios";
import { solanaRpcCall } from "../src/util/solanaRpc";
import { getTokenBalance } from "../src/util/getTokenUSDTBalance";
import { getSolBalance } from "../src/util/getSolBalance";

const originalRpc = Bun.env.SOLANA_RPC;
const originalKey = Bun.env.HELIUS_KEY;
let post: ReturnType<typeof spyOn>;
afterEach(() => {
  post?.mockRestore();
  if (originalRpc === undefined) delete Bun.env.SOLANA_RPC;
  else Bun.env.SOLANA_RPC = originalRpc;
  if (originalKey === undefined) delete Bun.env.HELIUS_KEY;
  else Bun.env.HELIUS_KEY = originalKey;
});

test("SOL and token requests use the Helius key and sum token accounts", async () => {
  delete Bun.env.SOLANA_RPC;
  Bun.env.HELIUS_KEY = "test-key";
  post = spyOn(axios, "post").mockImplementation(async (_url: any, body: any) => ({
    data: { result: body.method === "getBalance" ? { value: 1_500_000_000 } : {
      value: ["1.25", "2.5"].map((uiAmountString) => ({ account: { data: { parsed: { info: { tokenAmount: { uiAmountString } } } } } })),
    } },
  }) as any);
  expect(await getSolBalance("11111111111111111111111111111111")).toBe(1.5);
  expect(await getTokenBalance("mint", "wallet")).toBe("3.75");
  for (const args of post.mock.calls) {
    expect(args[0]).toBe("https://mainnet.helius-rpc.com/?api-key=test-key");
    expect(args[2]).toEqual({ timeout: 15_000 });
  }
});

test("explicit RPC URL overrides Helius", async () => {
  Bun.env.SOLANA_RPC = "https://rpc.example.test";
  Bun.env.HELIUS_KEY = "test-key";
  post = spyOn(axios, "post").mockResolvedValue({ data: { result: { value: [] } } });
  expect(await getTokenBalance("mint", "wallet")).toBe("0");
  expect(post.mock.calls[0][0]).toBe("https://rpc.example.test");
});

test("RPC failures and malformed results never become zero balances", async () => {
  post = spyOn(axios, "post").mockResolvedValueOnce({ data: { error: { code: -32602, message: "Invalid params" } } })
    .mockResolvedValueOnce({ data: {} })
    .mockResolvedValueOnce({ data: { result: {} } });
  await expect(getTokenBalance("mint", "wallet")).rejects.toThrow("Invalid params");
  await expect(solanaRpcCall("getBalance", [])).rejects.toThrow("Invalid Solana RPC response");
  await expect(getTokenBalance("mint", "wallet")).rejects.toThrow("Invalid token balance response");
});
