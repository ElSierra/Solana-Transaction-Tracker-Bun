import { Router } from "express";
import { getTokenBalance } from "../../../util/getTokenUSDTBalance";
import { createAccountOrLogin } from "./../../controller/global/createAccountOrLogin";
import { getWallets } from "../../controller/secure/getWallets";
import { pingWallet } from "../../controller/secure/pingWallet";
import { handleErrors } from "./../../middleware/validation/handleInputValidationErrors";
import { validateAuthGoogle } from "./../../middleware/validation/inputValidation";

const router = Router();

router.get("/", (req, res) => {
  console.log(process.env.DATABASE_URL);
  getTokenBalance(
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "9UjSaucXtFHgjYwdxu9LZ872VkkM2YMB7WaYHJJsVHxa"
  )
    .then((balance) => {
      console.log("USDT Balance:", balance);
    })
    .catch((error) => {
      console.error("Error fetching USDT balance:", error);
    });
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
