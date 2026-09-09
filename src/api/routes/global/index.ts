import { Router } from "express";
import { createAccountOrLogin } from "./../../controller/global/createAccountOrLogin";
import { getWallets } from "../../controller/secure/getWallets";
import { pingWallet } from "../../controller/secure/pingWallet";
import { handleErrors } from "./../../middleware/validation/handleInputValidationErrors";
import { validateAuthGoogle } from "./../../middleware/validation/inputValidation";

const router = Router();

router.get("/", (req, res) => {
  res.json({ msg: "hello cruel world" });
});

router.post(
  "/auth/google",
  validateAuthGoogle,
  handleErrors,
  createAccountOrLogin
);
router.post("/ping-wallet", pingWallet);

export default router;
