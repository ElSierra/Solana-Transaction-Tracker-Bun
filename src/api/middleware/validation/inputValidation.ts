import { body, header, param, query } from "express-validator";

export const validateAuthGoogle = [
  header("id_token")
    .isString()
    .withMessage("Token must be a string")
    .notEmpty()
    .withMessage("Token cannot be empty"),
];

export const addWalletValidation = [
  body("walletName")
    .isString()
    .withMessage("Wallet name must be a string")
    .notEmpty()
    .withMessage("Wallet name cannot be empty"),
  body("walletAddress")
    .custom((value) => {
      // Solana addresses are base58 encoded and typically 32 or 44 characters long
      const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (!solanaAddressRegex.test(value)) {
        throw new Error("Wallet address must be a valid Solana address");
      }
      return true;
    })
    .withMessage("Wallet address must be a valid Solana address"),
  body("emojiId").isInt().withMessage("Emoji ID must be an integer"),
];
