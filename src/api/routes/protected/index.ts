import { addWallet } from "../../controller/secure/addWallet";
import { deleteWallet } from "../../controller/secure/deleteWallet";
import { getNotifications } from "../../controller/secure/getNotifications";
import { getWallets } from "../../controller/secure/getWallets";
import { handleErrors } from "./../../middleware/validation/handleInputValidationErrors";
import {
  addWalletValidation,
  deleteWalletValidation,
  validateAuthGoogle,
} from "./../../middleware/validation/inputValidation";
import { Router } from "express";

const router = Router();

router.put("/add-wallet", addWalletValidation, handleErrors, addWallet);
router.get("/wallets", getWallets);
router.delete(
  "/delete-wallet",
  deleteWalletValidation,
  handleErrors,
  deleteWallet
);
router.get("/notifications", getNotifications)
export default router;
