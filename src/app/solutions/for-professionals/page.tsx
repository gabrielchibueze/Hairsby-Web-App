import ForProfessionalsClient from "./forProfessionalsClient";

export const metadata = {
  title: "Grow Your Service Business | Hairsby Professionals",
  description:
    "Join Hairsby to attract more clients, manage your bookings, and grow your service business. Keep more of what you earn with our low commission rates.",
  keywords:
    "service professionals, hairstylist platform, business software, grow service business, specialist app",
  openGraph: {
    title: "Grow Your Service Business | Hairsby Professionals",
    description:
      "Join Hairsby to attract more clients and grow your service business.",
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
