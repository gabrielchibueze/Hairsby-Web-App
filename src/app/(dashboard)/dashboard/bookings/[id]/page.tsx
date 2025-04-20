import { bookingDetailMetadata } from "@/app/metadata";
import { BookingDetails } from "@/components/booking/booking-details";
export const metadata = bookingDetailMetadata;
export default function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <BookingDetails id={params.id} />;
}
