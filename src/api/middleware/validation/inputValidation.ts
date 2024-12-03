import { body, header, param, query } from "express-validator";

export const validateAuthGoogle = [
  header("id_token")
    .isString()
    .withMessage("Token must be a string")
    .notEmpty()
    .withMessage("Token cannot be empty"),
];
