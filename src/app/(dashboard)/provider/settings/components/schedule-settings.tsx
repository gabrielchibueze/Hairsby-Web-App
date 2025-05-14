// // app/(provider)/settings/components/schedule-settings.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// // import { getSchedule, setSchedule } from "@/lib/api/accounts/provider";
// import { Skeleton } from "@/components/ui/skeleton";
// import { TimePicker } from "@/components/ui/time-picker";
// import { addDays, format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import { ScheduleEditor } from "./schedule-editor";
// import {
//   getProviderSchedule,
//   setProviderSchedule,
// } from "@/lib/api/accounts/provider";

// export function ScheduleSettings() {
//   const [loading, setLoading] = useState(true);
//   const [schedule, setScheduleData] = useState<any>(null);
//   const [selectedDates, setSelectedDates] = useState<Date[]>([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         const data = await getProviderSchedule();
//         setScheduleData(data);
//         if (data.unavailableDates) {
//           setSelectedDates(
//             data.unavailableDates.map((date: string) => new Date(date))
//           );
//         }
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to load schedule",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchedule();
//   }, [toast]);

//   const handleSaveSchedule = async () => {
//     try {
//       setLoading(true);
//       await setProviderSchedule({
//         ...schedule,
//         unavailableDates: selectedDates.map((date) =>
//           format(date, "yyyy-MM-dd")
//         ),
//       });
//       toast({
//         title: "Success",
//         description: "Schedule updated successfully",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to update schedule",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-10 w-1/3" />
//         <Skeleton className="h-[400px] w-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Working Hours</CardTitle>
//           <CardDescription>
//             Set your regular working hours for each day of the week
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ScheduleEditor schedule={schedule} onChange={setScheduleData} />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Unavailable Dates</CardTitle>
//           <CardDescription>
//             Mark dates when you won't be available for appointments
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-8">
//             <Calendar
//               mode="multiple"
//               selected={selectedDates}
//               onSelect={(dates) => setSelectedDates(dates ?? [])}
//               className="rounded-md border"
//             />

//             <div className="flex-1">
//               <h3 className="text-lg font-semibold mb-4">
//                 Selected Unavailable Dates
//               </h3>
//               {selectedDates.length === 0 ? (
//                 <p className="text-muted-foreground">No dates selected</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {selectedDates
//                     .sort((a, b) => a.getTime() - b.getTime())
//                     .map((date) => (
//                       <li key={date.toString()} className="flex items-center">
//                         <span className="text-sm">{format(date, "PPP")}</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="ml-auto text-red-500"
//                           onClick={() =>
//                             setSelectedDates(
//                               selectedDates.filter(
//                                 (d) => d.getTime() !== date.getTime()
//                               )
//                             )
//                           }
//                         >
//                           Remove
//                         </Button>
//                       </li>
//                     ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex justify-end">
//         <Button
//           onClick={handleSaveSchedule}
//           className="bg-hairsby-orange hover:bg-hairsby-orange/90"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save Schedule"}
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ScheduleEditor } from "./schedule-editor";
import {
  getProviderSchedule,
  setProviderSchedule,
} from "@/lib/api/accounts/provider";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

export function ScheduleSettings() {
  const [loading, setLoading] = useState(true);
  const [schedule, setScheduleData] = useState<any>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getProviderSchedule();
        setScheduleData(data);
        if (data.unavailableDates) {
          setSelectedDates(
            data.unavailableDates.map((date: string) => new Date(date))
          );
        }
      } catch (error: any) {
        const message = await ErrorToastResponse(error.response);

        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Failed to load schedule",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [toast]);

  const handleSaveSchedule = async () => {
    try {
      setLoading(true);
      await setProviderSchedule({
        ...schedule,
        unavailableDates: selectedDates.map((date) =>
          format(date, "yyyy-MM-dd")
        ),
      });
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);

      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to update schedule",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto ">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Working Hours Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Working Hours</CardTitle>
            <CardDescription>
              Set your regular working hours for each day of the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleEditor schedule={schedule} onChange={setScheduleData} />
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Mark Unavailable Dates</CardTitle>
            <CardDescription>
              Select dates when you won't be available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => setSelectedDates(dates ?? [])}
              className="rounded-md border mx-auto"
              numberOfMonths={1}
            />
          </CardContent>
        </Card>

        {/* Selected Dates Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Unavailable Dates</CardTitle>
            <CardDescription>
              {selectedDates.length} date{selectedDates.length !== 1 ? "s" : ""}{" "}
              marked as unavailable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[332px] overflow-y-auto pr-2">
              {selectedDates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>No dates selected</p>
                  <p className="text-sm mt-2 text-center">
                    Select dates on the calendar to mark them as unavailable
                  </p>
                </div>
              ) : (
                <ul className="">
                  {selectedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date) => (
                      <li
                        key={date.toString()}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm font-medium">
                          {format(date, "PPP")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() =>
                            setSelectedDates(
                              selectedDates.filter(
                                (d) => d.getTime() !== date.getTime()
                              )
                            )
                          }
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSaveSchedule}
          className="bg-hairsby-orange hover:bg-hairsby-orange/90 shadow-lg transition-all hover:shadow-hairsby-orange/30"
          disabled={loading}
          size="lg"
        >
          {loading ? "Saving..." : "Save Schedule"}
        </Button>
      </div>
    </div>
  );
}
