import { Booking } from "@/lib/api/services/booking";

export interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  booking: Booking;
  status: string;
  paymentStatus: string;
}
