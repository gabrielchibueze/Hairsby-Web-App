import { Metadata } from "next";
import AboutComponent from "./about";

export const metadata: Metadata = {
  title: "About Hairsby | Our Story & Mission",
  description:
    "Learn about Hairsby's mission to connect clients with the best service professionals and revolutionize the service booking experience and a marketplace to buy and sell products.",
  keywords: [
    "Hairsby company story",
    "service platform mission",
    "about online booking system",
    "professional service innovation",
    "service tech company",
    "business software provider",
    "service industry disruption",
    "founder story Hairsby",
    "professional service revolution",
    "digital transformation business industry",
  ],
  openGraph: {
    title: "About Hairsby | Our Story & Mission",
    description:
      "Discover how Hairsby is transforming professional service bookings and offering service providers a marketplace to sell products.",
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
