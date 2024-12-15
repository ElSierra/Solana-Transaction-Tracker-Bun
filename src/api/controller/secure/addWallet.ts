import { getSOLPriceUSD } from "./../../../util/getSolPriceUSD";
import { getSolBalance } from "./../../../util/getSolBalance";
import type { Response, Request, NextFunction } from "express";
import { getWalletBalanceByUserId } from "../../../util/getWalletBalanceByUserId";
import { sendResponse } from "../../../util/sendResponse";
import knex from "../../../../db/knex";
import { recheckBalanceAndUpdate } from "../../../util/recheckBalanceAndUpdate";
import { editWebHook } from "../../../util/editWebHook";
import { getTokenBalance } from "../../../util/getTokenUSDTBalance";

export const addWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?.id;
    //wallet count in total

    const walletCount = await knex("wallets").count("id");

    if (Number(walletCount[0]?.count) >= 25) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Sorry we are unable to add more wallets at the moment",
      });
    }

    const SOL_PRICE = await getSOLPriceUSD();
    const user = await knex.raw(
      `
      SELECT 
          users.*,
          COALESCE(JSON_AGG(wallets.*) FILTER (WHERE wallets.id IS NOT NULL), '[]') AS wallets
      FROM 
          users
      LEFT JOIN 
          wallets
      ON 
          users.id = wallets.user_id
      WHERE 
          users.id = ?
      GROUP BY 
          users.id
      `,
      [id]
    );
    console.log("🚀 ~ file: addWallet.ts:15 ~ user:", user?.rows[0]);

    if (!user) {
      return sendResponse({
        res,
        statusCode: 404,
        message: "User not found",
      });
    }
    if (user.rows[0].wallets.length >= 10) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "You can only have a maximum of 10 wallets",
      });
    }

    const balance = await getSolBalance(req.body.walletAddress);
    const usdt = await getTokenBalance("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", req.body.walletAddress);
    const usdc = await getTokenBalance("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", req.body.walletAddress);
  
    console.log("🚀 ~ file: addWallet.ts:50 ~ balance:", balance);

    console.log({
      name: req.body.walletName,
      user_id: id,
      address: req.body.walletAddress,
      emojiId: req.body.emojiId,
      currency: "SOL",
      balance,
    });
    const insertWallet = await knex("wallets").insert({
      name: req.body.walletName,
      user_id: id,
      id: knex.raw("gen_random_uuid()"),
      address: req.body.walletAddress,
      emojiId: req.body.emojiId,
      currency: "SOL",
      balance,
      usdt: Number(usdt||0),
      usdc: Number(usdc||0),
      usd_balance: balance * SOL_PRICE,
    });
    if (!insertWallet) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Failed to add wallet",
      });
    }
    //accumulate the wallets balance

    await recheckBalanceAndUpdate(id as string);
    await editWebHook();

    res.status(201).json({
      message: "Wallet added successfully",
    });
  } catch (error: any) {
    next(error);
  }
};
