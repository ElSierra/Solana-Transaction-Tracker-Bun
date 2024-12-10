import knex from "../../../../db/knex";
import { Request, Response } from "express";
export const getNotifications = async (req: Request, res: Response) => {
  const { id } = req.user as any;
console.log("🚀 ~ file: getNotifications.ts:7 ~ getNotifications ~ id", id)
  const notifications = await knex("notification")
   
    .select({
        id: "id",
        title: "title",
        message: "message",
        type: "type",
        createdAt: "created_at",
        walletId : "wallet_id"
    })
    .where({ user_id: id })
    .orderBy("created_at", "desc");

    console.log("🚀 ~ file: getNotifications.ts:7 ~ getNotifications ~ notifications:", notifications)


  res.json(notifications);
};
