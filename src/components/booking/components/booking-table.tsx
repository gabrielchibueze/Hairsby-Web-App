"use client";

import { Booking } from "@/lib/api/services/booking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { BookingStatusBadge } from "./status-badge";

interface BookingTableProps {
  bookings: Booking[];
  onEditBooking: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
}

export function BookingTable({
  bookings,
  onEditBooking,
  onViewDetails,
}: BookingTableProps) {
  const router = useRouter();

  const handleStatusChange = async (bookingId: string, status: string) => {
    // Implement status change logic
    console.log(`Changing booking ${bookingId} to ${status}`);
    router.refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[120px]">Booking ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Services</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {booking.bookingCode}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{format(new Date(booking.date), "PPP")}</span>
                  <span className="text-sm text-gray-500">{booking.time}</span>
                </div>
              </TableCell>
              <TableCell>
                {booking.customer.firstName} {booking.customer.lastName}
                <div className="text-sm text-gray-500">
                  {booking.customer.phone}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {booking.services?.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-1 text-xs bg-gray-100 rounded-md"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                £{Number(booking.totalAmount).toFixed(2)}
              </TableCell>
              <TableCell>
                <BookingStatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditBooking(booking)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {booking.status === "pending" && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, "confirmed")
                          }
                        >
                          Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, "cancelled")
                          }
                          className="text-red-600"
                        >
                          Cancel
                        </DropdownMenuItem>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, "completed")
                          }
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, "no-show")
                          }
                          className="text-red-600"
                        >
                          Mark as No Show
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
