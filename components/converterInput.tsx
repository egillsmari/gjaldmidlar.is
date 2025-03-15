"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { AssetType, DataType } from "@/lib/types";
import { formatNumber, getCurrencySymbol, parseNumber } from "@/lib/utils";

export type CurrencyConverterProps = {
  data: DataType;
};

export default function CurrencyConverter({ data }: CurrencyConverterProps) {
  const [topAmount, setTopAmount] = useState("1000");
  const [bottomAmount, setBottomAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [imageLink, setImageLink] = useState("");
  const [selectedCurrencyType, setSelectedCurrencyType] =
    useState<AssetType>("Currency");

  useEffect(() => {
    // calculate bottom amount by using the selected currency from data and top amount
    if (selectedCurrencyType === "Currency") {
      setBottomAmount(
        (
          parseNumber(topAmount) *
          data.currencyRates.conversion_rates[selectedCurrency]
        ).toFixed(2),
      );
    }
    if (selectedCurrencyType === "Crypto") {
      const usdAmount =
        parseNumber(topAmount) / data.cryptoRates[selectedCurrency].usd;

      setBottomAmount(usdAmount.toFixed(2));
    }
    if (selectedCurrencyType === "Metal") {
      setBottomAmount(
        (
          parseNumber(topAmount) / data.metalRates.metals[selectedCurrency]
        ).toFixed(2),
      );
    }
  }, [topAmount, selectedCurrency, bottomAmount]);

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

  // useEffect(() => {
  //   if (selectedCurrencyType === "crypto") {
  //     fetch(
  //       `https://api.coingecko.com/api/v3/coins/${selectedCurrency}?tickers=false&market_data=false&community_data=false&developer_data=false&localization=false`,
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setImageLink(data.image.small as string);
  //       });
  //   } else {
  //     setImageLink(fetchCurrencyImg(selectedCurrency, selectedCurrencyType));
  //   }
  // }, [selectedCurrency]);

  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-12">
      <Card className="bg-gray-100 shadow-sm p-4 rounded-xl">
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
        <div className=" rounded-full p-2">
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
              {imageLink && (
                <Image
                  alt="flag"
                  className="w-full h-full object-cover"
                  height={40}
                  src={imageLink}
                  width={40}
                />
              )}
            </div>
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
              {getCurrencySymbol(selectedCurrency)}
            </span>
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
