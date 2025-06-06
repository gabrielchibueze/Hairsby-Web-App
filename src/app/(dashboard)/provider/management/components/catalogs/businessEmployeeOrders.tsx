"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBagIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { orderColumns } from "../columns/orderColumns";
import { Order } from "@/lib/api/products/order";
import { EmployeeTabsProps } from "../businessEmployeeTabs";
import { useAuth } from "@/lib/contexts/auth.context";

export function BusinessEmployeeOrders({
  businessEmployee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const { user } = useAuth();
  const isBusiness =
    user?.role === "business" &&
    businessEmployee.employmentStatus !== "terminated";
  const employeePermission =
    businessEmployee.permissions.manageOrders &&
    businessEmployee.employmentStatus !== "terminated";
  const canManage = isBusiness ? isBusiness : employeePermission;
  const columns = orderColumns(modeAndCreateFunction, canManage);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Recent Orders</h3>
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
        data={businessEmployee.employee.orders || []}
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
