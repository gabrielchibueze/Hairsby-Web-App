import { Metadata } from "next";
import BlogComponent from "./blog";
export const metadata: Metadata = {
  title: "Hairsby Blog | Service Tips & Trends",
  description:
    "Discover the latest service trends, tips, and news from the Hairsby blog.",
  keywords: [
    "service industry news",
    "hair care tips",
    "styling tutorials",
    "professional business advice",
    "service trend reports",
    "hairstyle inspiration",
    "product reviews service",
    "behind the scenes business",
    "expert service advice",
  ],
  openGraph: {
    title: "Hairsby Blog | Service Tips & Trends",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/blog",
  },
  alternates: {
    canonical: "https://hairsby.com/blog",
  },
};
export default function BlogPage() {
  return <BlogComponent />;
}
