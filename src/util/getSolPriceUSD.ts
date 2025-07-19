import axios from "axios";

// Cache variables for prices and last check times
interface PriceCache {
  price: number;
  lastChecked: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const priceCache: Record<string, PriceCache> = {
  solana: { price: 0, lastChecked: 0 },
  tether: { price: 0, lastChecked: 0 },
  "usd-coin": { price: 0, lastChecked: 0 },
};

// Helper function to check if cache is still valid
const isCacheValid = (coinId: string): boolean => {
  const now = Date.now();
  return now - priceCache[coinId].lastChecked < CACHE_DURATION;
};

// Helper function to fetch price from API
const fetchCoinPrice = async (coinId: string): Promise<number> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const price = Number(response.data[coinId].usd);

    // Update cache
    priceCache[coinId] = {
      price,
      lastChecked: Date.now(),
    };

    return price;
  } catch (error) {
    console.log("🚀 ~ fetchCoinPrice ~ error:", error)

    // If error occurs, return last known price or 0
    return priceCache[coinId].price || 0;
  }
};

export const getSOLPriceUSD = async (): Promise<number> => {
  if (isCacheValid("solana")) {
    return priceCache["solana"].price;
  }

  return fetchCoinPrice("solana");
};

export const getUSDTPrice = async (): Promise<number> => {
  if (isCacheValid("tether")) {
    return priceCache["tether"].price;
  }

  return fetchCoinPrice("tether");
};

export const getUSDCPrice = async (): Promise<number> => {
  if (isCacheValid("usd-coin")) {
    return priceCache["usd-coin"].price;
  }

  return fetchCoinPrice("usd-coin");
};
