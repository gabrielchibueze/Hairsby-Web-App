import { Metadata } from "next";
import ServicesComponent from "./services";

export const metadata: Metadata = {
  title: "Beauty Services | Hairsby",
  description:
    "Browse all beauty and hair services available on Hairsby. Find your perfect treatment from thousands of professionals.",
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
    "salon services",
    "tattoo services",
    "piercing services",
  ],
  openGraph: {
    title: "Beauty Services | Hairsby",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/services",
  },
  alternates: {
    canonical: "https://hairsby.com/services",
  },
};

export default function ServicesPage() {
  return <ServicesComponent />;
}
