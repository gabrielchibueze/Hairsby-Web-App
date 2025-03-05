import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/hero";
import { FeaturedServices } from "@/components/sections/featured-services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustedBy } from "@/components/sections/trusted-by";
import { DownloadApp } from "@/components/sections/download-app";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Navbar /> */}
      <HeroSection />
      <FeaturedServices />
      <HowItWorks />
      <Testimonials />
      <TrustedBy />
      <DownloadApp />
      {/* <Footer /> */}
    </main>
  );
}
