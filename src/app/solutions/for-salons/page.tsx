import ForSalonsClient from "./forSalonsClient";

export const metadata = {
  title: "Salon Management Software | Hairsby for Salons",
  description:
    "Streamline your salon operations with our all-in-one platform. Manage appointments, staff, inventory, and grow your business with Hairsby.",
  keywords:
    "salon software, salon management, beauty business software, salon booking system, salon POS",
  openGraph: {
    title: "Salon Management Software | Hairsby for Salons",
    description:
      "Streamline your salon operations with our all-in-one platform.",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Salon Platform",
      },
    ],
  },
};

export default function ForSalonsPage() {
  return <ForSalonsClient />;
}
