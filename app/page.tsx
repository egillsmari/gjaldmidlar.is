import Link from "next/link";

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
import Conversions from "@/components/conversions";

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
      `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&api_key=CG-wzboML1XEzUiakgrQrKZbfrJ&ids=${top50}`,
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
    return metals;
  } else {
    const data = await fetch(
      `https://api.metals.dev/v1/latest?api_key=LO1JD56UJLIRMSVGTX9B868VGTX9B&currency=ISK&unit=g`,
    );

    if (!data.ok) {
      console.warn("Failed to fetch metal rates");

      return undefined;
    }

    return await data.json();
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
    metalRates,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <HeroSection />
      <CurrencyConverter data={data} />
      <Conversions data={data} />
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          className="flex items-center gap-1 text-current"
          href="https://egillsmari.dev"
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
