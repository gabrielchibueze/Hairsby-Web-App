// components / provider / management / specialists / EmployeeProfile.tsx;
import React from "react";
import { BusinessEmployee } from "@/lib/api/accounts/business";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { disconnectFromBusiness } from "@/lib/api/accounts/provider";
import { useToast } from "@/components/ui/use-toast";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

interface EmployeeProfileProps {
  employee: BusinessEmployee;
  isLoading: boolean;
}
type Status = "active" | "pending" | "on_leave" | "terminated";

export function EmployeeProfile({ employee, isLoading }: EmployeeProfileProps) {
  const router = useRouter();
  const { employee: emp, role, employmentStatus, joinedAt } = employee;
  const { toast } = useToast();
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

  return (
    <div className="rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar
            size="xxl"
            className="w-16 h-16 sm:w-20 sm:h-20"
            src={emp.photo}
            alt={`${emp?.firstName} ${emp?.lastName}`}
            fallback={
              <>
                {emp.firstName.charAt(0)}
                {emp.lastName.charAt(0)}{" "}
              </>
            }
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {emp.firstName} {emp.lastName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                className={`${statusColors[employmentStatus as Status]} text-xs sm:text-sm`}
              >
                {employmentStatus.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {formatRole(role)}
              </Badge>
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
                  router.push(`/provider/management/specialists/${emp.id}/edit`)
                }
              >
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/specialists/${emp.id}/schedule`
                  )
                }
              >
                Manage Schedule
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Terminate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={async () => {
                  if (
                    confirm(
                      "Are you sure you want to disconnect from this business?"
                    )
                  ) {
                    try {
                      await disconnectFromBusiness(employee.employeeId);
                      router.push("/specialist/dashboard");
                      toast({
                        title: "Success",
                        description: "Successfully disconnected from business",
                      });
                    } catch (error: any) {
                      const errorMessage = await ErrorToastResponse(
                        error?.response
                      );
                      toast({
                        title: "Error",
                        description:
                          errorMessage || "Error disconnecting from business",
                      });
                    }
                  }
                }}
              >
                Disconnect from Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium text-sm sm:text-base truncate">
            {emp.email}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium text-sm sm:text-base">
            {emp.phone || "Not provided"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Joined</p>
          <p className="font-medium text-sm sm:text-base">
            {new Date(joinedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Rating</p>
          <p className="font-medium text-sm sm:text-base">
            {emp.rating
              ? `${emp.rating}/5 (${emp.totalReviews} reviews)`
              : "No reviews"}
          </p>
        </div>
      </div>
    </div>
  );
}
