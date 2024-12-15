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

  for (let i = 0; i < wallet.length; i++) {
    const balance = await getSolBalance(wallet[i].address);
    const usdt = await getTokenBalance(
      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      wallet[i].address
    );
    const usdc = await getTokenBalance(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      wallet[i].address
    );

    await knex("wallets")
      .where("address", wallet[i].address)
      .update({
        balance,
        usd_balance: balance * SOL_PRICE,
        usdt: Number(usdt || 0),
        usdc: Number(usdc || 0),
      });
  }

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
    (currentBalance?.total_balance * SOL_PRICE) + usdtBalance + usdcBalance;
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
