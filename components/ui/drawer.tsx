"use client";

import * as React from "react";
import { Check, ChevronLeft, Search } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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

interface AssetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DataType;
  selectedCurrency: string;
  onSelectCurrency: (asset: string) => void;
  selectedCurrencyType: AssetType;
  onSelectCurrencyType: (type: AssetType) => void;
}

export function Drawer({
  isOpen,
  onClose,
  data,
  selectedCurrency,
  onSelectCurrency,
  selectedCurrencyType,
  onSelectCurrencyType,
}: AssetDrawerProps) {
  const [search, setSearch] = React.useState("");
  const [assetTypeFilter, setAssetTypeFilter] = React.useState<
    AssetType | "all"
  >("all");

  const allAssets: Asset[] = React.useMemo(() => {
    const currencies = Object.entries(data.currencyRates.conversion_rates).map(
      ([code, value]) => ({
        code,
        name: assetNames[code] || code,
        type: "currency" as AssetType,
        value,
      }),
    );
    const cryptos = Object.entries(data.cryptoRates).map(([code, { usd }]) => ({
      code,
      name: assetNames[code] || code,
      type: "crypto" as AssetType,
      value: usd,
    }));
    const metals = Object.entries(data.metalRates.metals).map(
      ([code, value]) => ({
        code,
        name: assetNames[code] || code,
        type: "metal" as AssetType,
        value,
      }),
    );

    return [...currencies, ...cryptos, ...metals];
  }, [data]);

  const filteredAssets = React.useMemo(() => {
    return allAssets.filter(
      (asset) =>
        (assetTypeFilter === "all" || asset.type === assetTypeFilter) &&
        (asset.code.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())),
    );
  }, [allAssets, search, assetTypeFilter]);

  const renderAssetItem = (asset: Asset) => {
    return (
      <button
        key={asset.code}
        className={cn(
          "w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors",
          selectedCurrency === asset.code && "bg-zinc-800",
        )}
        onClick={() => onSelectCurrency(asset.code)}
      >
        <div className="flex-shrink-0">
          <img
            alt=""
            className="w-8 h-8 rounded-full object-cover"
            src={`https://flagcdn.com/${asset.code.toLowerCase()}.svg`}
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${asset.code}&background=random`;
            }}
          />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-white">{asset.code}</span>
            {selectedCurrency === asset.code && (
              <Check className="h-5 w-5 text-white" />
            )}
          </div>
          <span className="text-sm text-zinc-400">{asset.name}</span>
        </div>
        <div className="text-right text-zinc-400">
          {asset.value.toFixed(2)}{" "}
          {asset.type === "currency"
            ? data.currencyRates.base_code
            : asset.type === "crypto"
              ? "USD"
              : data.metalRates.currency}
        </div>
      </button>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-full max-w-md p-0 bg-zinc-900 border-zinc-800"
        side="right"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                className="text-zinc-400 hover:text-white"
                onClick={onClose}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <SheetTitle className="text-2xl font-bold text-white">
                Choose asset
              </SheetTitle>
            </div>
            <div className="space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                <Input
                  className="pl-10 bg-zinc-800 border-transparent text-white placeholder:text-zinc-400"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                value={assetTypeFilter}
                onValueChange={(value: string) => {
                  setAssetTypeFilter(value as AssetType | "all");
                  onSelectCurrencyType(value as AssetType);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-800 border-transparent text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-auto divide-y divide-zinc-800">
            {filteredAssets.map(renderAssetItem)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
