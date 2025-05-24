// // components/provider/management/specialists/EmployeeBookings.tsx
// import React from "react";
// // import { DataTable } from "@/components/ui/data-table";
// // import { columns } from "./BookingColumns";
// import { getEmployeeBookings } from "@/lib/api/accounts/business";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Calendar, Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { DataTable } from "@/app/(dashboard)/dashboard/wallet/transactions-table";
// import { BookingColumns } from "./bookingColumns";

// interface EmployeeBookingsProps {
//   employeeId: string;
// }

// export function EmployeeBookings({ employeeId }: EmployeeBookingsProps) {
//   const router = useRouter();
//   const {
//     data: bookings,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["employeeBookings", employeeId],
//     queryFn: () => getEmployeeBookings(employeeId),
//   });

//   if (isLoading) return <div>Loading bookings...</div>;
//   if (error) return <div>Error loading bookings: {error.message}</div>;

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <Calendar className="h-5 w-5 text-hairsby-orange" />
//           <h3 className="font-medium">Upcoming Appointments</h3>
//         </div>
//         <Button
//           onClick={() =>
//             router.push(
//               `/provider/management/specialists/${employeeId}/bookings/new`
//             )
//           }
//           className="bg-hairsby-orange hover:bg-orange-500"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           New Booking
//         </Button>
//       </div>
//       <DataTable columns={BookingColumns} data={bookings || []} />
//     </div>
//   );
// }

"use client";
import React from "react";
import { getEmployeeBookings } from "@/lib/api/accounts/business";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { BookingColumns } from "./bookingColumns";
import { Booking } from "@/lib/api/services/booking";
import { EmployeeTabsProps } from "./employeeTabs";

export function EmployeeBookings({
  employee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();
  // const {
  //   data: bookings,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["employeeBookings", employeeId],
  //   queryFn: () => getEmployeeBookings(employeeId),
  // });

  // if (error) return <div>Error loading bookings: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Upcoming Appointments</h3>
        </div>
        <Button
          onClick={() => modeAndCreateFunction({ mode: "newBooking" })}
          className="gap-2"
          variant="brand"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>
      <DataTable
        columns={BookingColumns}
        data={employee.employee.bookings || []}
        isLoading={isLoading}
        emptyMessage="No bookings found"
        searchableColumns={["customer"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
              { value: "no-show", label: "No Show" },
            ],
          },
        ]}
        dateRangeColumn="date"
      />
    </div>
  );
}
