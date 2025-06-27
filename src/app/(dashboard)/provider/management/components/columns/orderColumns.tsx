// components/provider/management/specialists/OrderColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/api/products/order";
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
import { EmployeeTabsProps } from "../businessEmployeeTabs";
type modeAndCreateFunction = EmployeeTabsProps["modeAndCreateFunction"];

export const orderColumns = (
  modeAndCreateFunction: modeAndCreateFunction,
  canManage?: boolean
): ColumnDef<Order>[] => [
  {
    accessorKey: "orderCode",
    header: "Order #",
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <p className="font-medium">
            {order.customer?.firstName} {order.customer?.lastName}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "PPP");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "processing"
        | "shipped"
        | "delivered"
        | "pickedup"
        | "cancelled"
        | "refunded";
      const statusMap = {
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        pickedup: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        refunded: "bg-gray-100 text-gray-800",
      };
      return (
        <Badge className={`capitalize ${statusMap[status]}`}>{status}</Badge>
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
    header: "Actions",

    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
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
                modeAndCreateFunction({ mode: "orderDetails", order })
              }
            >
              View Details
            </DropdownMenuItem>
            {canManage && (
              <DropdownMenuItem
                onClick={() =>
                  modeAndCreateFunction({ mode: "editBooking", order })
                }
              >
                Update Status
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
