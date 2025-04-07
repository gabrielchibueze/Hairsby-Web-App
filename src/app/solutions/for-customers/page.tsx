import ForCustomersClients from "./forCustomersClient";

export const metadata = {
  title: "Book Top Beauty Professionals | Hairsby",
  description:
    "Discover and book certified beauty professionals near you. Read verified reviews, view portfolios, and book appointments seamlessly.",
  keywords:
    "beauty appointments, hair stylists, book salon, beauty professionals, hairstyling booking",
  openGraph: {
    title: "Book Top Beauty Professionals | Hairsby",
    description: "Discover and book certified beauty professionals near you.",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Client Booking",
      },
    ],
  },
};

export default function ForClientsPage() {
  return <ForCustomersClients />;
}
