import ForProfessionalsClient from "./forProfessionalsClient";

export const metadata = {
  title: "Grow Your Beauty Business | Hairsby Professionals",
  description:
    "Join Hairsby to attract more clients, manage your bookings, and grow your beauty business. Keep more of what you earn with our low commission rates.",
  keywords:
    "beauty professionals, hairstylist platform, salon software, grow beauty business, stylist app",
  openGraph: {
    title: "Grow Your Beauty Business | Hairsby Professionals",
    description:
      "Join Hairsby to attract more clients and grow your beauty business.",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Professional Platform",
      },
    ],
  },
};

export default function ForProfessionalsPage() {
  return <ForProfessionalsClient />;
}
