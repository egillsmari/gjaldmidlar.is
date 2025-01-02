import { color } from "@/components/primitives";
import CurrencyConverter from "@/components/converterInput";
import { currency, crypto, metals } from "@/lib/data";
import {
  CryptoCurrencyType,
  CurrencyType,
  DataType,
  MetalType,
} from "@/lib/types";

const getCurrencyRates = async (): Promise<CurrencyType> => {
  if (process.env.NODE_ENV === "development") {
    return currency;
  } else {
    const data = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API}/latest/ISK`,
    );

    return await data.json();
  }
};

const getCryptoRates = async (): Promise<CryptoCurrencyType> => {
  if (process.env.NODE_ENV === "development") {
    return crypto;
  } else {
    const data = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=0chain&vs_currencies=eur`,
    );

    return await data.json();
  }
};

const getMetalRates = async (): Promise<MetalType> => {
  if (process.env.NODE_ENV === "development") {
    return metals;
  } else {
    const data = await fetch(
      `https://api.metals.dev/v1/latest?api_key=LO1JD56UJLIRMSVGTX9B868VGTX9B&currency=ISK&unit=g`,
    );

    return await data.json();
  }
};

export default async function Home() {
  const currencyRates = await getCurrencyRates();
  const cryptoRates = await getCryptoRates();
  const metalRates = await getMetalRates();

  const data: DataType = {
    currencyRates,
    cryptoRates,
    metalRates,
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="w-full max-w-full md:max-w-[800px] text-center justify-center">
        <h1>
          <span className={color({ color: "blue" })}>ISK </span>
          <span className={color()}> í </span>
          <span className={color({ color: "red" })}>USD</span>
        </h1>
        <br />
        <br />

        <CurrencyConverter data={data} />
      </div>
    </section>
  );
}
