import { Metadata } from "next";
import PricingComponent from "./price";
import Spinner from "@/components/general/spinner";
import { Suspense } from "react";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

export const metadata: Metadata = {
  title: "Pricing | Hairsby Service Costs & Packages",
  description:
    "Transparent pricing for all service providers and specialists on Hairsby. Find affordable options for every budget.",
  keywords: [
    "professional service prices",
    "service treatment costs",
    "business service rates",
    "affordable haircuts",
    "premium styling prices",
    "hair coloring pricing",
    "spa package deals",
    "professional service membership",
    "business subscription plans",
    "compare professional service prices",
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
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <PricingComponent />
    </Suspense>
  );
}
