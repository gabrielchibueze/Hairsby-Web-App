"use client";

import { addDays, differenceInDays, format, Locale } from "date-fns";
import { enUS, fr, de, es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface DateRangePickerProps {
  className?: string;
  onUpdate: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  align?: "start" | "center" | "end";
  initialDateFrom?: Date;
  initialDateTo?: Date;
  showCompare?: boolean;
  locale?: Locale;
}

export function DateRangePicker({
  className,
  onUpdate,
  align = "end",
  initialDateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  initialDateTo = new Date(),
  showCompare = true,
  locale = enUS,
}: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: initialDateFrom,
    to: initialDateTo,
  });
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    undefined
  );

  useEffect(() => {
    onUpdate({
      range: range || { from: undefined, to: undefined },
      rangeCompare,
    });
  }, [range, rangeCompare]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !range && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "LLL dd, y")} -{" "}
                {format(range.to, "LLL dd, y")}
              </>
            ) : (
              format(range.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          locale={locale}
        />
        {showCompare && (
          <div className="p-3 border-t">
            <Select
              onValueChange={(value) => {
                if (value === "previous-period") {
                  if (!range?.from || !range?.to) return;

                  const diff = differenceInDays(range.to, range.from) + 1;
                  setRangeCompare({
                    from: addDays(range.from, -diff),
                    to: addDays(range.to, -diff),
                  });
                } else {
                  setRangeCompare(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Compare with..." />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="previous-period">Previous period</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
