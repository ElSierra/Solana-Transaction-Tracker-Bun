import { sendResponse } from "./../../../utility/sendResponse";
import type { Response, Request, NextFunction } from "express";
import { client } from "./../../../config/google/client";
import knex from "knex";

export const createAccountOrLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Invalid token",
      });
    }

    const { email, name, picture } = payload;

    // Check if user exists in database
    const user = await knex("users").raw(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (user.rows.length === 0) {
      // Create user
      await knex("users").raw(
        `INSERT INTO users (name, email, picture) VALUES (?, ?, ?)`,
        [name, email, picture]
      );
    }
   
  } catch (error) {
    next(error);
  }
};
