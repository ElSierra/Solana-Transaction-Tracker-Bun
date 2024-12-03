import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";



export const handleErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log({ errors: errors.array() });
    res.status(400).json(errors.array());
  } else {
    next();
  }
};
