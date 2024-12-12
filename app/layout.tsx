import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import Head from "next/head";
import { Alert } from "@nextui-org/alert";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  keywords: "currency, exchange rates, finance, crypto, money",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gjaldmidlar.is/",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://gjaldmidlar.is/", //TODO: Add image
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <Head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </Head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">
              <div className="flex items-center justify-center w-full">
                <Alert
                  color="warning"
                  title="Vefsíðan er í vinnslu"
                  variant="faded"
                />
              </div>
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://egillsmari.dev"
                title="Egill Smári - Vefsíða"
              >
                <span className="text-default-600">Höfundur </span>
                <p className="text-primary">Egill</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
