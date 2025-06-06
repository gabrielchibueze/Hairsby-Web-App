import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/lib/api/accounts/clients";
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
import { format } from "date-fns";

export const clientColumns = (
  sendMarketetingEmailToClients: any
): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original;
      const router = useRouter();
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Avatar
              size="lg"
              className="w-16 h-16 sm:w-20 sm:h-20"
              src={client.photo}
              alt={`${client.firstName} ${client.lastName}`}
              fallback={
                <>
                  {client.firstName.charAt(0)}
                  {client.lastName.charAt(0)}
                </>
              }
            />
          </div>
          <div>
            <p
              className="font-medium cursor-pointer"
              onClick={() =>
                router.push(`/provider/management/clients/${client.id}`)
              }
            >
              {client.firstName} {client.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return gender ? (
        <Badge variant="outline" className="capitalize">
          {gender}
        </Badge>
      ) : (
        <span className="text-muted-foreground">Not specified</span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      const totalReviews = row.original.totalReviews;
      return (
        <div className="flex items-center gap-1">
          <span className="font-medium">{rating.toFixed(1)}</span>
          {totalReviews > 0 && (
            <span className="text-muted-foreground text-sm">
              ({totalReviews} reviews)
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "PPP");
    },
  },
  {
    accessorKey: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;
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
                router.push(`/provider/management/clients/${client.id}`)
              }
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/clients/${client.id}?t=bookings`
                )
              }
            >
              View Bookings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/clients/${client.id}?t=orders`
                )
              }
            >
              View Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/provider/management/clients/${client.id}?t=notes`)
              }
            >
              Add Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => sendMarketetingEmailToClients([client.id])}
            >
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
