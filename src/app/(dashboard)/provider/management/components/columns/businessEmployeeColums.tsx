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
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/contexts/auth.context";

export const businessEmployeeColumns: ColumnDef<BusinessEmployee>[] = [
  {
    id: "entity",
    header: ({ table }) => {
      const { user } = useAuth();
      return user?.role === "business" ? "Specialist" : "Organisation";
    },
    cell: ({ row }) => {
      const { user } = useAuth();
      const router = useRouter();
      const isBusiness = user?.role === "business";
      const entity = isBusiness ? row.original.employee : row.original.business;

      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Avatar
              size="lg"
              className="w-16 h-16 sm:w-20 sm:h-20"
              src={entity.photo}
              alt={`${entity?.firstName} ${entity?.lastName}`}
              fallback={
                <>
                  {entity.firstName.charAt(0)}
                  {entity.lastName.charAt(0)}{" "}
                </>
              }
            />
          </div>
          <div>
            <p
              className="font-medium cursor-pointer"
              onClick={() =>
                router.push(
                  `/provider/management/${
                    isBusiness ? "specialists" : "organisations"
                  }/${isBusiness ? row.original?.employeeId : row.original?.businessId}`
                )
              }
            >
              {entity?.businessName || `${entity.firstName} ${entity.lastName}`}
            </p>
            <p className="text-sm text-muted-foreground">{entity.email}</p>
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
          <Badge variant="outline" className="capitalize hidden md:block p-2">
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
      const { user } = useAuth();

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
    accessorKey: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const router = useRouter();
      const { user } = useAuth();
      const isBusiness = user?.role === "business";

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
                  `/provider/management/${
                    isBusiness ? "specialists" : "organisations"
                  }/${isBusiness ? employee.employeeId : employee.businessId}`
                )
              }
            >
              View Details
            </DropdownMenuItem>
            {/* {isBusiness && ( */}
            <>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/${
                      isBusiness ? "specialists" : "organisations"
                    }/${isBusiness ? employee.employeeId : employee.businessId}?t=schedule`
                  )
                }
              >
                Schedule
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/${
                      isBusiness ? "specialists" : "organisations"
                    }/${isBusiness ? employee.employeeId : employee.businessId}?t=services`
                  )
                }
              >
                Services
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/${
                      isBusiness ? "specialists" : "organisations"
                    }/${isBusiness ? employee.employeeId : employee.businessId}?t=products`
                  )
                }
              >
                Products
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/${
                      isBusiness ? "specialists" : "organisations"
                    }/${isBusiness ? employee.employeeId : employee.businessId}?t=bookings`
                  )
                }
              >
                Bookings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/${
                      isBusiness ? "specialists" : "organisations"
                    }/${isBusiness ? employee.employeeId : employee.businessId}?t=orders`
                  )
                }
              >
                Orders
              </DropdownMenuItem>
            </>
            {/* )} */}
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/${
                    isBusiness ? "specialists" : "organisations"
                  }/${isBusiness ? employee.employeeId : employee.businessId}?t=settings`
                )
              }
            >
              {isBusiness ? "Manage Permissions" : "View Permissions"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
