// components/provider/management/specialists/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { BusinessEmployee } from "@/lib/api/accounts/business";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const employeeColumns: ColumnDef<BusinessEmployee>[] = [
  {
    accessorKey: "employee",
    header: "Specialist",
    cell: ({ row }) => {
      const employee = row.original.employee;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {employee.photo ? (
              <img
                src={employee.photo}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {employee.firstName.charAt(0)}
                {employee.lastName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{employee.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Array<string>;
      const formatted = role
        .map((r) =>
          r.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        )
        .join(", ");

      return (
        <div className="w-fit">
          <Badge variant="outline" className="capitalize hidden md:block p-2 ">
            {formatted}
          </Badge>
          <p className="md:hidden">{formatted}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "employmentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("employmentStatus") as
        | "active"
        | "pending"
        | "on_leave"
        | "terminated";
      const statusMap = {
        active: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        on_leave: "bg-blue-100 text-blue-800",
        terminated: "bg-red-100 text-red-800",
      };

      const formatted = status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return (
        <Badge className={`capitalize ${statusMap[status]} `}>
          {formatted}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinedAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}`
                )
              }
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}?target=schedule`
                )
              }
            >
              Manage Schedule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}?target=services`
                )
              }
            >
              Manage Services
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}?target=products`
                )
              }
            >
              Manage Products
            </DropdownMenuItem>{" "}
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}?target=bookings`
                )
              }
            >
              Manage Bookings
            </DropdownMenuItem>{" "}
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}?target=orders`
                )
              }
            >
              Manage Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/specialists/${employee.employeeId}?target=settings`
                )
              }
            >
              Manage Permissions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
