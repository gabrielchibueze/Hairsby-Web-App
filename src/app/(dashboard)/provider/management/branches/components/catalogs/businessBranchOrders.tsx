// @/app/provider/management/branches/components/catalogs/businessBranchOrders.tsx

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBagIcon, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { BranchTabsProps } from "../businessBranchTabs";
import { useAuth } from "@/lib/contexts/auth.context";
import { orderColumns } from "../../../components/columns/orderColumns";

export function BusinessBranchOrders({
  businessBranch,
  isLoading,
  modeAndCreateFunction,
}: BranchTabsProps) {
  const { user } = useAuth();
  const canManage = businessBranch.permissions.manageOrders;
  const columns = orderColumns(modeAndCreateFunction, canManage);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Orders</h3>
        </div>
        {canManage && (
          <Button
            onClick={() => modeAndCreateFunction({ mode: "newOrder" })}
            className="gap-2"
            variant="brand"
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={businessBranch.branch.orders || []}
        isLoading={isLoading}
        emptyMessage="No orders found"
        searchableColumns={["customer", "orderCode"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "pickedup", label: "Picked Up" },
              { value: "cancelled", label: "Cancelled" },
              { value: "refunded", label: "Refunded" },
            ],
          },
        ]}
        dateRangeColumn="createdAt"
      />
    </div>
  );
}
