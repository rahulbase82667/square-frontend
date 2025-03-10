
// Cache exchange rate for 1 hour
let cachedRate: number | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export const getGBPToUSDRate = async (): Promise<number> => {
  const now = Date.now();
  
  // Return cached rate if still valid
  if (cachedRate && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRate;
  }
  
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    const data = await response.json();
    cachedRate = data.rates.USD;
    lastFetchTime = now;
    return cachedRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1.27; // Fallback rate if API fails
  }
};

export const formatGBP = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
