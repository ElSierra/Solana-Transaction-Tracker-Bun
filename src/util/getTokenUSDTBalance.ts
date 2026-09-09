import { solanaRpcCall } from "./solanaRpc";

interface TokenAccount {
  account: { data: { parsed: { info: { tokenAmount: { uiAmountString: string } } } } };
}

export const getTokenBalance = async (tokenAddress: string, walletAddress: string) => {
  const result = await solanaRpcCall<{ value: TokenAccount[] }>("getTokenAccountsByOwner", [
    walletAddress,
    { mint: tokenAddress },
    { encoding: "jsonParsed" },
  ]);
  if (!Array.isArray(result?.value)) throw new Error("Invalid token balance response");
  // A wallet can own more than one account for the same mint.
  const balance = result.value.reduce((total, entry) => {
    const amount = entry?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString;
    if (amount == null || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
      throw new Error("Invalid token amount response");
    }
    return total + Number(amount);
  }, 0);
  return String(balance);
};
