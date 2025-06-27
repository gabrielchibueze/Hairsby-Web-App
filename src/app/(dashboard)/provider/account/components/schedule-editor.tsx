"use client";

import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { DayOfWeek } from "@/types/general";
import { useState } from "react";

const daysOfWeek: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface ScheduleEditorProps {
  schedule: any;
  onChange: (schedule: any) => void;
}

export function ScheduleEditor({ schedule, onChange }: ScheduleEditorProps) {
  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>(null);
  const workingHours = schedule?.workingHours || {
    monday: { start: "09:00", end: "17:00", breaks: [] },
    tuesday: { start: "09:00", end: "17:00", breaks: [] },
    wednesday: { start: "09:00", end: "17:00", breaks: [] },
    thursday: { start: "09:00", end: "17:00", breaks: [] },
    friday: { start: "09:00", end: "17:00", breaks: [] },
    saturday: { start: "09:00", end: "17:00", breaks: [] },
    sunday: { start: "09:00", end: "17:00", breaks: [] },
  };

  const toggleDay = (day: DayOfWeek) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: "start" | "end",
    value: string
  ) => {
    const updatedSchedule = {
      ...schedule,
      workingHours: {
        ...workingHours,
        [day]: {
          ...workingHours[day],
          [field]: value,
        },
      },
    };
    onChange(updatedSchedule);
  };

  const handleAddBreak = (day: DayOfWeek) => {
    const updatedSchedule = {
      ...schedule,
      workingHours: {
        ...workingHours,
        [day]: {
          ...workingHours[day],
          breaks: [
            ...workingHours[day].breaks,
            { start: "12:00", end: "13:00" },
          ],
        },
      },
    };
    onChange(updatedSchedule);
  };

  const handleBreakChange = (
    day: DayOfWeek,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updatedBreaks = [...workingHours[day].breaks];
    updatedBreaks[index] = {
      ...updatedBreaks[index],
      [field]: value,
    };

    const updatedSchedule = {
      ...schedule,
      workingHours: {
        ...workingHours,
        [day]: {
          ...workingHours[day],
          breaks: updatedBreaks,
        },
      },
    };
    onChange(updatedSchedule);
  };

  const handleRemoveBreak = (day: DayOfWeek, index: number) => {
    const updatedBreaks = [...workingHours[day].breaks];
    updatedBreaks.splice(index, 1);

    const updatedSchedule = {
      ...schedule,
      workingHours: {
        ...workingHours,
        [day]: {
          ...workingHours[day],
          breaks: updatedBreaks,
        },
      },
    };
    onChange(updatedSchedule);
  };

  return (
    <div className="space-y-2">
      {daysOfWeek.map((day) => (
        <div key={day} className="border rounded-lg overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 hover:bg-background dark:hover:bg-primary/90 transition-colors"
            onClick={() => toggleDay(day)}
          >
            <h3 className="font-medium capitalize text-left">{day}</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {workingHours[day].start} - {workingHours[day].end}
              </span>
              {expandedDay === day ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {expandedDay === day && (
            <div className="p-3 space-y-3 border-t">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <TimePicker
                  value={workingHours[day].start}
                  onChange={(value) => handleTimeChange(day, "start", value)}
                  // className="w-full"
                />
                <span className="hidden sm:inline">to</span>
                <TimePicker
                  value={workingHours[day].end}
                  onChange={(value) => handleTimeChange(day, "end", value)}
                  // className="w-full"
                />
              </div>

              <div className="space-y-3 pl-0 sm:pl-8">
                {workingHours[day].breaks.map(
                  (breakItem: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center gap-3"
                    >
                      <span className="text-sm text-muted-foreground w-full sm:w-auto">
                        Break
                      </span>
                      <TimePicker
                        value={breakItem.start}
                        onChange={(value) =>
                          handleBreakChange(day, index, "start", value)
                        }
                      />
                      <span className="hidden sm:inline">to</span>
                      <TimePicker
                        value={breakItem.end}
                        onChange={(value) =>
                          handleBreakChange(day, index, "end", value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 ml-auto"
                        onClick={() => handleRemoveBreak(day, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => handleAddBreak(day)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Break
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
