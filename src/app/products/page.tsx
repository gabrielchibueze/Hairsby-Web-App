import { Metadata } from "next";
import ProductsComponent from "./products";

export const metadata: Metadata = {
  title: "Beauty Products | Hairsby Marketplace",
  description:
    "Discover professional-grade beauty products and tools from top brands and businesses on Hairsby.",
  keywords: [
    "professional hair products",
    "salon-grade beauty supplies",
    "hair care products",
    "styling tools online",
    "beauty equipment store",
    "wholesale beauty products",
    "hair brushes professional",
    "flat irons for stylists",
    "hair color products",
    "salon disinfectants",
    "beauty products",
    "massage tools",
    "tattoo equipment",
  ],
  openGraph: {
    title: "Beauty Products | Hairsby Marketplace",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/products",
  },
  alternates: {
    canonical: "https://hairsby.com/products",
  },
};
export default function ProductsPage() {
  return <ProductsComponent />;
}
