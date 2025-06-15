import { Suspense } from "react";
import ForCustomersClients from "./forCustomersClient";
import Spinner from "@/components/general/spinner";

export const metadata = {
  title: "Book Top Service Professionals | Hairsby",
  description:
    "Discover and book certified service professionals near you. Read verified reviews, view portfolios, and book appointments seamlessly.",
  keywords:
    "service appointments, hair specialists, book business, service professionals, hairstyling booking",
  openGraph: {
    title: "Book Top Service Professionals | Hairsby",
    description: "Discover and book certified service professionals near you.",
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
  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <ForCustomersClients />
    </Suspense>
  );
}
