// @/app/provider/management/branches/components/catalogs/businessBranchBookings.tsx

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { BranchTabsProps } from "../businessBranchTabs";
import { useAuth } from "@/lib/contexts/auth.context";
import { bookingColumns } from "../../../components/columns/bookingColumns";

export function BusinessBranchBookings({
  businessBranch,
  isLoading,
  modeAndCreateFunction,
}: BranchTabsProps) {
  const { user } = useAuth();
  const canManage = businessBranch.permissions.manageBookings;
  const columns = bookingColumns(modeAndCreateFunction, canManage);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Bookings</h3>
        </div>
        {canManage && (
          <Button
            onClick={() => modeAndCreateFunction({ mode: "newBooking" })}
            className="gap-2"
            variant="brand"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={businessBranch.branch.bookings || []}
        isLoading={isLoading}
        emptyMessage="No bookings found"
        searchableColumns={["customer"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
              { value: "no-show", label: "No Show" },
            ],
          },
        ]}
        dateRangeColumn="date"
      />
    </div>
  );
}
