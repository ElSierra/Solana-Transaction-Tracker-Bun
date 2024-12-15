import axios from "axios";

export const getSOLPriceUSD = async () => {
  try {
    const solPrice = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );

    return Number(solPrice.data.solana.usd);
  } catch (error) {
    return 0;
  }
};

export const getUSDTPrice = async () => {
  try {
    const usdtPrice = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
    );

    return Number(usdtPrice.data.tether.usd);
  } catch (error) {
    return 0;
  }
}

export const getUSDCPrice = async () => {
  try {
    const usdcPrice = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd"
    );

    return Number(usdcPrice.data["usd-coin"].usd);
  } catch (error) {
    return 0;
  }
}