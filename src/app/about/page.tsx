import { Metadata } from "next";
import AboutComponent from "./about";

export const metadata: Metadata = {
  title: "About Hairsby | Our Story & Mission",
  description:
    "Learn about Hairsby's mission to connect clients with the best beauty professionals and revolutionize the beauty booking experience and a marketplace to buy and sell products.",
  keywords: [
    "Hairsby company story",
    "beauty platform mission",
    "about online booking system",
    "hair service innovation",
    "beauty tech company",
    "salon software provider",
    "beauty industry disruption",
    "founder story Hairsby",
    "beauty service revolution",
    "digital transformation salon industry",
  ],
  openGraph: {
    title: "About Hairsby | Our Story & Mission",
    description:
      "Discover how Hairsby is transforming beauty service bookings and offering service providers a marketplace to sell products.",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/about",
  },
  alternates: {
    canonical: "https://hairsby.com/about",
  },
};

export default function AboutPage() {
  return <AboutComponent />;
}
