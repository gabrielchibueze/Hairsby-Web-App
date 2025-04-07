import { Metadata } from "next";
import PricingComponent from "./price";

export const metadata: Metadata = {
  title: "Pricing | Hairsby Service Costs & Packages",
  description:
    "Transparent pricing for all beauty and hair services on Hairsby. Find affordable options for every budget.",
  keywords: [
    "hair service prices",
    "beauty treatment costs",
    "salon service rates",
    "affordable haircuts",
    "premium styling prices",
    "hair coloring pricing",
    "spa package deals",
    "beauty service membership",
    "salon subscription plans",
    "compare beauty service prices",
  ],
  openGraph: {
    title: "Pricing | Hairsby Service Costs & Packages",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/pricing",
  },
  alternates: {
    canonical: "https://hairsby.com/pricing",
  },
};
export default function PricingPage() {
  return <PricingComponent />;
}
