"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ArrowDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { AssetType, DataType } from "@/lib/types";

type CurrencyConverterProps = {
  data: DataType;
};

export default function CurrencyConverter({ data }: CurrencyConverterProps) {
  const [topAmount, setTopAmount] = useState("1000");
  const [bottomAmount, setBottomAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedCurrencyType, setSelectedCurrencyType] =
    useState<AssetType>("currency");

  useEffect(() => {
    // calculate bottom amount by using the selected currency from data and top amount
    if (selectedCurrencyType === "currency") {
      setBottomAmount(
        (
          parseFloat(topAmount) *
          data.currencyRates.conversion_rates[selectedCurrency]
        ).toFixed(2),
      );
    }
    if (selectedCurrencyType === "crypto") {
      setBottomAmount(
        (
          parseFloat(topAmount) * data.cryptoRates[selectedCurrency].usd
        ).toFixed(2),
      );
    }
    if (selectedCurrencyType === "metal") {
      setBottomAmount(
        (
          parseFloat(topAmount) * data.metalRates.metals[selectedCurrency]
        ).toFixed(2),
      );
    }
  }, [topAmount, selectedCurrency]);
  console.log("selectedCurrency: ", selectedCurrency);
  console.log("selectedCurrencyType: ", selectedCurrencyType);
  const handleTopAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow positive numbers and empty string
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setTopAmount(value);
      // You could add conversion logic here
      setBottomAmount(value); // For demo purposes, 1:1 conversion
    }
  };

  const handleBottomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow positive numbers and empty string
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setBottomAmount(value);
      // You could add conversion logic here
      setTopAmount(value); // For demo purposes, 1:1 conversion
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <Card className="bg-gray-100 shadow-sm p-4 rounded-xl border">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center gap-2"
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsOpen(true);
              }
            }}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                alt="Icelandic flag"
                className="w-full h-full object-cover"
                src="https://flagcdn.com/is.svg"
              />
            </div>
            <span className="text-lg text-black">ISK</span>
            <ChevronDown className="text-black" />
          </div>
          <div className="ml-auto">
            <input
              className="bg-transparent text-right text-xl text-black w-32 focus:outline-none"
              placeholder="0"
              type="text"
              value={topAmount}
              onChange={handleTopAmountChange}
            />
            <span className="text-black ml-2">ISK</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <div className="bg-black rounded-full p-2">
          <ArrowDown className="text-blue-500" />
        </div>
      </div>

      <Card className="bg-gray-100 shadow-sm p-4 rounded-xl border">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center gap-2"
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsOpen(true);
              }
            }}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                alt="US flag"
                className="w-full h-full object-cover"
                src="https://flagcdn.com/us.svg"
              />
            </div>
            <span className="text-lg text-black">USD</span>
            <ChevronDown className="text-black" />
          </div>
          <div className="ml-auto">
            <input
              className="bg-transparent text-right text-xl text-black w-32 focus:outline-none"
              placeholder="0"
              type="text"
              value={bottomAmount}
              onChange={handleBottomAmountChange}
            />
            <span className="text-black ml-2">$</span>
          </div>
        </div>
      </Card>
      <Drawer
        data={data}
        isOpen={isOpen}
        selectedCurrency={selectedCurrency}
        selectedCurrencyType={selectedCurrencyType}
        onClose={() => setIsOpen(false)}
        onSelectCurrency={(currency) => {
          setSelectedCurrency(currency);
          setIsOpen(false);
        }}
        onSelectCurrencyType={(type) => setSelectedCurrencyType(type)}
      />
    </div>
  );
}
