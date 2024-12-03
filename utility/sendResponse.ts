import { HttpStatusCode } from "axios";
import { Response } from "express";
export const sendResponse = ({
  res,
  statusCode,
  message,
  data = null,
}: {
  res: Response;
  statusCode: HttpStatusCode;
  message: string;
  data?: any;
}) => {
  const response = {
    status: statusCode,
    message: message,
    data: null,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};
