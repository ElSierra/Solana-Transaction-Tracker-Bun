import {
  address,
  Address,
  createSolanaRpc,
  KeyPairSigner,
} from "@solana/web3.js";
import axios from "axios";

const COINS_MINT: Record<string, Address> = {
  USDT: address("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
};

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

export const getTokenBalance = async (
  tokenAddress: string,
  walletAddress: string
) => {
  const response = await axios({
    url: `https://api.mainnet-beta.solana.com`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: [
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          {
            mint: tokenAddress,
          },
          {
            encoding: "jsonParsed",
          },
        ],
      },
    ],
  });

  return response?.data[0]?.result?.value[0]?.account?.data?.parsed?.info
    ?.tokenAmount?.uiAmountString;
};


// import { Connection, PublicKey } from "solana-web3-old"
// import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";

// export const getTokenBalance = async (
//   tokenAddress: string,
//   walletAddress: string
// ) => {
//   const connection = new Connection("https://api.mainnet-beta.solana.com");
//   const walletPublicKey = new PublicKey(walletAddress);
//   const tokenPublicKey = new PublicKey(tokenAddress);

//   const accounts = await connection.getTokenAccountsByOwner(walletPublicKey, {
//     mint: tokenPublicKey,
//     programId: TOKEN_PROGRAM_ID,
//   });

//   if (accounts.value.length === 0) {
//     return null;
//   }

//   const accountInfo = await getAccount(connection, accounts.value[0].pubkey);
//   return accountInfo.amount.toString();
// };