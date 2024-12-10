import knex from "../../../../db/knex";
import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../util/sendResponse";
import { HttpStatusCode } from "axios";
import { recheckBalanceAndUpdate } from "../../../util/recheckBalanceAndUpdate";
import { editWebHook } from "../../../util/editWebHook";
export const deleteWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const wallet = await knex("wallets").select("*").where({
      id,
      user_id: req.user?.id,
    });
    if (!wallet.length) {
      return sendResponse({
        res,
        statusCode: HttpStatusCode.NotFound,
        message: "Wallet not found",
      });
    }
    const deleteRes = await knex("wallets").delete().where({ id });

    if (!deleteRes) {
      return sendResponse({
        res,
        statusCode: HttpStatusCode.InternalServerError,
        message: "Error deleting wallet",
      });
    }
    const balance = await recheckBalanceAndUpdate(req.user?.id as string);

    console.log("🚀 ~ file: deleteWallet.ts:36 ~ balance", balance);
    await editWebHook();
    if (!balance) {
      return sendResponse({
        res,
        statusCode: HttpStatusCode.InternalServerError,
        message: "Error updating balance",
      });
    }
    return sendResponse({
      res,
      statusCode: HttpStatusCode.Ok,
      message: "Wallet deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
