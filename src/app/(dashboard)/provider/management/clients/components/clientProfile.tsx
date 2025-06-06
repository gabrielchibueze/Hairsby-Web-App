import React from "react";
import { Client } from "@/lib/api/accounts/clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Star, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

interface ClientProfileProps {
  client: Client;
  isLoading: boolean;
}

export function ClientProfile({ client, isLoading }: ClientProfileProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex sm:flex-row sm:items-center gap-4">
          <Avatar
            size="xxl"
            className="w-16 h-16 sm:w-20 sm:h-20"
            src={client.photo}
            alt={
              client?.businessName || `${client.firstName} ${client.lastName}`
            }
            fallback={
              <>
                {client.firstName.charAt(0)}
                {client.lastName.charAt(0)}
              </>
            }
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {client?.businessName || `${client.firstName} ${client.lastName}`}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {client.gender && (
                <Badge
                  variant="outline"
                  className="text-xs sm:text-sm capitalize"
                >
                  {client.gender}
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs sm:text-sm">
                  {client.rating?.toFixed(1) || "0.0"}
                  {client.totalReviews && (
                    <span className="text-gray-400">
                      {" "}
                      ({client.totalReviews} reviews)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end sm:justify-normal gap-3 w-fit">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
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
                  router.push(
                    `/provider/management/clients/${client.id}?t=notes`
                  )
                }
              >
                Add Notes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <Link
            href={`mailto:${client.email}`}
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <p className="font-medium text-sm sm:text-base truncate">
              {client.email}
            </p>
          </Link>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Phone</p>
          <Link
            href={client.phone ? `tel:${client.phone}` : "#"}
            className="flex items-center gap-1"
          >
            <Phone className="h-4 w-4" />
            <p className="font-medium text-sm sm:text-base">
              {client.phone || "Not provided"}
            </p>
          </Link>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Joined</p>
          <p className="font-medium text-sm sm:text-base">
            {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="font-medium text-sm sm:text-base">
            {client.city || client.country
              ? `${client.city ? client.city + ", " : ""}${client.country || ""}`
              : "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}
