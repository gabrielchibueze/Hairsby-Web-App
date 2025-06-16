import { Metadata } from "next";
import ServicesComponent from "./services";
import { Suspense } from "react";
import Spinner from "@/components/general/spinner";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

export const metadata: Metadata = {
  title: "Professional Services | Hairsby",
  description:
    "Browse all service providers and specialists available on Hairsby. Find your perfect treatment from thousands of professionals.",
  keywords: [
    "haircut services",
    "coloring treatments",
    "hair extensions",
    "keratin smoothing",
    "bridal hair styling",
    "barber services",
    "facial treatments",
    "nail services",
    "massage therapy",
    "waxing services",
    "eyebrow microblading",
    "permanent makeup",
    "business services",
    "tattoo services",
    "piercing services",
  ],
  openGraph: {
    title: "Professional Services | Hairsby",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/services",
  },
  alternates: {
    canonical: "https://hairsby.com/services",
  },
};

export default function ServicesPage() {
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <ServicesComponent />;
    </Suspense>
  );
}
