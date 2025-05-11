"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

import { AssetImage } from "./asset-image";
import Conversions from "./conversions";
import { Button } from "./ui/button";

import { Card } from "@/components/ui/card";
import { AssetType, DataType } from "@/lib/types";
import { getCurrencySymbol, parseNumber, formatNumber } from "@/lib/utils";

export type CurrencyConverterProps = {
  data: DataType;
};

export default function CurrencyConverter({ data }: CurrencyConverterProps) {
  const [topAmount, setTopAmount] = useState("1000");
  const [bottomAmount, setBottomAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedCurrencyType, setSelectedCurrencyType] =
    useState<AssetType>("Currency");

  useEffect(() => {
    // calculate bottom amount based on the selected currency type and value
    let calculatedAmount = "0";

    try {
      if (selectedCurrencyType === "Currency") {
        calculatedAmount = (
          parseNumber(topAmount) *
          data.currencyRates.conversion_rates[selectedCurrency]
        ).toFixed(2);
      } else if (selectedCurrencyType === "Crypto") {
        const usdAmount =
          parseNumber(topAmount) / data.cryptoRates[selectedCurrency]?.usd;

        if (usdAmount.toString().length > 6) {
          calculatedAmount = usdAmount.toFixed(4);
        } else {
          calculatedAmount = usdAmount.toFixed(8);
        }
      } else if (selectedCurrencyType === "Metal") {
        calculatedAmount = (
          parseNumber(topAmount) / data.metalRates.metals[selectedCurrency]
        ).toFixed(4);
      }
      setBottomAmount(calculatedAmount);
    } catch (error) {
      setBottomAmount("0");
    }
  }, [topAmount, selectedCurrency, selectedCurrencyType, data]);

  const handleTopAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "");

    // Only allow positive numbers and empty string
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setTopAmount(value);
    }
  };

  const handleBottomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "");

    // Only allow positive numbers and empty string
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setBottomAmount(value);
    }
  };

  const handleCurrencySelect = (code: string, type: AssetType) => {
    setSelectedCurrency(code);
    setSelectedCurrencyType(type);
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-12 mb-12">
        <Card className="bg-gray-100 shadow-sm p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2" role="button" tabIndex={0}>
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  alt="Icelandic flag"
                  className="w-full h-full object-cover"
                  src="https://flagcdn.com/is.svg"
                />
              </div>
              <span className="text-lg text-black">ISK</span>
            </div>
            <div className="ml-auto">
              <input
                className="bg-transparent text-right text-xl text-black w-32 focus:outline-none"
                placeholder="0"
                type="text"
                value={formatNumber(parseNumber(topAmount))}
                onChange={handleTopAmountChange}
              />
              <span className="text-black ml-2">ISK</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <div className="rounded-full p-2">
            <ArrowDown className="text-blue-500" />
          </div>
        </div>

        <Card className="bg-gray-100 shadow-sm p-4 rounded-xl border">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2" role="button" tabIndex={0}>
              <AssetImage
                code={selectedCurrency}
                size={24}
                type={selectedCurrencyType}
              />
              <span className="text-lg text-black">{selectedCurrency}</span>
            </div>
            <div className="ml-auto">
              <input
                className="bg-transparent text-right text-xl text-black w-32 focus:outline-none"
                placeholder="0"
                type="text"
                value={bottomAmount}
                onChange={handleBottomAmountChange}
              />
              <span className="text-black ml-2">
                {getCurrencySymbol(selectedCurrency, selectedCurrencyType)}
              </span>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-center gap-4 mt-4 mb-4">
        <Button
          className="text-sm w-36"
          variant="action"
          onClick={() => {
            handleCurrencySelect("bitcoin", "Crypto");
          }}
        >
          Bitcoin í ISK
        </Button>
        <Button
          className="text-sm w-36"
          variant="action"
          onClick={() => {
            handleCurrencySelect("gold", "Metal");
          }}
        >
          Gull í ISK
        </Button>
        <Button
          className="text-sm w-36"
          variant="action"
          onClick={() => {
            handleCurrencySelect("EUR", "Currency");
          }}
        >
          EUR í ISK
        </Button>
      </div>
      <Conversions
        data={data}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={handleCurrencySelect}
      />
    </>
  );
}
