"use client";

import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/hero";
import { FeaturedServices } from "@/components/sections/featured-services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustedBy } from "@/components/sections/trusted-by";
import { DownloadApp } from "@/components/sections/download-app";
import { ServiceCategories } from "@/components/sections/service-categories";
import { BeautyStats } from "@/components/sections/beauty-stats";

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
