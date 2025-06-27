// @/app/provider/management/branches/components/columns/businessBranchColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { BusinessBranch } from "@/lib/api/accounts/company";
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

export const businessBranchColumns: ColumnDef<BusinessBranch>[] = [
  {
    id: "branch",
    header: "Branch",
    cell: ({ row }) => {
      const router = useRouter();
      const branch = row.original.branch;

      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Avatar
              size="lg"
              className="w-16 h-16 sm:w-20 sm:h-20"
              src={branch?.photo}
              alt={
                branch?.businessName ||
                `${branch?.firstName} ${branch?.lastName}`
              }
              fallback={
                <>
                  {branch?.firstName?.charAt(0)}
                  {branch?.lastName?.charAt(0)}{" "}
                </>
              }
            />
          </div>
          <div>
            <p
              className="font-medium cursor-pointer"
              onClick={() =>
                router.push(`/provider/management/branches/${branch?.id}`)
              }
            >
              {branch?.businessName ||
                `${branch?.firstName} ${branch?.lastName}`}
            </p>
            <p className="text-sm text-muted-foreground">{branch?.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "parentBusiness",
    header: "Parent Business",
    cell: ({ row }) => {
      const business = row.original.parentBusiness;
      return (
        <div>
          <p className="font-medium">
            {business?.businessName ||
              `${business?.firstName} ${business?.lastName}`}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "active"
        | "pending_setup"
        | "suspended";
      const statusMap = {
        active: "bg-green-100 text-green-800",
        pending_setup: "bg-yellow-100 text-yellow-800",
        suspended: "bg-red-100 text-red-800",
      };

      const formatted = status.replace("_", " ");

      return (
        <Badge className={`capitalize ${statusMap[status]} `}>
          {formatted}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPrimaryBranch",
    header: "Type",
    cell: ({ row }) => {
      const isPrimary = row.getValue("isPrimaryBranch") as boolean;
      return (
        <Badge variant={isPrimary ? "default" : "outline"}>
          {isPrimary ? "Primary" : "Secondary"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
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
                  `/provider/management/branches/${branch?.branch?.id}`
                )
              }
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/branches/${branch?.branch?.id}?t=schedule`
                )
              }
            >
              Schedule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/branches/${branch?.branch?.id}?t=services`
                )
              }
            >
              Services
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/branches/${branch?.branch?.id}?t=products`
                )
              }
            >
              Products
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/branches/${branch?.branch?.id}?t=bookings`
                )
              }
            >
              Bookings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/branches/${branch?.branch?.id}?t=orders`
                )
              }
            >
              Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/branches/${branch?.branch?.id}?t=settings`
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
