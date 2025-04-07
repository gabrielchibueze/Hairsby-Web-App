import { HeroSection } from "@/components/sections/hero";
import { FeaturedServices } from "@/components/sections/featured-services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustedBy } from "@/components/sections/trusted-by";
import { DownloadApp } from "@/components/sections/download-app";
import { ServiceCategories } from "@/components/sections/service-categories";
import { BeautyStats } from "@/components/sections/beauty-stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hairsby | Book Beauty & Salon Services Online",
  description:
    "Discover and book top-rated beauty and hair services near you. Salons, barbers, spas, and independent professionals at your fingertips.",
  keywords: [
    "book hair salon online",
    "beauty services near me",
    "hair appointment booking",
    "spa booking app",
    "find hairstylist",
    "salon booking platform",
    "same-day hair appointment",
    "beauty service marketplace",
    "haircut booking online",
    "beauty professional finder",
  ],
  openGraph: {
    title: "Hairsby | Book Beauty & Hair Services Online",
    description:
      "Discover and book top-rated beauty and hair services near you.",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com",
    type: "website",
    siteName: "Hairsby",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hairsby | Book Beauty Services Instantly",
    description: "Your beauty service booking revolution starts here",
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
