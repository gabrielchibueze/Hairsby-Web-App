import { Metadata } from "next";
import ProductsComponent from "./products";
import { Suspense } from "react";
import Spinner from "@/components/general/spinner";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

export const metadata: Metadata = {
  title: "Products | Hairsby Marketplace",
  description:
    "Discover professional-grade products and tools from top brands and businesses on Hairsby.",
  keywords: [
    "professional hair products",
    "business-grade service supplies",
    "hair care products",
    "styling tools online",
    "service equipment store",
    "wholesale products",
    "hair brushes professional",
    "flat irons for specialists",
    "hair color products",
    "business disinfectants",
    "products",
    "massage tools",
    "tattoo equipment",
  ],
  openGraph: {
    title: "Products | Hairsby Marketplace",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/products",
  },
  alternates: {
    canonical: "https://hairsby.com/products",
  },
};
export default function ProductsPage() {
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <ProductsComponent />;
    </Suspense>
  );
}
