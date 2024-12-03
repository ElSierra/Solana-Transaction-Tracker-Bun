import jwt from "jsonwebtoken";
import { HttpStatusCode } from "axios";
import { sendResponse } from "../../../../utility/sendResponse";
import type { Response, Request, NextFunction } from "express";
export const blockJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.body?.token;
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
    const accessToken = req.body.token;
    const token = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );
  } catch (error) {
    next(error);
  }
};
