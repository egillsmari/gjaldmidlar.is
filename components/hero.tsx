import type React from "react";

import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter;

  return (
    <>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Gjaldmidlar.is</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Hvað er það mikið í íslenskum krónum?
              </h2>
              <p className="text-lg md:text-xl mb-6 max-w-lg">
                Fáðu íslenskt verð á erlendum gjaldmiðlum, málmum, rafmyntum og
                meira.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Leggðu til nýja einningu
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </header>
    </>
  );
}
