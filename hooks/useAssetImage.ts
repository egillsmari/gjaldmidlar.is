import { useState, useEffect, useRef } from "react";

import { AssetType } from "@/lib/types";
import { fetchCurrencyImg, getMetalColor } from "@/lib/utils";

// Global image cache to prevent redundant fetches
const imageCache: Record<string, string> = {};

// Global queue for CoinGecko API calls
let coinGeckoQueue: (() => void)[] = [];
let isProcessingQueue = false;

// Process the queue with proper spacing between API calls
const processQueue = () => {
  if (coinGeckoQueue.length === 0 || isProcessingQueue) {
    return;
  }

  isProcessingQueue = true;
  const nextCall = coinGeckoQueue.shift();

  nextCall?.();

  setTimeout(() => {
    isProcessingQueue = false;
    processQueue();
  }, 1000); // 1.5 seconds between calls
};

export function useAssetImage(code: string, type: AssetType) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const cacheKey = `${type}-${code}`;

  useEffect(() => {
    // Reset state when inputs change
    setImageUrl("");
    setError(null);

    // For metals, return color immediately
    if (type === "Metal") {
      return;
    }

    // Check cache first
    if (imageCache[cacheKey]) {
      setImageUrl(imageCache[cacheKey]);

      return;
    }

    setIsLoading(true);

    const performFetch = async () => {
      try {
        let url = "";

        if (type === "Crypto") {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${code.toLowerCase()}?tickers=false&market_data=false&community_data=false&developer_data=false&localization=false`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch crypto image");
          }

          const data = await response.json();

          url = data.image?.small || "";
        } else if (type === "Currency") {
          url = fetchCurrencyImg(code, type);
        }

        // Only update state if component is still mounted
        if (isMounted.current) {
          // Cache the result
          if (url) {
            imageCache[cacheKey] = url;
            setImageUrl(url);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : "Failed to load image");
          setIsLoading(false);
        }
      }
    };

    if (type === "Crypto") {
      // Add to queue for CoinGecko API calls
      coinGeckoQueue.push(performFetch);
      processQueue();
    } else {
      // For non-CoinGecko calls, execute immediately
      performFetch();
    }

    // Cleanup: if this component unmounts while in queue, remove it
    return () => {
      coinGeckoQueue = coinGeckoQueue.filter((fn) => fn !== performFetch);
    };
  }, [code, type, cacheKey]);

  // For metals, return color instead of image URL
  const metalColor = type === "Metal" ? getMetalColor(code) : null;

  return { imageUrl, isLoading, error, metalColor };
}
