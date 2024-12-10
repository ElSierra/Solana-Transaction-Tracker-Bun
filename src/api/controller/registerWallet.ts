import axios from "axios";
import type { Request, Response } from "express";
import { createHeliusJwt } from "../../services/auth";
export const registerHandler = async () => {
  const headerJwt = createHeliusJwt();
  console.log(headerJwt);

  try {
    const response = await axios.post(
      `https://api.helius.xyz/v0/webhooks?api-key=${Bun.env.HELIUS_KEY}`,
      {
        webhookURL:
          "https://webhook.site/e584618c-b779-4f97-9260-9103cc16c4b0",
        transactionTypes: ["TRANSFER"],
        accountAddresses: ["DrVDpsqqYc1R4LJf5oj83js7qtXGvnqtPwwEk2Vibxmz"],
        webhookType: "enhanced", // "rawDevnet"
        txnStatus: "all", // success/failed
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${headerJwt}`,
        },
      }
    );
    console.log({ data: response.data });
  } catch (error: any) {
    console.log(error.response.data);
  }
};

registerHandler().then(() => {
  console.log("Webhook registered successfully");
});
