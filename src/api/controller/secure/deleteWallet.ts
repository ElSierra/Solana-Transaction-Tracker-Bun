import knex from "../../../../db/knex";
import type { Request, Response } from "express";
import { sendResponse } from "../../../util/sendResponse";
import { HttpStatusCode } from "axios";
import { recheckBalanceAndUpdate } from "../../../util/recheckBalanceAndUpdate";
export const deleteWallet = async (req: Request, res: Response) => {
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
  recheckBalanceAndUpdate(req.user?.id as string);
  return sendResponse({
    res,
    statusCode: HttpStatusCode.Ok,
    message: "Wallet deleted successfully",
  });
};
