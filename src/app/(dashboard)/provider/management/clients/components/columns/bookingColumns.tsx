import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "@/lib/api/services/booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import formatDuration from "@/lib/utils/minute-to-hour";
import { ClientTabsProps } from "../clientTabs";

export const bookingColumns = (
  modeAndCreateFunction: ClientTabsProps["modeAndCreateFunction"]
): ColumnDef<Booking>[] => [
  {
    accessorKey: "bookingCode",
    header: "Booking #",
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <p className="font-medium">
            {booking.provider?.businessName ||
              `${booking.provider?.firstName} ${booking.provider?.lastName}`}
          </p>
          {booking?.employee ? (
            <p className="text-sm text-muted-foreground">
              with {booking.employee?.firstName} {booking.employee?.lastName}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              with{" "}
              {booking.provider.businessName ||
                `${booking.provider?.firstName} ${booking.provider?.lastName}`}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <p>{format(new Date(booking.date), "PPP")}</p>
          <p className="text-sm text-muted-foreground">{booking.time}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="space-y-1">
          {booking.items?.map((service) => (
            <div key={service.id} className="flex items-center gap-2">
              <span>{service.name}</span>
              <span className="text-sm text-muted-foreground">
                ({formatDuration(service.duration)})
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no-show";
      const statusMap = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        "no-show": "bg-gray-100 text-gray-800",
      };
      return (
        <Badge className={`capitalize ${statusMap[status]}`}>
          {status.replace("-", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GBP",
      }).format(amount);
    },
  },
  {
    accessorKey: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                modeAndCreateFunction({ mode: "bookingDetails", booking })
              }
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                modeAndCreateFunction({ mode: "editBooking", booking })
              }
            >
              Update Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
