import jwt from "jsonwebtoken";
import { HttpStatusCode } from "axios";
import { sendResponse } from "../../../util/sendResponse";
import type { Response, Request, NextFunction } from "express";
import { IUser } from "../../../services/auth";
export const blockJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.headers?.token;
  if (!token) {
    return sendResponse({
      res,
      statusCode: HttpStatusCode.Unauthorized,
      message: "No token provided",
    });
  }
  next();
};

export const protectRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.token as string;
    const token = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as IUser;

    req.user = token;
    next();
  } catch (error) {
    return sendResponse({
      res,
      statusCode: HttpStatusCode.Unauthorized,
      message: "Invalid token provided",
    });
  }
};
