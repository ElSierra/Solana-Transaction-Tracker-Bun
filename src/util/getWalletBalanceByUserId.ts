import knex from "../../db/knex";


export const getWalletBalanceByUserId = async (id: string) => {
  try {
    const wallet = await knex("wallets")
      .where("user_id", id)
      .sum("balance as total_balance")
      .first();

    if (!wallet) {
      return 0;
    }

    return wallet?.total_balance as number;
  } catch (e) {
    console.log(e);
    return 0;
  }
};
