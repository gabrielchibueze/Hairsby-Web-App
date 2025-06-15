import ForSalonsClient from "./forSalonsClient";

export const metadata = {
  title: "Business Management Software | Hairsby for Businesses",
  description:
    "Streamline your business operations with our all-in-one platform. Manage appointments, staff, inventory, and grow your business with Hairsby.",
  keywords:
    "business software, business management, service business software, business booking system, business POS",
  openGraph: {
    title: "Business Management Software | Hairsby for Businesses",
    description:
      "Streamline your business operations with our all-in-one platform.",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Business Platform",
      },
    ],
  },
};

export default function ForSalonsPage() {
  return <ForSalonsClient />;
}
