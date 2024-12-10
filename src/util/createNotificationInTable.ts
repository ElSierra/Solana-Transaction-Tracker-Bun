import knex from "../../db/knex";

export const createNotificationInTable = async (title: string, message: string, userId: string) => {


    return knex("notification").insert({
        title,
        message,
        user_id: userId,
    });
}
