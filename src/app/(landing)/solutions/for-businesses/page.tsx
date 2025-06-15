// src/app/(solutions)/for-businesses/page.tsx (Server Component)

import ForBusinessesClient from "./forBusinessesClient";

export const metadata = {
  title: "Enterprise Service Solutions | Hairsby for Businesses",
  description:
    "Scalable service and wellness solutions for enterprises. API access, white labeling, and custom integrations for your business needs.",
  keywords:
    "service enterprise software, business franchise software, service API, white label service platform, enterprise wellness solutions",
  openGraph: {
    title: "Enterprise Service Solutions | Hairsby for Businesses",
    description: "Scalable service and wellness solutions for enterprises.",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Enterprise Platform",
      },
    ],
  },
};
export default function ForBusinessesPage() {
  return <ForBusinessesClient />;
}
