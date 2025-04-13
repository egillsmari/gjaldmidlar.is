import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { AssetType, CurrencyType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrencySymbol = (code: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: "$", // US Dollar
    EUR: "€", // Euro
    ISK: "kr", // Icelandic Króna
    GBP: "£", // British Pound Sterling
    JPY: "¥", // Japanese Yen
    AUD: "A$", // Australian Dollar
    CAD: "C$", // Canadian Dollar
    CHF: "CHF", // Swiss Franc
    SEK: "kr", // Swedish Krona
    NOK: "kr", // Norwegian Krone
    DKK: "kr", // Danish Krone
    INR: "₹", // Indian Rupee
    CNY: "¥", // Chinese Yuan
    RUB: "₽", // Russian Ruble
    KRW: "₩", // South Korean Won
    BRL: "R$", // Brazilian Real
    ZAR: "R", // South African Rand

    // Cryptocurrencies
    bitcoin: "₿", // Bitcoin
    ethereum: "Ξ", // Ethereum
    litecoin: "Ł", // Litecoin
    dogecoin: "Ð", // Dogecoin
    ripple: "XRP", // Ripple (symbol is its code)
    tether: "₮", // Tether
    cardano: "₳", // Cardano
    polkadot: "●", // Polkadot
    binancecoin: "ⓑ", // Binance Coin
    solana: "◎", // Solana
    stellar: "✦", // Stellar
  };

  return currencySymbols[code] || code;
};

export const getCountryCodeFromCurrencyCode = (
  currencyCode: string,
): string => {
  const currencyToCountry: Record<string, string> = {
    // Fiat currencies
    USD: "us", // United States Dollar
    EUR: "eu", // Euro (European Union)
    ISK: "is", // Icelandic Króna
    GBP: "gb", // British Pound Sterling
    JPY: "jp", // Japanese Yen
    AUD: "au", // Australian Dollar
    CAD: "ca", // Canadian Dollar
    CHF: "ch", // Swiss Franc
    SEK: "se", // Swedish Krona
    NOK: "no", // Norwegian Krone
    DKK: "dk", // Danish Krone
    INR: "in", // Indian Rupee
    CNY: "cn", // Chinese Yuan
    RUB: "ru", // Russian Ruble
    KRW: "kr", // South Korean Won
    BRL: "br", // Brazilian Real
    ZAR: "za", // South African Rand

    // Cryptocurrencies (mapped to their global nature or platform)
    bitcoin: "global",
    ethereum: "global",
    litecoin: "global",
    dogecoin: "global",
    ripple: "global",
    tether: "global",
    cardano: "global",
    polkadot: "global",
    binancecoin: "global",
    solana: "global",
    stellar: "global",
  };

  // Normalize input to uppercase for fiat currencies and lowercase for cryptocurrencies
  const normalizedCode = /^[a-z]+$/.test(currencyCode)
    ? currencyCode.toLowerCase()
    : currencyCode.toUpperCase();

  return currencyToCountry[normalizedCode] || currencyCode.toLowerCase();
};

export const filterConversionRates = (
  currencyObj: CurrencyType,
): CurrencyType => {
  const allowedCurrencies = [
    "USD",
    "EUR",
    "ISK",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "SEK",
    "NOK",
    "DKK",
    "INR",
    "CNY",
    "RUB",
    "KRW",
    "BRL",
    "ZAR",
  ];
  const filteredRates: { [key: string]: number } = {};

  for (const key of allowedCurrencies) {
    if (currencyObj.conversion_rates[key] !== undefined) {
      filteredRates[key] = currencyObj.conversion_rates[key];
    }
  }

  return {
    ...currencyObj,
    conversion_rates: filteredRates,
  };
};

export const fetchCurrencyImg = (
  currencyCode: string,
  currencyType: AssetType,
): string => {
  if (currencyType === "Currency") {
    return `https://flagcdn.com/${getCountryCodeFromCurrencyCode(currencyCode)}.svg`;
  }
  if (currencyType === "Metal") {
    return `https://metals-api.com/images/metal/${currencyCode}.png`;
  } else {
    return "";
  }
};

export const fetchCryptoImg = (currencyCode: string) => {
  fetch(
    `https://api.coingecko.com/api/v3/coins/${currencyCode}?tickers=false&market_data=false&community_data=false&developer_data=false&localization=false`,
  )
    .then((res) => res.json())
    .then((data) => {
      return data.image.small as string;
    });
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("de-DE").format(value);
};

export const parseNumber = (value: string) => {
  return parseFloat(value.replace(/\./g, "").replace(/,/g, "."));
};

export const getMetalColor = (metalCode: string): string => {
  // Normalize the metal code to lowercase for consistent matching
  const normalizedCode = metalCode.toLowerCase();

  // Map of metal codes to their representative colors
  const metalColors: Record<string, string> = {
    // Base metals
    gold: "#FFD700",
    silver: "#C0C0C0",
    platinum: "#E5E4E2",
    palladium: "#CED0DD",
    copper: "#B87333",
    aluminum: "#D3D3D3",
    lead: "#2C3539",
    nickel: "#727472",
    zinc: "#A9A9A9",

    // Handle variant codes by checking if they contain the metal name
    xau: "#FFD700", // Gold
    xag: "#C0C0C0", // Silver
    xpt: "#E5E4E2", // Platinum
    xpd: "#CED0DD", // Palladium
  };

  // Check if the code is a variant (contains the metal name)
  for (const [metal, color] of Object.entries(metalColors)) {
    if (normalizedCode.includes(metal)) {
      return color;
    }
  }

  // Default metal color if specific match not found
  return "#B0B0B0"; // Generic metallic gray
};
