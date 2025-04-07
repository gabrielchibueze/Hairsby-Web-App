import { Metadata } from "next";
import PressComponent from "./press";

export const metadata: Metadata = {
  title: "Press | Hairsby in the News",
  description:
    "Media resources, press releases, and news coverage about Hairsby.",
  keywords: [
    "Hairsby press releases",
    "beauty tech news",
    "salon platform coverage",
    "industry awards beauty",
    "company milestones",
    "media kit download",
    "executive interviews",
    "business expansion news",
    "partnership announcements",
  ],
  openGraph: {
    title: "Press | Hairsby in the News",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/press",
  },
  alternates: {
    canonical: "https://hairsby.com/press",
  },
};
export default function PressPage() {
  return <PressComponent />;
}
