import knex from "../../db/knex";
import { getSolBalance } from "./getSolBalance";
import { getSOLPriceUSD } from "./getSolPriceUSD";
import { getWalletBalanceByUserId } from "./getWalletBalanceByUserId";

export const recheckBalanceAndUpdate = async (id: string) => {
  const SOL_PRICE = await getSOLPriceUSD();
  const wallet = await knex("wallets").where("user_id", id).select("address");
  if (!wallet.length) {
    return;
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
  await knex("balance").insert({
    user_id: id,
    total_balance: currentBalance,
    total_balance_usd: currentBalance * SOL_PRICE,
  });
};

recheckBalanceAndUpdate("1ffb662c-6dc7-4776-b86f-5f3c3344205d");
