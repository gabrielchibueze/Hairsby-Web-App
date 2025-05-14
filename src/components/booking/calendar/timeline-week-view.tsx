"use client";

import { BookingEvent } from "@/types/general";
import {
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

export function TimelineWeekView({
  date,
  events,
  onViewDetails,
}: TimelineWeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const minHour = 6;
  const maxHour = 24;
  const totalHours = maxHour - minHour;
  const hourHeight = 60;
  const headerHeight = 60; // Height for the date/day row

  return (
    <div className="flex h-full overflow-hidden border rounded-lg flex-col">
      {/* Header row with day labels */}
      <div className="flex border-b" style={{ height: `${headerHeight}px` }}>
        <div className="w-16 border-r bg-gray-50 flex items-center justify-center"></div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="flex-1 border-r last:border-r-0 flex flex-col items-center justify-center"
          >
            <div className="text-xs font-medium text-gray-500">
              {format(day, "EEE")}
            </div>
            <div
              className={`text-lg font-medium ${
                isSameDay(day, new Date())
                  ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  : ""
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable events area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column */}
        <div className="w-16 border-r bg-gray-50 relative">
          {Array.from({ length: totalHours }).map((_, index) => {
            const hour = minHour + index;
            return (
              <div
                key={hour}
                className="h-[60px] text-xs text-gray-500 flex items-start justify-end pr-1 pt-1"
              >
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </div>
            );
          })}
        </div>

        {/* Day columns and events */}
        <div className="flex-1 relative overflow-y-auto">
          {/* Grid */}
          <div
            className="absolute inset-0 flex"
            style={{ height: `${totalHours * hourHeight}px` }}
          >
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="flex-1 border-r last:border-r-0 relative"
              >
                {Array.from({ length: totalHours }).map((_, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="absolute border-t border-gray-100 w-full"
                    style={{ top: `${hourIndex * hourHeight}px` }}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          {/* Events */}
          {days.map((day, dayIndex) => {
            const dayEvents = events.filter((event) =>
              isSameDay(event.start, day)
            );

            return dayEvents.map((event) => {
              const startHour =
                event.start.getHours() + event.start.getMinutes() / 60;
              const endHour =
                event.end.getHours() + event.end.getMinutes() / 60;
              const top = (startHour - minHour) * hourHeight;
              const height = (endHour - startHour) * hourHeight;

              return (
                <div
                  key={event.id}
                  className={`absolute rounded border-l-4 cursor-pointer ml-px mr-px z-10 ${
                    event.status === "confirmed"
                      ? "border-l-green-500 bg-green-50"
                      : event.status === "completed"
                        ? "border-l-blue-500 bg-blue-50"
                        : event.status === "pending"
                          ? "border-l-amber-500 bg-amber-50"
                          : event.status === "cancelled"
                            ? "border-l-red-500 bg-red-50"
                            : "border-l-purple-500 bg-purple-50"
                  }`}
                  style={{
                    left: `${(dayIndex / days.length) * 100}%`,
                    width: `${100 / days.length}%`,
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                  onClick={() => onViewDetails(event)}
                >
                  <div className="p-2 overflow-hidden h-full">
                    <div className="text-sm font-medium truncate">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {format(event.start, "h:mm a")} -{" "}
                      {format(event.end, "h:mm a")}
                    </div>
                    <div className="text-xs mt-1 truncate">
                      {event.booking.customer.firstName}{" "}
                      {event.booking.customer.lastName}
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

interface TimelineWeekViewProps {
  date: Date;
  events: BookingEvent[];
  onViewDetails: (booking: BookingEvent) => void;
}
