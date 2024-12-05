import knex from "../../../../db/knex";
import type { Request, Response } from "express";
import { sendResponse } from "../../../util/sendResponse";
import { HttpStatusCode } from "axios";
export const deleteWallet = async (req: Request, res: Response) => {
    const { address } = req.body;
    const wallet = await knex("wallets").select("*").where({
        address,
        user_id: req.user?.id,
    });
    if (!wallet.length) {
        return sendResponse({
        res,
        statusCode: HttpStatusCode.NotFound,
        message: "Wallet not found",
        });
    }
    await knex("wallets").delete().where({ address });
    return sendResponse({
        res,
        statusCode: HttpStatusCode.Ok,
        message: "Wallet deleted successfully",
    });
    };