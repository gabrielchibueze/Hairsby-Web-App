"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBagIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Order } from "@/lib/api/products/order";
import { ClientTabsProps } from "../clientTabs";
import { orderColumns } from "../columns/orderColumns";

export function ClientOrders({
  client,
  isLoading,
  modeAndCreateFunction,
}: ClientTabsProps) {
  const columns = orderColumns(modeAndCreateFunction);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Orders</h3>
        </div>
        <Button
          onClick={() => modeAndCreateFunction({ mode: "newOrder" })}
          className="gap-2"
          variant="brand"
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={client?.orders || []}
        isLoading={isLoading}
        emptyMessage="No orders found"
        searchableColumns={["orderCode"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ],
          },
        ]}
        dateRangeColumn="createdAt"
      />
    </div>
  );
}
