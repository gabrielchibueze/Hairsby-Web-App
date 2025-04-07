// src/app/help/page.tsx
import { Metadata } from "next";
import HelpComponent from "./help";

export const metadata: Metadata = {
  title: "Help Center | Hairsby",
  description:
    "Find answers to common questions, learn how to use Hairsby, and get support for booking, payments, and more.",
  keywords: [
    "Hairsby help",
    "booking help",
    "appointment questions",
    "payment support",
    "salon FAQ",
    "beauty service help",
    "Hairsby support",
  ],
  openGraph: {
    title: "Help Center | Hairsby",
    description:
      "Get answers to your questions about booking, payments, and using Hairsby services.",
    url: "https://hairsby.com/help",
    siteName: "Hairsby",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Help Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center | Hairsby",
    description:
      "Find answers to common questions about Hairsby services and support.",
    images: ["/og-hairsby-default.png"],
  },
  alternates: {
    canonical: "https://hairsby.com/help",
  },
};

export default function HelpPage() {
  return <HelpComponent />;
}
