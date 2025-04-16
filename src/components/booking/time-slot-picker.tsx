"use client";

import { Button } from "@/components/ui/button";

interface TimeSlotPickerProps {
  slots: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

export function TimeSlotPicker({
  slots,
  selectedTime,
  onSelectTime,
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => (
        <Button
          key={slot}
          variant={selectedTime === slot ? "default" : "outline"}
          className={`${selectedTime === slot ? "bg-hairsby-orange hover:bg-amber-500" : ""}`}
          onClick={() => onSelectTime(slot)}
        >
          {slot}
        </Button>
      ))}
    </div>
  );
}
