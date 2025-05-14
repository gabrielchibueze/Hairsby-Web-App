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

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WorkingHours {
  start: string;
  end: string;
  breaks: Array<{ start: string; end: string }>;
}

export interface Schedule {
  workingHours: Record<DayOfWeek, WorkingHours>;
  unavailableDates: string[];
}