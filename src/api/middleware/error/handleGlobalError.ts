import { NextFunction, Request } from "express";
import { sendResponse } from "../../../util/sendResponse";

const convertCamelToSpaces = (text: string): string => {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};

export const ErrorHandler = (
  error: any,
  req: Request,
  res: any,
  next?: NextFunction
) => {
  if (error.code === "23505") {
    // Handle unique constraint violation
    return sendResponse({
      res,
      statusCode: 400,
      message: "Wallet already exists",
    });
  }

  if (error.code === "22P02") {
    // Handle invalid input
    const errorField = convertCamelToSpaces(error.column);
    return sendResponse({
      res,
      statusCode: 400,
      message: `Invalid input for ${errorField}`,
    });
  }
  if (error.code === "23503") {
    // Handle foreign key constraint violation
    return sendResponse({
      res,
      statusCode: 404,
      message: "User not found",
    });
  }

  return sendResponse({
    res,
    statusCode: 500,
    message: error.message,
  });
};
