"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Booking } from "@/lib/api/services/booking";
import { ClientTabsProps } from "../clientTabs";
import { bookingColumns } from "../columns/bookingColumns";

export function ClientBookings({
  client,
  isLoading,
  modeAndCreateFunction,
}: ClientTabsProps) {
  const columns = bookingColumns(modeAndCreateFunction);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Bookings</h3>
        </div>
        <Button
          onClick={() => modeAndCreateFunction({ mode: "newBooking" })}
          className="gap-2"
          variant="brand"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={client.bookings || []}
        isLoading={isLoading}
        emptyMessage="No bookings found"
        searchableColumns={["bookingCode"]}
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
