import knex from "../../db/knex";


export const getWalletBalanceByUserId = async (id: string) => {
  try {
    const wallet = await knex("wallets")
      .where("user_id", id).select(
        knex.raw("SUM(balance) as total_balance"),
        knex.raw("SUM(usdt) as total_usdt"),
        knex.raw("SUM(usdc) as total_usdc")

      )
      .first();

    if (!wallet) {
      return 0;
    }

    return wallet
  } catch (e) {
    console.log(e);
    return 0;
  }
};


