"use client";

import * as React from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ScrollArea } from "./scroll-area";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = ["00", "15", "30", "45"];

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedHour, selectedMinute] = value.split(":");

  const handleHourClick = (hour: number) => {
    onChange(`${hour.toString().padStart(2, "0")}:${selectedMinute}`);
    setOpen(false);
  };

  const handleMinuteClick = (minute: string) => {
    onChange(`${selectedHour}:${minute}`);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex p-2 w-auto">
        <ScrollArea className="h-48 w-12">
          {hours.map((hour) => (
            <Button
              key={hour}
              variant="ghost"
              className={`w-full ${
                hour.toString().padStart(2, "0") === selectedHour
                  ? "bg-accent"
                  : ""
              }`}
              onClick={() => handleHourClick(hour)}
            >
              {hour.toString().padStart(2, "0")}
            </Button>
          ))}
        </ScrollArea>
        <ScrollArea className="h-48 w-12">
          {minutes.map((minute) => (
            <Button
              key={minute}
              variant="ghost"
              className={`w-full ${
                minute === selectedMinute ? "bg-accent" : ""
              }`}
              onClick={() => handleMinuteClick(minute)}
            >
              {minute}
            </Button>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
