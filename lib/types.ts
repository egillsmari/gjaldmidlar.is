/**
 * @file This file contains all the **shared** types used in the application.
 */
export type CurrencyType = {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
};

export type CryptoCurrencyType = {
  [key: string]: {
    usd: number;
  };
};

export type MetalType = {
  status: string;
  currency: string;
  unit: string;
  metals: {
    [key: string]: number;
  };
  currencies: {
    [key: string]: number;
  };
  timestamps: {
    metal: string;
    currency: string;
  };
};

export type DataType = {
  currencyRates: CurrencyType;
  cryptoRates: CryptoCurrencyType;
  metalRates: MetalType;
};

export type AssetType = "Currency" | "Crypto" | "Metal" | "All";
