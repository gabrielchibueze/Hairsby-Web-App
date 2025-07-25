// // import * as React from "react";
// // import { DayPicker } from "react-day-picker";
// // import { buttonVariants } from "@/components/ui/button";
// // import { cn } from "@/lib/utils";
// // import { ChevronLeft, ChevronRight } from "lucide-react";

// // export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// // function Calendar({
// //   className,
// //   classNames,
// //   showOutsideDays = true,
// //   ...props
// // }: CalendarProps) {
// //   return (
// //     <DayPicker
// //       showOutsideDays={showOutsideDays}
// //       className={cn("p-3", className)}
// //       classNames={{
// //         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
// //         month: "space-y-4",
// //         caption: "flex justify-center pt-1 relative items-center",
// //         caption_label: "text-sm font-medium hidden", // Hide the default caption
// //         nav: "space-x-1 flex items-center mt-8",
// //         nav_button: cn(
// //           buttonVariants({ variant: "outline" }),
// //           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
// //         ),
// //         nav_button_previous: "absolute left-1",
// //         nav_button_next: "absolute right-1",
// //         table: "w-full border-collapse space-y-1",
// //         head_row: "flex",
// //         head_cell:
// //           "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
// //         row: "flex w-full mt-2",
// //         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
// //         day: cn(
// //           buttonVariants({ variant: "ghost" }),
// //           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
// //         ),
// //         day_range_end: "day-range-end",
// //         day_selected:
// //           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
// //         day_today: "bg-accent text-accent-foreground",
// //         day_outside:
// //           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
// //         day_disabled: "text-muted-foreground opacity-50",
// //         day_range_middle:
// //           "aria-selected:bg-accent aria-selected:text-accent-foreground",
// //         day_hidden: "invisible",
// //         caption_dropdowns: "flex gap-2", // Style for dropdowns
// //         dropdown: "rounded-md border px-2 py-1 text-sm", // Style for dropdown elements
// //         ...classNames,
// //       }}
// //       components={{
// //         IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
// //         IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
// //       }}
// //       captionLayout="dropdown-buttons"
// //       fromYear={1900}
// //       toYear={new Date().getFullYear()}
// //       {...props}
// //     />
// //   );
// // }
// // Calendar.displayName = "Calendar";

// // export { Calendar };

// "use client";

// import * as React from "react";
// import { DayPicker, DayPickerProps } from "react-day-picker";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { buttonVariants } from "./button";
// import { cn } from "@/lib/utils";

// export type CalendarProps = DayPickerProps;

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//         month: "space-y-4",
//         caption: "flex justify-center pt-1 relative items-center",
//         caption_label: "text-sm font-medium",
//         nav: "space-x-1 flex items-center",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-y-1",
//         head_row: "flex",
//         head_cell:
//           "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
//         row: "flex w-full mt-2",
//         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
//         ),
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside: "text-muted-foreground opacity-50",
//         day_disabled: "text-muted-foreground opacity-50",
//         day_range_middle:
//           "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
//         IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
//       }}
//       {...props}
//     />
//   );
// }
// Calendar.displayName = "Calendar";

// export { Calendar };

// components/ui/calendar.tsx
"use client";

import * as React from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

export type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout="dropdown-buttons"
      fromYear={fromYear}
      toYear={toYear}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-2",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        caption_dropdowns: "flex gap-2",
        dropdown: "rounded-md border px-2 py-1 text-sm",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
