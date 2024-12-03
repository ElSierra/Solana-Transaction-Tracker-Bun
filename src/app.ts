import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import router from "./api/routes/global";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

export default app;
