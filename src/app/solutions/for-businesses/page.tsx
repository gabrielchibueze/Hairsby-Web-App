// src/app/(solutions)/for-businesses/page.tsx (Server Component)

import ForBusinessesClient from "./forBusinessesClient";

export const metadata = {
  title: "Enterprise Beauty Solutions | Hairsby for Businesses",
  description:
    "Scalable beauty and wellness solutions for enterprises. API access, white labeling, and custom integrations for your business needs.",
  keywords:
    "beauty enterprise software, salon franchise software, beauty API, white label beauty platform, enterprise wellness solutions",
  openGraph: {
    title: "Enterprise Beauty Solutions | Hairsby for Businesses",
    description: "Scalable beauty and wellness solutions for enterprises.",
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
