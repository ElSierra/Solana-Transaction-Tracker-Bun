import axios from "axios";
import { Request } from "express";
import { Response } from "express";
import { getAllWebHooks } from "./getWebHook";
import knex from "../../db/knex";
export const editWebHook = async () => {
  try {
    const webHooks = await getAllWebHooks();
    const wallets = await knex("wallets").select("address");

    if (webHooks.length === 0) {
      console.log("No webhooks found");
      return;
    }
    if (wallets.length === 0) {
      console.log("No wallets found");
      return;
    }
    const walletList = wallets.map((wallet) => wallet.address);

    console.log("🚀 ~ file: editWebHook.ts:13 ~ wallets:", walletList);

    const response = await axios.put(
      `https://api.helius.xyz/v0/webhooks/${webHooks[0].webhookID}?api-key=${Bun.env.HELIUS_KEY}`,
      {
        webhookURL: Bun.env.WEBHOOK_URL,
        transactionTypes: ["TRANSFER"],
        accountAddresses: walletList,
        webhookType: "enhanced",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw new Error(error);
  }
};

