import { createAccountOrLogin } from "./../../controller/global/createAccountOrLogin";
import { handleErrors } from "./../../middleware/validation/handleInputValidationErrors";
import { validateAuthGoogle } from "./../../middleware/validation/inputValidation";
import { Router } from "express";


const router = Router();

router.get("/", (req, res) => {
  console.log(process.env.DATABASE_URL);
  res.json({ msg: "hello cruel world" });
});

router.post(
  "/auth/google",
  validateAuthGoogle,
  handleErrors,
  createAccountOrLogin
);

export default router;
