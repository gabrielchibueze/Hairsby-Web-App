"use client";

import { BookingEvent } from "@/types/general";

import { TimelineDayView } from "./timeline-day-view";
import { TimelineWeekView } from "./timeline-week-view";
import { TimelineMonthView } from "./timeline-month-view";

interface TimelineViewProps {
  view: "day" | "week" | "month";
  date: Date;
  events: BookingEvent[];
  onViewDetails: (booking: BookingEvent) => void;
}

export function TimelineView({
  view,
  date,
  events,
  onViewDetails,
}: TimelineViewProps) {
  switch (view) {
    case "day":
      return (
        <TimelineDayView
          date={date}
          events={events}
          onViewDetails={onViewDetails}
        />
      );
    case "week":
      return (
        <TimelineWeekView
          date={date}
          events={events}
          onViewDetails={onViewDetails}
        />
      );
    case "month":
      return (
        <TimelineMonthView
          date={date}
          events={events}
          onViewDetails={onViewDetails}
        />
      );
    default:
      return (
        <TimelineDayView
          date={date}
          events={events}
          onViewDetails={onViewDetails}
        />
      );
  }
}
