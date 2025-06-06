import React, { useState } from "react";
import { BusinessEmployee } from "@/lib/api/accounts/business";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { BusinessEmployeeDisconnectDialog } from "./businessEmployeeDisconnectDialog";
import { useAuth } from "@/lib/contexts/auth.context";

interface EmployeeProfileProps {
  businessEmployee: BusinessEmployee;
  isLoading: boolean;
}

export function BusinessEmployeeProfile({
  businessEmployee,
  isLoading,
}: EmployeeProfileProps) {
  const router = useRouter();
  const [open, setOpenDisconnectDialog] = useState(false);
  const {
    employee: emp,
    business,
    role,
    employmentStatus,
    joinedAt,
  } = businessEmployee;
  const { toast } = useToast();
  const { user } = useAuth();
  const isBusiness = user?.role === "business";

  const formatRole = (role: Array<string>) => {
    return role
      .map((r) => r.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
      .join(", ");
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    on_leave: "bg-blue-100 text-blue-800",
    terminated: "bg-red-100 text-red-800",
  };

  // Determine which entity to show as primary based on user role
  const profileEntity = isBusiness ? emp : business;
  const secondaryEntity = isBusiness ? business : emp;

  return (
    <div className="rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex  sm:flex-row sm:items-center gap-4">
          <Avatar
            size="xxl"
            className="w-16 h-16 sm:w-20 sm:h-20"
            src={profileEntity.photo}
            alt={`${profileEntity?.firstName} ${profileEntity?.lastName}`}
            fallback={
              <>
                {profileEntity.firstName.charAt(0)}
                {profileEntity.lastName.charAt(0)}{" "}
              </>
            }
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {profileEntity?.businessName ||
                `${profileEntity.firstName} ${profileEntity.lastName}`}
            </h2>
            {isBusiness && (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge
                  className={`${statusColors[employmentStatus as keyof typeof statusColors]} text-xs sm:text-sm`}
                >
                  {employmentStatus.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {formatRole(role)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end sm:justify-normal gap-3 w-fit">
          {businessEmployee.employmentStatus !== "terminated" && (
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
                      `/provider/management/${
                        isBusiness ? "specialists" : "organisations"
                      }/${isBusiness ? emp.id : business.id}?t=settings`
                    )
                  }
                >
                  {isBusiness ? "Edit Profile" : "View Details"}
                </DropdownMenuItem>
                {isBusiness && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/provider/management/${
                            isBusiness ? "specialists" : "organisations"
                          }/${isBusiness ? emp.id : business.id}?t=schedule`
                        )
                      }
                    >
                      Manage Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/provider/management/${
                            isBusiness ? "specialists" : "organisations"
                          }/${isBusiness ? emp.id : business.id}?t=settings`
                        )
                      }
                    >
                      Manage Permissions
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem>
                  <p
                    onClick={() => {
                      setTimeout(() => {
                        setOpenDisconnectDialog(true);
                      }, 100);
                    }}
                    className="text-red-500"
                  >
                    {isBusiness ? "Terminate" : "Disconnect"}
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <a href={`mailto:${profileEntity.email}`}>
            <p className="font-medium text-sm sm:text-base truncate">
              {profileEntity.email}
            </p>
          </a>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Phone</p>
          <a href={profileEntity.phone ? `tel:${profileEntity.phone}` : ""}>
            <p className="font-medium text-sm sm:text-base">
              {profileEntity.phone || "Not provided"}
            </p>
          </a>
        </div>

        {/* {isBusiness && ( */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Rating</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-sm sm:text-base">
              {profileEntity?.rating?.toFixed(1) || "0.0"}{" "}
              {profileEntity?.totalReviews && (
                <span className="text-gray-400">
                  ({profileEntity.totalReviews} reviews)
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-medium text-sm sm:text-base  truncate">
            {profileEntity.address} {profileEntity.city} {profileEntity.country}{" "}
            {profileEntity.postcode}
          </p>
        </div>
        {/* )} */}
      </div>
      {!isBusiness && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Your Status</p>
            <Badge
              className={`${statusColors[employmentStatus as keyof typeof statusColors]} text-xs sm:text-sm`}
            >
              {employmentStatus.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Your Role</p>
            <p className="font-medium text-sm sm:text-base">
              <Badge variant="outline" className="text-xs sm:text-sm">
                {formatRole(role)}
              </Badge>{" "}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Joined</p>
            <p className="font-medium text-sm sm:text-base">
              {new Date(joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
      <BusinessEmployeeDisconnectDialog
        open={open}
        setOpenDisconnectDialog={setOpenDisconnectDialog}
        id={`${isBusiness ? emp.id : business.id}`}
        businessEmployee={businessEmployee}
      />
    </div>
  );
}
