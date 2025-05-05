"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import emailjs from "emailjs-com";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export type InputType = {
  name: string;
  email: string;
  message: string;
};

export const sendEmail = async (input: InputType): Promise<boolean | Error> => {
  const date = new Date();

  try {
    const response = await emailjs.send(
      "eli-service",
      "template_q0xvw37",
      { ...input, date },
      "MO1_Sukv90H-tGf_9",
    );

    return true;
  } catch (err: any) {
    console.error("Failed to send email:", err);

    return new Error(err);
  }
};

export default function SuggestCurrency() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currencySuggestion: "",
    exchangeRateInfo: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState({
    name: "",
    currencySuggestion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      // For demo purposes, we'll just simulate a delay
      await sendEmail({
        email: formData.email,
        name: formData.name,
        message:
          "FROM GJALDMIDLAR.IS: " +
          formData.currencySuggestion +
          "\n" +
          formData.exchangeRateInfo,
      });

      // Store the submitted data for the success screen
      setSubmittedData({
        name: formData.name,
        currencySuggestion: formData.currencySuggestion,
      });

      // Show success screen
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Eitthvað fór úrskeiðis",
        description:
          "Ekki tókst að senda tillöguna þína. Vinsamlegast reyndu aftur.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Button
              className="text-white hover:bg-white/20 p-2 mr-2"
              variant="ghost"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Stinga upp á gjaldmiðli</h1>
          </div>
          <p className="text-lg max-w-2xl">
            Hjálpaðu okkur að bæta gjaldmiðlar.is með því að stinga upp á nýjum
            gjaldmiðlum.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6 bg-white shadow-sm rounded-xl border">
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nafn þitt <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      id="name"
                      name="name"
                      placeholder="Jón Jónsson"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Netfang <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      id="email"
                      name="email"
                      placeholder="jon@dæmi.is"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currencySuggestion">
                    Tillaga að gjaldmiðli{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    id="currencySuggestion"
                    name="currencySuggestion"
                    placeholder="t.d. Taílenskt bat (THB), Dogecoin (DOGE)"
                    value={formData.currencySuggestion}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exchangeRateInfo">Gengisupplýsingar</Label>
                  <Textarea
                    id="exchangeRateInfo"
                    name="exchangeRateInfo"
                    placeholder="Gefðu upplýsingar um gengisupplýsingagjafa, API, eða aðrar upplýsingar sem gætu hjálpað okkur að innleiða þennan gjaldmiðil."
                    rows={4}
                    value={formData.exchangeRateInfo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                      Sendi...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Senda tillögu
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Takk fyrir, {submittedData.name}!
              </h2>
              <p className="text-lg mb-6">
                Tillaga þín um{" "}
                <span className="font-semibold">
                  {submittedData.currencySuggestion}
                </span>{" "}
                hefur verið móttekin.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    currencySuggestion: "",
                    exchangeRateInfo: "",
                  });
                }}
              >
                Senda aðra tillögu
              </Button>
            </div>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 text-center text-gray-600 text-sm">
        <p>&copy; 2025 Gjaldmiðlabreytir. Allur réttur áskilinn.</p>
      </footer>
    </div>
  );
}
