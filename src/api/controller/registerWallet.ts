import axios from "axios";
import type { Request, Response } from "express";
export const registerHandler = async (req: Request, res: Response) => {
  const { wallet, userId } = req.body;

  console.log(wallet, userId);

  try {
    const response = await axios.post(
      `https://api.helius.xyz/v0/webhooks?api-key=${Bun.env.HELIIUS_KEY}`,
      {
        webhookURL: "",
        transactionTypes: ["TRANSFER"],
        accountAddresses: [""],
        webhookType: "enhanced", // "rawDevnet"
        txnStatus: "all", // success/failed
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log({ data: response.data });
  } catch (error: any) {
    console.log(error.response.data);
  }
};
