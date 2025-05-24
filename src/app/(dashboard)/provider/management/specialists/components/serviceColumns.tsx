// components/provider/management/specialists/ServiceColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Service } from "@/lib/api/services/service";

export const ServiceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Service",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
    },
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => {
      const isAvailable = row.getValue("isAvailable");
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;
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
                router.push(
                  `/provider/management/specialists/${service.provider?.id}/services/${service.id}`
                )
              }
            >
              Edit Service
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
