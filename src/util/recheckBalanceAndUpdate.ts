import knex from "../../db/knex";
import { getSolBalance } from "./getSolBalance";
import { getSOLPriceUSD } from "./getSolPriceUSD";
import { getWalletBalanceByUserId } from "./getWalletBalanceByUserId";

export const recheckBalanceAndUpdate = async (id: string, isGet?: string) => {
  const SOL_PRICE = await getSOLPriceUSD();
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
    await knex("wallets")
      .where("address", wallet[i].address)
      .update({
        balance,
        usd_balance: balance * SOL_PRICE,
      });
  }

  const currentBalance = await getWalletBalanceByUserId(id);

  if (!currentBalance) {
    throw new Error("Error getting balance");
  }

  const created = await knex("balance").insert({
    user_id: id,
    total_balance: currentBalance,
    total_balance_usd: currentBalance * SOL_PRICE,
  });

  if (!created) {
    throw new Error("Error updating balance");
  }

  return "Balance updated successfully";
};
