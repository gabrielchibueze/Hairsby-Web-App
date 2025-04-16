import { bookingDetailMetadata } from "@/app/metadata";
import { BookingDetails } from "@/components/booking/booking-details";
export const metadata = bookingDetailMetadata;
export default function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container py-8">
      <BookingDetails id={params.id} />
    </div>
  );
}
