"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { getServiceAvailability } from "@/lib/api/services/booking";
import { useQuery } from "@tanstack/react-query";
import { TimeSlotPicker } from "./time-slot-picker";
import { Service } from "@/lib/api/services/service";
import { toast } from "../ui/use-toast";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

interface BookingRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (payload: { selectedDate: string; time: string }) => void;
  isLoading: boolean;
  currentDate: string;
  currentTime: string;
  service: Service;
}

export function BookingRescheduleDialog({
  open,
  onOpenChange,
  onReschedule,
  isLoading,
  currentDate,
  currentTime,
  service,
}: BookingRescheduleDialogProps) {
  const [selectedDate, setDate] = useState<Date | undefined>(
    new Date(currentDate)
  );
  const [time, setTime] = useState<string>(currentTime);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isFetchingAvailability, setIsFetchingAvailability] =
    useState<Boolean>(false);
  useEffect(() => {
    if (selectedDate && service?.id) {
      const fetchAvailability = async () => {
        try {
          setIsFetchingAvailability(true);
          const dateStr = format(selectedDate, "yyyy-MM-dd");
          // For simplicity, using the first service's availability
          const availability = await getServiceAvailability(
            service.id,
            dateStr
          );
          setAvailableSlots(availability.availableSlots);
          setIsFetchingAvailability(false);
        } catch (error: any) {
          const message = await ErrorToastResponse(error.response);
          toast({
            title: "Error",
            description: message || "Failed to fetch available time slots",
            variant: "destructive",
          });
        }
      };

      fetchAvailability();
    }
  }, [selectedDate]);

  const handleSubmit = () => {
    if (selectedDate && time) {
      onReschedule({
        selectedDate: format(selectedDate, "yyyy-MM-dd"),
        time,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-80 sm:max-w-[425px] sm:mx-0">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(selectedDate) => selectedDate < new Date()}
            />
          </div>

          {isFetchingAvailability ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-md" />
              ))}
            </div>
          ) : (
            <>
              {selectedDate && availableSlots.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    Available Time Slots
                  </h3>
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedTime={time}
                    onSelectTime={setTime}
                  />
                </div>
              ) : (
                <p>No availability</p>
              )}
            </>
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
              disabled={isLoading || !selectedDate || !time}
            >
              {isLoading ? "Rescheduling..." : "Reschedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
