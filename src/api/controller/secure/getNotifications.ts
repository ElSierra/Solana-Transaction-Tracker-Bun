import knex from "../../../../db/knex";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../util/sendResponse";

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user as any;
  console.log("🚀 ~ file: getNotifications.ts:7 ~ getNotifications ~ id", id);
  try {
    const notifications = await knex("notification")
      .join("wallets", "notification.wallet_id", "=", "wallets.id")
      .where({
        "notification.user_id": id,
      })
      .select({
        id: "notification.id",
        title: "notification.title",
        message: "notification.message",
        type: "notification.type",
        createdAt: "notification.created_at",
        walletId: "wallets.id",
        walletName: "wallets.name",
      });

    console.log(
      "🚀 ~ file: getNotifications.ts:7 ~ getNotifications ~ notifications:",
      notifications
    );
    sendResponse({
      res,
      statusCode: 200,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
