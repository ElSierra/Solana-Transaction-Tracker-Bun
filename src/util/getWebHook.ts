import axios from "axios";

export const getAllWebHooks = async () => {
    console.log(Bun.env.HELIUS_KEY);
  const res = await axios.get(
    `https://api.helius.xyz/v0/webhooks?api-key=${Bun.env.HELIUS_KEY}`
  );
  return res.data
};
