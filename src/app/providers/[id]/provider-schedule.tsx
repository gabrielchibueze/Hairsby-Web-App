"use client";

import { Clock, Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { userGetProviderSchedule } from "@/lib/api/accounts/provider";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, isAfter, isBefore, parse } from "date-fns";

interface WorkingHours {
  start: string;
  end: string;
  breaks: Array<{ start: string; end: string }>;
}

interface ScheduleData {
  workingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
  unavailableDates: string[];
  timezone?: string;
}

export function GetProviderSchedule({ providerId }: { providerId: string }) {
  const { data: schedule, isLoading } = useQuery<ScheduleData>({
    queryKey: ["providerSchedule", providerId],
    queryFn: () => userGetProviderSchedule(providerId, "", ""),
  });

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "h:mm a");
  };

  const isCurrentlyOpen = () => {
    if (!schedule) return false;

    const now = new Date();
    const day = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayHours =
      schedule.workingHours[day as keyof typeof schedule.workingHours];

    if (
      !todayHours ||
      (todayHours.start === "00:00" && todayHours.end === "00:00")
    ) {
      return false;
    }

    // Parse the times using today's date
    const startTime = parse(todayHours.start, "HH:mm", now);
    const endTime = parse(todayHours.end, "HH:mm", now);

    return isAfter(now, startTime) && isBefore(now, endTime);
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">Availability</h3>
        <Badge variant={isCurrentlyOpen() ? "success" : "destructive"}>
          {isCurrentlyOpen() ? "Open Now" : "Currently Closed"}
        </Badge>
      </div>

      <div className="space-y-4">
        {Object.entries(schedule?.workingHours || {}).map(([day, hours]) => (
          <div key={day} className="flex items-center justify-between">
            <span className="capitalize w-24">{day}</span>
            <div className="flex-1 flex items-center gap-2">
              {hours.start === "00:00" && hours.end === "00:00" ? (
                <span className="text-sm text-muted-foreground">Closed</span>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatTime(hours.start)} - {formatTime(hours.end)}
                    </span>
                  </div>
                  {hours.breaks?.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      (Breaks:{" "}
                      {hours.breaks
                        .map(
                          (b) => `${formatTime(b.start)}-${formatTime(b.end)}`
                        )
                        .join(", ")}
                      )
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {schedule?.unavailableDates && schedule.unavailableDates?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <X className="h-4 w-4" /> Upcoming Unavailable Dates
          </h4>
          <div className="flex flex-wrap gap-2">
            {schedule.unavailableDates
              .filter((date) => isAfter(parseISO(date), new Date()))
              .slice(0, 5)
              .map((date) => (
                <Badge
                  key={date}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  {format(parseISO(date), "MMM d, yyyy")}
                </Badge>
              ))}
            {schedule.unavailableDates.length > 5 && (
              <Badge variant="outline" className="text-muted-foreground">
                +{schedule.unavailableDates.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
