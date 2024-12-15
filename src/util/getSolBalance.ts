import { address, createSolanaRpc } from "@solana/web3.js";

const rpc = createSolanaRpc(Bun.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com");
const LAMPORTS_PER_SOL = 1_000_000_000; // 1 billion lamports per SOL

export const getSolBalance = async (solAddress: string) => {
  const wallet = address(solAddress);
  const { value: balance } = await rpc.getBalance(wallet).send();
  console.log(`Balance: ${Number(balance) / LAMPORTS_PER_SOL} SOL`);
  return Number(balance) / LAMPORTS_PER_SOL;
};
