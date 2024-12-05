import { HttpStatusCode } from "axios";
import { sendResponse } from "../../../util/sendResponse";
import type { Request, Response } from "express";
import knex from "../../../../db/knex";
export const getWallets = async (req: Request, res: Response) => {
  const wallets = await knex("wallets")
    .select({
      id: "id", // Rename the "id" column to "walletId"
      emoji: "emojiId",
      walletName: "name",
      walletBalance: "balance",
      walletAddress: "address",
      walletBalanceUSD: "usd_balance",
      // Rename the "balance" column to "walletBalance"
      createdAt: "created_at",
    })
    .where({
      user_id: req.user?.id,
    });
  const balance = await knex("balance")
    .select("total_balance", "total_balance_usd")
    .where({ user_id: req.user?.id })
    .orderBy("created_at", "desc")
    .limit(2);

  console.log("🚀 ~ file: getWallets.ts:15 ~ getWallets ~ balance:", balance);
  const walletWithBalance = {
    adjustSOL:
      (balance[0].total_balance || 0) >= (balance[1].total_balance || 0)
        ? "up"
        : "down",
    adjustUSD:
      (balance[0].total_balance_usd || 0) >= (balance[1].total_balance_usd || 0)
        ? "up"
        : "down",
    prevBalance: balance[1].total_balance || 0,
    prevBalanceUSD: balance[1].total_balance_usd || 0,
    currentBalance: balance[0].total_balance || 0,
    currentBalanceUSD: balance[0].total_balance_usd || 0,
    wallets,
  };
  console.log("🚀 ~ file: getWallets.ts:24 ~ wallets", wallets);
  return sendResponse({
    res,
    statusCode: HttpStatusCode.Ok,
    message: "Wallets retrieved successfully",
    data: walletWithBalance,
  });
};
