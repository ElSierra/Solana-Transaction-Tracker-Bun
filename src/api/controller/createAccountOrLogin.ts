import { sendResponse } from "./../../../utility/sendResponse";
import type { Response, Request, NextFunction } from "express";
import { client } from "./../../../config/google/client";
import knex from "../../../db/knex";
import { createAccessToken } from "../../services/auth";

export const createAccountOrLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_token } = req.headers;
    console.log(req.headers);

    const ticket = await client.verifyIdToken({
      idToken: id_token as string,
    });

    const payload = ticket.getPayload();
    console.log(payload);
    if (!payload) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Invalid token",
      });
    }

    let { email, name, picture } = payload;
    picture = picture?.split("=s96-c")?.[0] + "=s400-c";

    if (!email || !name || !picture) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Invalid token",
      });
    }

    // Check if user exists in database
    const user = await knex.raw(`SELECT id, name, email,picture FROM users WHERE email = ? LIMIT 1`, [
      email,
    ]);
  

    if (user.rows.length === 0) {
      // Create user
      const createdUser = await knex.raw(
        `INSERT INTO users (name, email, picture) VALUES (?, ?, ?)
        RETURNING id, name, email, picture
        `,
        [name, email, picture]
      );

      if (createdUser.rowCount === 0) {
        return sendResponse({
          res,
          statusCode: 400,
          message: "Failed to create user",
        });
      }

      const newUser = createdUser.rows[0];

      return sendResponse({
        res,
        statusCode: 200,
        message: "User created successfully",
        data: {
          ...newUser,
          token: createAccessToken({ email, id: newUser.id }),
        },
      });
    }
    const existingUser = user.rows[0];
    createAccessToken({ email, id: existingUser.id });
    return sendResponse({
      res,
      statusCode: 200,
      message: "User already exists",
      data: {
        ...existingUser,
        token: createAccessToken({ email, id: existingUser.id }),
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
