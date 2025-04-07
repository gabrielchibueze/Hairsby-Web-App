import { Metadata } from "next";
import ContactComponent from "./contact";

export const metadata: Metadata = {
  title: "Contact Hairsby | Customer Support & Inquiries",
  description:
    "Need help or have questions? Contact the Hairsby team and get the support you need regarding bookings, providers, products or services.",
  keywords: [
    "Hairsby customer support",
    "beauty platform contact",
    "salon partnership inquiry",
    "hair service help",
    "booking system support",
    "technical assistance beauty app",
    "business collaboration beauty",
    "provider onboarding help",
    "report issue booking platform",
    "beauty service feedback",
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
