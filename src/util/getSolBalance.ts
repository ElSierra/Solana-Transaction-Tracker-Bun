import { address } from "@solana/web3.js";
import { solanaRpcCall } from "./solanaRpc";

export const getSolBalance = async (solAddress: string) => {
  const { value } = await solanaRpcCall<{ value: number }>("getBalance", [address(solAddress)]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid SOL balance response");
  }
  return value / 1_000_000_000;
};
