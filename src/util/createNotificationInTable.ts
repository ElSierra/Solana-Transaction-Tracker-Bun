import knex from "../../db/knex";

export const createNotificationInTable = async (
  title: string,
  message: string,
  userId: string,
  transferOut: boolean,
  createdAt: Date,
  walletId: string
) => {
  return knex("notification").insert({
    title,
    message,
    user_id: userId,
    type: transferOut ? "sent" : "receive",
    created_at: createdAt,
    wallet_id: walletId,
  });
};
