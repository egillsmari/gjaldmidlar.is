"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { CurrencyConverterProps } from "./converterInput";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetType } from "@/lib/types";

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

interface Asset {
  code: string;
  name: string;
  type: AssetType;
  value: number;
}

const assetNames: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  BTC: "Bitcoin",
  ETH: "Ethereum",
  XRP: "Ripple",
  LTC: "Litecoin",
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
};

const sortOptions = [
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "popularity", label: "Popularity" },
  { value: "name", label: "Name (A-Z)" },
];

const assetTypes: AssetType[] = ["All", "Currency", "Crypto", "Metal"];

export default function Conversions({ data }: CurrencyConverterProps) {
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>("All");

  const [sortBy, setSortBy] = useState("popularity");
  const [searchTerm, setSearchTerm] = useState("");

  const allAssets: Asset[] = useMemo(() => {
    const currencies = Object.entries(data.currencyRates.conversion_rates).map(
      ([code, value]) => ({
        code,
        name: assetNames[code] || code,
        type: "Currency",
        value,
      }),
    ) satisfies Asset[];
    const cryptos = Object.entries(data.cryptoRates).map(([code, { usd }]) => ({
      code,
      name: assetNames[code] || code,
      type: "Crypto",
      value: usd,
    })) satisfies Asset[];
    const metals = Object.entries(data.metalRates.metals).map(
      ([code, value]) => ({
        code,
        name: assetNames[code] || code,
        type: "Metal",
        value,
      }),
    ) satisfies Asset[];

    return [...currencies, ...cryptos, ...metals];
  }, [data]);

  // const [availableConversions, setAvailableConversions] = useState([
  //   ...data.cryptoRates,
  //   ...data.currencyRates,
  //   ...data.metalRates,
  // ]);

  const filteredAssets = useMemo(() => {
    console.log("filtering assets");

    return allAssets.filter(
      (asset) =>
        (assetTypeFilter === "All" || asset.type === assetTypeFilter) &&
        (asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [allAssets, searchTerm, assetTypeFilter]);

  // TODO: enable this sorting
  // useEffect(() => {
  //   const sorted = [...mockConversions];

  //   switch (sortBy) {
  //     case "priceHigh":
  //       sorted.sort((a, b) => b.price - a.price);
  //       break;
  //     case "priceLow":
  //       sorted.sort((a, b) => a.price - b.price);
  //       break;
  //     case "popularity":
  //       sorted.sort((a, b) => b.popularity - a.popularity);
  //       break;
  //     case "name":
  //       sorted.sort((a, b) => a.name.localeCompare(b.name));
  //       break;
  //   }
  //   setAvailableConversions(
  //     sorted.filter(
  //       (conv) =>
  //         conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         conv.code.toLowerCase().includes(searchTerm.toLowerCase()),
  //     ),
  //   );
  // }, [sortBy, searchTerm]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Til skiptis</h2>
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {assetTypes.map((category) => (
            <Button
              key={category}
              className="text-sm"
              variant={assetTypeFilter === category ? "default" : "outline"}
              onClick={() => setAssetTypeFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Leita"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((conv) => (
            <Card
              key={conv.name}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {conv.code.substring(0, 2)}
                </div>
                <div>
                  <div className="font-semibold">{conv.name}</div>
                  <div className="text-sm text-gray-500">{conv.code}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${conv.value.toFixed(2)}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
