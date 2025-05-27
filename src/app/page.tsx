import { HeroSection } from "@/components/home-page/hero";
import { FeaturedServices } from "@/components/home-page/featured-services";
import { HowItWorks } from "@/components/home-page/how-it-works";
import { Testimonials } from "@/components/home-page/testimonials";
import { TrustedBy } from "@/components/home-page/trusted-by";
import { DownloadApp } from "@/components/home-page/download-app";
import { ServiceCategories } from "@/components/home-page/service-categories";
import { BeautyStats } from "@/components/home-page/beauty-stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hairsby | Book Service & Business Services Online",
  description:
    "Discover and book top-rated service providers and specialists near you. Businesses, barbers, spas, and independent professionals at your fingertips.",
  keywords: [
    "book hair business online",
    "professional services near me",
    "hair appointment booking",
    "spa booking app",
    "find hairstylist",
    "business booking platform",
    "same-day hair appointment",
    "professional service marketplace",
    "haircut booking online",
    "service professional finder",
  ],
  openGraph: {
    title: "Hairsby | Book Service & Hair Services Online",
    description:
      "Discover and book top-rated service providers and specialists near you.",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com",
    type: "website",
    siteName: "Hairsby",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hairsby | Book Professional Services Instantly",
    description: "Your professional service booking revolution starts here",
    images: ["/og-hairsby-default.png"],
  },
  alternates: {
    canonical: "https://hairsby.com",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServiceCategories />
      <FeaturedServices />
      <HowItWorks />
      <BeautyStats />
      <Testimonials />
      <TrustedBy />
      <DownloadApp />
    </main>
  );
}
