import knex from "../../db/knex";
import { getSolBalance } from "./getSolBalance";
import { getSOLPriceUSD, getUSDCPrice, getUSDTPrice } from "./getSolPriceUSD";
import { getTokenBalance } from "./getTokenUSDTBalance";
import { getWalletBalanceByUserId } from "./getWalletBalanceByUserId";

export const recheckBalanceAndUpdate = async (id: string, isGet?: string) => {
  const SOL_PRICE = await getSOLPriceUSD();
  const USDT_PRICE = await getUSDTPrice();
  const USDC_PRICE = await getUSDCPrice();
  const wallet = await knex("wallets").where("user_id", id).select("address");

  console.log(
    "🚀 ~ file: recheckBalanceAndUpdate.ts:9 ~ recheckBalanceAndUpdate ~ wallet:",
    wallet
  );

  if (!wallet.length) {
    const created = await knex("balance").insert({
      user_id: id,
      total_balance: 0,
      total_balance_usd: 0,
    });
    return "Balance updated successfully";
  }

  console.log("🚀 ~ file: recheckBalanceAndUpdate.ts:12 ~ wallet", wallet);

  // Process wallets in batches to respect rate limits
  const batchSize = 7; // 7 wallets * 2 API calls = 14 requests (safely under 15/second)
  const walletUpdates: Array<{
    address: string;
    balance: number;
    usd_balance: number;
    usdt: number;
  }> = [];

  for (let i = 0; i < wallet.length; i += batchSize) {
    const batch = wallet.slice(i, i + batchSize);

    const batchUpdates = await Promise.all(
      batch.map(async (w) => {
        const [balance, usdt] = await Promise.all([
          getSolBalance(w.address),
          // Fetch USDT balance only for the specific wallet address - This is a hack cause I am using a free tier API
          w.address === Bun.env.USDT_WALLET_ADDRESS
            ? getTokenBalance(
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                w.address
              )
            : undefined,
          // Uncomment when ready to use USDC
          // getTokenBalance(
          //   "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          //   w.address
          // ),
        ]);

        return {
          address: w.address,
          balance,
          usd_balance: balance * SOL_PRICE,
          usdt: Number(usdt || 0),
          // usdc: Number(usdc || 0),
        };
      })
    );

    walletUpdates.push(...batchUpdates);

    // Add a small delay between batches if there are more batches to process
    if (i + batchSize < wallet.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Batch update all wallets in a single transaction
  await knex.transaction(async (trx) => {
    for (const update of walletUpdates) {
      await trx("wallets").where("address", update.address).update({
        balance: update.balance,
        usd_balance: update.usd_balance,
        usdt: update.usdt,
        // usdc: update.usdc,
      });
    }
  });

  const currentBalance = await getWalletBalanceByUserId(id);
  console.log(
    "🚀 ~ file: recheckBalanceAndUpdate.ts:35 ~ recheckBalanceAndUpdate ~ currentBalance:",
    currentBalance
  );
  const usdtBalance = currentBalance?.total_usdt * USDT_PRICE;
  console.log(
    "🚀 ~ file: recheckBalanceAndUpdate.ts:56 ~ recheckBalanceAndUpdate ~ usdtBalance:",
    usdtBalance
  );

  const usdcBalance = currentBalance?.total_usdc * USDC_PRICE;
  console.log(
    "🚀 ~ file: recheckBalanceAndUpdate.ts:57 ~ recheckBalanceAndUpdate ~ usdcBalance:",
    usdcBalance
  );

  const total_balance_usd =
    currentBalance?.total_balance * SOL_PRICE + usdtBalance + usdcBalance;
  console.log(
    "🚀 ~ file: recheckBalanceAndUpdate.ts:61 ~ recheckBalanceAndUpdate ~ total_balance_usd:",
    total_balance_usd
  );
  const created = await knex("balance").insert({
    user_id: id,
    total_balance:
      currentBalance?.total_balance +
      usdtBalance / SOL_PRICE +
      usdcBalance / SOL_PRICE,
    total_balance_usd,
  });

  if (!created) {
    throw new Error("Error updating balance");
  }

  return "Balance updated successfully";
};
