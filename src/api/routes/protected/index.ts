import { addWallet } from "../../controller/secure/addWallet";
import { getWallets } from "../../controller/secure/getWallets";
import { handleErrors } from "./../../middleware/validation/handleInputValidationErrors";
import {
  addWalletValidation,
  validateAuthGoogle,
} from "./../../middleware/validation/inputValidation";
import { Router } from "express";

const router = Router();

router.put("/add-wallet", addWalletValidation, handleErrors, addWallet);
router.get("/wallets", getWallets);

export default router;
