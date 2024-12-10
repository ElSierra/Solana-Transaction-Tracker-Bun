import type { NextFunction, Request, Response } from "express";
import knex from "../../../../db/knex";
import { sendResponse } from "../../../util/sendResponse";
import { notificationBuilder } from "../../../util/notificationBuilder";

export const pingWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountData = req.body[0].accountData;
    const description = req.body[0].description;
    const date = new Date(req.body[0].timestamp * 1000);
    console.log(
      "🚀 ~ file: pingWallet.ts:15 ~ date:",
      req.body[0].timestamp,
      date
    );

    const nativeTransfers: {
      amount: number;
      fromUserAccount: string;
      toUserAccount: string;
    }[] = req.body[0].nativeTransfers;
    console.log(
      "🚀 ~ file: pingWallet.ts:36 ~ nativeTransfers:",
      nativeTransfers,
      description
    );

    if (!accountData || accountData.length === 0) {
      sendResponse({
        res,
        statusCode: 404,
        message: "No accounts found",
      });
      return;
    }
    const myTransfer: any[] = [];
    const accountAddresses = accountData.map((data: any) => data.account);
    knex("wallets")
      .whereIn("address", accountAddresses)
      .select("*")
      .then((wallets) => {
        console.log("🚀 ~ file: pingWallet.ts:20 ~ .then ~ wallets:", wallets);

        if (!wallets || wallets.length === 0) {
          sendResponse({
            res,
            statusCode: 404,
            message: "No wallets found",
          });
          return;
        }
        nativeTransfers.forEach((transfer) => {
          const fromWallet = wallets.find(
            (wallet) => wallet.address === transfer.fromUserAccount
          );
          const toWallet = wallets.find(
            (wallet) => wallet.address === transfer.toUserAccount
          );
          if (fromWallet) {
            myTransfer.push({
              wallet: transfer.toUserAccount,
              walletId: fromWallet.id,
              amount: transfer.amount,
              transferOut: true,
            });
          }
          if (toWallet) {
            myTransfer.push({
              wallet: transfer.fromUserAccount,
              amount: transfer.amount,
              walletId: toWallet.id,
              transferOut: false,
            });
          }
        });
        console.log("🚀 ~ file: pingWallet.ts:47 ~ myTransfer", myTransfer);
console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥")
        notificationBuilder({
          wallet: myTransfer[0].wallet,
          amount: myTransfer[0].amount,
          userId: wallets[0].user_id,
          transferOut: myTransfer[0].transferOut,
          date,
          walletId: myTransfer[0].walletId,
        });
        sendResponse({
          res,
          statusCode: 200,
          message: "Wallets pinged successfully",
          data: myTransfer,
        });
        return;
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};
