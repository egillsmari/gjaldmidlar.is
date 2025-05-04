"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { CurrencyConverterProps } from "./converterInput";
import { AssetImage } from "./asset-image";

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
  // Add common metals from data
  gold: "Gold",
  silver: "Silver",
  platinum: "Platinum",
  palladium: "Palladium",
  copper: "Copper",
  aluminum: "Aluminum",
  lead: "Lead",
  nickel: "Nickel",
  zinc: "Zinc",
};

const sortOptions = [
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "popularity", label: "Popularity" },
  { value: "name", label: "Name (A-Z)" },
];

const assetTypes: AssetType[] = ["All", "Currency", "Crypto", "Metal"];

interface ConversionsProps extends CurrencyConverterProps {
  onSelectCurrency?: (code: string, type: AssetType) => void;
  selectedCurrency?: string;
  selectedCurrencyType?: AssetType;
}

const getMetalName = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
};

const getCryptoName = (name: string) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
};

const getAssetDisplayName = (asset: Asset): string => {
  if (asset.type === "Crypto") {
    // For crypto, transform hyphenated names to title case
    return asset.name !== asset.code
      ? asset.name
      : asset.code
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
          .join(" ");
  } else if (asset.type === "Metal") {
    // For metals, handle prefixed names (lbma_, mcx_, etc.)
    const baseName = asset.code.split("_").pop() || asset.code;

    return baseName.charAt(0).toUpperCase() + baseName.substring(1);
  } else {
    // For currencies, use the provided name or code
    return asset.name;
  }
};

const getAssetCode = (asset: Asset): string => {
  if (asset.type === "Crypto") {
    return asset.code.toUpperCase();
  } else if (asset.type === "Metal") {
    // Show original code for metals
    return asset.code;
  } else {
    return asset.code;
  }
};

export default function Conversions({
  data,
  onSelectCurrency,
  selectedCurrency,
}: ConversionsProps) {
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
      name: assetNames[code] || getCryptoName(code),
      type: "Crypto",
      value: usd,
    })) satisfies Asset[];

    const metals = Object.entries(data.metalRates.metals).map(
      ([code, value]) => ({
        code,
        name: assetNames[code] || getMetalName(code),
        type: "Metal",
        value,
      }),
    ) satisfies Asset[];

    return [...currencies, ...cryptos, ...metals];
  }, [data]);

  const filteredAssets = useMemo(() => {
    return allAssets.filter(
      (asset) =>
        (assetTypeFilter === "All" || asset.type === assetTypeFilter) &&
        (asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [allAssets, searchTerm, assetTypeFilter]);

  const sortedAssets = useMemo(() => {
    const sorted = [...filteredAssets];

    switch (sortBy) {
      case "priceHigh":
        return sorted.sort((a, b) => b.value - a.value);
      case "priceLow":
        return sorted.sort((a, b) => a.value - b.value);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "popularity":
      default:
        return sorted;
    }
  }, [filteredAssets, sortBy]);

  const handleAssetSelect = (asset: Asset) => {
    if (onSelectCurrency) {
      onSelectCurrency(asset.code, asset.type);
    }
  };

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
              <span>{category}</span>
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
          {sortedAssets.map((asset) => (
            <Card
              key={`${asset.type}-${asset.code}`}
              className={`p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                selectedCurrency === asset.code
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02] transform"
                  : "hover:bg-gray-50 border-border"
              }`}
              onClick={() => handleAssetSelect(asset)}
            >
              <div className="flex items-center gap-3">
                <AssetImage
                  className="flex-shrink-0"
                  code={asset.code}
                  size={40}
                  type={asset.type}
                />
                <div>
                  <div className="font-semibold">
                    {getAssetDisplayName(asset)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getAssetCode(asset)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
