// @/app/provider/management/branches/components/businessBranchProfile.tsx

import React, { useState } from "react";
import { BusinessBranch } from "@/lib/api/accounts/company";
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
import { useAuth } from "@/lib/contexts/auth.context";
import { BusinessBranchDisconnectDialog } from "./businessBranchDisconnectDialog";

interface BranchProfileProps {
  businessBranch: BusinessBranch;
  isLoading: boolean;
}

export function BusinessBranchProfile({
  businessBranch,
  isLoading,
}: BranchProfileProps) {
  const router = useRouter();
  const [open, setOpenDisconnectDialog] = useState(false);
  const { branch, parentBusiness, status, isPrimaryBranch } = businessBranch;
  const { toast } = useToast();
  const { user } = useAuth();

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending_setup: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex sm:flex-row sm:items-center gap-4">
          <Avatar
            size="xxl"
            className="w-16 h-16 sm:w-20 sm:h-20"
            src={branch.photo}
            alt={
              branch.businessName || `${branch.firstName} ${branch.lastName}`
            }
            fallback={
              <>
                {branch.firstName.charAt(0)}
                {branch.lastName.charAt(0)}{" "}
              </>
            }
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {branch.businessName || `${branch.firstName} ${branch.lastName}`}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                className={`${statusColors[status as keyof typeof statusColors]} text-xs sm:text-sm`}
              >
                {status.replace("_", " ")}
              </Badge>
              {isPrimaryBranch && (
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Primary Branch
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end sm:justify-normal gap-3 w-fit">
          {businessBranch.status !== "suspended" && (
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
                      `/provider/management/branches/${branch.id}?t=settings`
                    )
                  }
                >
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/provider/management/branches/${branch.id}?t=schedule`
                    )
                  }
                >
                  Manage Schedule
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/provider/management/branches/${branch.id}?t=settings`
                    )
                  }
                >
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <p
                    onClick={() => {
                      setTimeout(() => {
                        setOpenDisconnectDialog(true);
                      }, 100);
                    }}
                    className="text-red-500"
                  >
                    Suspend Branch
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
          <a href={`mailto:${branch.email}`}>
            <p className="font-medium text-sm sm:text-base truncate">
              {branch.email}
            </p>
          </a>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Phone</p>
          <a href={branch.phone ? `tel:${branch.phone}` : ""}>
            <p className="font-medium text-sm sm:text-base">
              {branch.phone || "Not provided"}
            </p>
          </a>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Rating</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-sm sm:text-base">
              {branch.rating?.toFixed(1) || "0.0"}{" "}
              {branch.totalReviews && (
                <span className="text-gray-400">
                  ({branch.totalReviews} reviews)
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-medium text-sm sm:text-base truncate">
            {branch.address} {branch.city} {branch.country} {branch.postcode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Parent Business</p>
          <p className="font-medium text-sm sm:text-base">
            {parentBusiness.businessName ||
              `${parentBusiness.firstName} ${parentBusiness.lastName}`}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Branch Code</p>
          <p className="font-medium text-sm sm:text-base">
            {businessBranch.branchCode}
          </p>
        </div>
      </div>
      <BusinessBranchDisconnectDialog
        open={open}
        setOpenDisconnectDialog={setOpenDisconnectDialog}
        id={branch.id}
        businessBranch={businessBranch}
      />
    </div>
  );
}
