"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getServiceAvailability } from "@/lib/api/services/booking";
import { useQuery } from "@tanstack/react-query";
import { TimeSlotPicker } from "./time-slot-picker";

interface BookingRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (payload: { date: string; time: string }) => void;
  isLoading: boolean;
  currentDate: string;
  currentTime: string;
}

export function BookingRescheduleDialog({
  open,
  onOpenChange,
  onReschedule,
  isLoading,
  currentDate,
  currentTime,
}: BookingRescheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(currentDate));
  const [time, setTime] = useState<string>(currentTime);

  const { data: availability } = useQuery({
    queryKey: ["availability", date?.toISOString()],
    queryFn: () =>
      date
        ? getServiceAvailability("service-id", format(date, "yyyy-MM-dd"))
        : null,
    enabled: !!date,
  });

  const handleSubmit = () => {
    if (date && time) {
      onReschedule({
        date: format(date, "yyyy-MM-dd"),
        time,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>

          {date && availability && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Available Time Slots</h3>
              <TimeSlotPicker
                slots={availability.availableSlots}
                selectedTime={time}
                onSelectTime={setTime}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-hairsby-orange hover:bg-amber-500"
              onClick={handleSubmit}
              disabled={isLoading || !date || !time}
            >
              {isLoading ? "Rescheduling..." : "Reschedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
