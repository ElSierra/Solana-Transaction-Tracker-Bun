import * as OneSignal from "@onesignal/node-onesignal";
import axios from "axios";
import * as dotenv from "dotenv";
import knex from "../db/knex";
import { getTokenBalance } from "./util/getTokenUSDTBalance";

console.log(
  process.env.ONE_SIGNAL_KEY,
  process.env.ONE_SIGNAL_USER_AUTH_KEY,
  process.env.ONE_SIGNAL_APP_ID
);
