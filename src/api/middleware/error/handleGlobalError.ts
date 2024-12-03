import { NextFunction, Request } from "express";
import { sendResponse } from "../../../../utility/sendResponse";

const convertCamelToSpaces = (text: string): string => {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};

export const ErrorHandler = (
  error: any,
  req: Request,
  res: any,
  next?: NextFunction
) => {
  //handle google oauth error
  if (error.name === "Error") {
    return sendResponse({
      res,
      statusCode: 400,
      message: error.message,
    });
  }

  return sendResponse({
    res,
    statusCode: 500,
    message: error.message,
  });
};
