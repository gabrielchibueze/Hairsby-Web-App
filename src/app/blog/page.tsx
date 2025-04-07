import { Metadata } from "next";
import BlogComponent from "./blog";
export const metadata: Metadata = {
  title: "Hairsby Blog | Beauty Tips & Trends",
  description:
    "Discover the latest beauty trends, tips, and news from the Hairsby blog.",
  keywords: [
    "beauty industry news",
    "hair care tips",
    "styling tutorials",
    "salon business advice",
    "beauty trend reports",
    "hairstyle inspiration",
    "product reviews beauty",
    "behind the scenes salon",
    "expert beauty advice",
  ],
  openGraph: {
    title: "Hairsby Blog | Beauty Tips & Trends",
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
