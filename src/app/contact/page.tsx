import { Metadata } from "next";
import ContactComponent from "./contact";

export const metadata: Metadata = {
  title: "Contact Hairsby | Customer Support & Inquiries",
  description:
    "Need help or have questions? Contact the Hairsby team and get the support you need regarding bookings, providers, products or services.",
  keywords: [
    "Hairsby customer support",
    "service platform contact",
    "business partnership inquiry",
    "professional service help",
    "booking system support",
    "technical assistance service app",
    "business collaboration service",
    "provider onboarding help",
    "report issue booking platform",
    "professional service feedback",
  ],
  openGraph: {
    title: "Contact Hairsby | Customer Support & Inquiries",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/contact",
  },
  alternates: {
    canonical: "https://hairsby.com/contact",
  },
};

export default function ContactPage() {
  return <ContactComponent />;
}
