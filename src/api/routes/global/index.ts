import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  console.log(process.env.DATABASE_URL);
  res.json({ msg: "hello cruel world" });
});

router.post("/hook", (req, res) => {
  console.log(req.body);
});

export default router;
