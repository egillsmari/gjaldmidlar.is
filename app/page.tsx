import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

import CurrencyConverter from "@/components/converterInput";
import { currency, crypto, metals } from "@/lib/data";
import {
  CryptoCurrencyType,
  CurrencyType,
  DataType,
  MetalType,
} from "@/lib/types";
import { filterConversionRates } from "@/lib/utils";
import HeroSection from "@/components/hero";

export const metadata: Metadata = {
  title: "Gjaldmiðlar.is | Gjaldmiðlareikniviðmót",
  description:
    "Gjaldmiðlar.is - Öflug vefsíða til að breyta á milli gjaldmiðla, rafmynta og málma á einfaldan og skjótan hátt.",
  keywords: [
    "gjaldmiðlar",
    "rafmyntir",
    "málmar",
    "gengisreiknivél",
    "currency converter",
    "cryptocurrency",
    "metals",
    "ISK",
    "bitcoin",
    "ethereum",
  ],
  authors: [{ name: "Egill Smári" }],
  category: "Finance",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://gjaldmidlar.is"),
  alternates: {
    canonical: "https://gjaldmidlar.is",
  },
  openGraph: {
    title: "Gjaldmiðlar.is | Rafræn Gengisreiknivél",
    description:
      "Öflug íslensk vefsíða til að umreikna gjaldmiðla, rafmynta og málma á einfaldan hátt.",
    url: "https://gjaldmidlar.is",
    siteName: "Gjaldmiðlar.is",
    locale: "is_IS",
    type: "website",
    // images: [
    //   {
    //     url: "https://gjaldmidlar.is/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Gjaldmiðlar.is Logo",
    //   },
    // ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Gjaldmiðlar.is | Rafræn Gengisreiknivél",
  //   description:
  //     "Öflug íslensk vefsíða til að umreikna gjaldmiðla, rafmynta og málma á einfaldan hátt.",
  //   images: ["https://gjaldmidlar.is/twitter-image.jpg"],
  // },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "bFZ3F4Nx5YHtl-zCK3ZvOVw9oVqNIm7xGYwehxK86O8",
  },
};

const getCurrencyRates = async (): Promise<CurrencyType | undefined> => {
  if (process.env.NODE_ENV === "development") {
    return filterConversionRates(currency as CurrencyType);
  } else {
    const data = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API}/latest/ISK`,
    );

    if (!data.ok) {
      console.warn("Failed to fetch currency rates");

      return undefined;
    }
    const res = await data.json();

    return filterConversionRates(res as CurrencyType);
  }
};

const getCryptoRates = async (): Promise<CryptoCurrencyType | undefined> => {
  if (process.env.NODE_ENV === "development") {
    return crypto;
  } else {
    const top50 =
      "bitcoin,ethereum,xrp,tether,solana,binance-coin,usd-coin,cardano,terra,polkadot,dogecoin,avalanche,shiba-inu,polygon,crypto-com-coin,wrapped-bitcoin,dai,cosmos,near-protocol,chainlink,tron,uniswap,algorand,bitcoin-cash,stellar,vechain,axie-infinity,terrausd,hedera,elrond,theta-fuel,monero,tezos,helium,ftx-token,flow,ethereum-classic,theta,klaytn,magic-internet-money,leo-token,celo,osmosis,bitcoin-sv,iota,curve-dao-token,arweave,quant,neo";
    const data = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&api_key=${process.env.NEXT_PUBLIC_CRYPTO_RATE_API}&ids=${top50}`,
    );

    if (!data.ok) {
      console.warn("Failed to fetch crypto rates");

      return undefined;
    }

    return await data.json();
  }
};

const getMetalRates = async (): Promise<MetalType | undefined> => {
  if (process.env.NODE_ENV === "development") {
    // Also filter the test data in case it contains underscores
    if (metals && metals.metals) {
      const filteredMetals = Object.fromEntries(
        Object.entries(metals.metals).filter(([key]) => !key.includes("_")),
      );

      return { ...metals, metals: filteredMetals };
    }

    return metals;
  } else {
    const data = await fetch(
      `https://api.metals.dev/v1/latest?api_key=LO1JD56UJLIRMSVGTX9B868VGTX9B&currency=ISK&unit=g`,
    );

    if (!data.ok) {
      console.warn("Failed to fetch metal rates");

      return undefined;
    }

    const response = await data.json();

    // More thorough filtering of metals with underscores
    if (response && response.metals) {
      // Log before filtering to debug

      const filteredMetals = Object.fromEntries(
        Object.entries(response.metals).filter(([key]) => !key.includes("_")),
      );

      response.metals = filteredMetals;
    }

    return response;
  }
};

export default async function Home() {
  const currencyRates = await getCurrencyRates();
  const cryptoRates = await getCryptoRates();
  const metalRates = await getMetalRates();

  if (!currencyRates || !cryptoRates || !metalRates) {
    return <>Unkown error</>;
  }
  const data: DataType = {
    currencyRates,
    cryptoRates,
    metalRates: metalRates,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Analytics />
      <HeroSection />
      <CurrencyConverter data={data} />
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          className="flex items-center gap-1 text-current"
          href="https://egillsmari.dev"
          rel="author noopener"
          target="_blank"
          title="Egill Smári - Vefsíða"
        >
          <span className="text-default-600">Höfundur </span>
          <p className="text-primary">Egill</p>
        </Link>
      </footer>
    </div>
  );
}
