"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

import Conversions from "./conversions";

import { Card } from "@/components/ui/card";
import { AssetType, DataType } from "@/lib/types";
import {
  fetchCurrencyImg,
  formatNumber,
  getCurrencySymbol,
  getMetalColor,
  parseNumber,
} from "@/lib/utils";

export type CurrencyConverterProps = {
  data: DataType;
};

export default function CurrencyConverter({ data }: CurrencyConverterProps) {
  const [topAmount, setTopAmount] = useState("1000");
  const [bottomAmount, setBottomAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [imageLink, setImageLink] = useState("");
  const [metalColor, setMetalColor] = useState("");
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

        calculatedAmount = usdAmount.toFixed(2);
      } else if (selectedCurrencyType === "Metal") {
        calculatedAmount = (
          parseNumber(topAmount) / data.metalRates.metals[selectedCurrency]
        ).toFixed(2);
      }

      setBottomAmount(calculatedAmount);
    } catch (error) {
      console.error("Error calculating conversion:", error);
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

    // Here you could also fetch the image if needed
    fetchCurrencyImage(code, type);
  };

  // Function to fetch currency images when needed
  const fetchCurrencyImage = (code: string, type: AssetType) => {
    // Reset both image and color before setting new ones
    setImageLink("");
    setMetalColor("");

    if (type === "Metal") {
      // For metals, use colors instead of images
      const color = getMetalColor(code);

      setMetalColor(color);
    } else if (type === "Crypto") {
      fetch(
        `https://api.coingecko.com/api/v3/coins/${code.toLowerCase()}?tickers=false&market_data=false&community_data=false&developer_data=false&localization=false`,
      )
        .then((res) => res.json())
        .then((data) => {
          setImageLink(data.image.small as string);
        })
        .catch((err) => {
          setImageLink("");
        });
    } else {
      const imageUrl = fetchCurrencyImg(code, type);

      setImageLink(imageUrl);
    }
  };

  // Call fetchCurrencyImage on initial load
  useEffect(() => {
    fetchCurrencyImage(selectedCurrency, selectedCurrencyType);
  }, []);

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
              <div className="w-6 h-6 rounded-full overflow-hidden">
                {selectedCurrencyType === "Metal" && metalColor ? (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: metalColor }}
                    title={`${selectedCurrency} color`}
                  />
                ) : imageLink ? (
                  <Image
                    alt={`${selectedCurrency} icon`}
                    className="w-full h-full object-cover"
                    height={40}
                    src={imageLink}
                    width={40}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                    {selectedCurrency.substring(0, 2)}
                  </div>
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
      </div>
      <Conversions
        data={data}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={handleCurrencySelect}
      />
    </>
  );
}
