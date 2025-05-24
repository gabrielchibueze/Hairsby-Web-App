"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { orderColumns } from "./orderColumns";
import { getEmployeeOrders } from "@/lib/api/accounts/business";
import { Order } from "@/lib/api/products/order";
import { EmployeeTabsProps } from "./employeeTabs";

interface EmployeeOrdersProps {
  orders: Order[];
  employeeId?: string;
  isLoading: boolean;
  employee: any;
}

export function EmployeeOrders({
  employee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();
  // const {
  //   data: orders,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["employeeOrders", employeeId],
  //   queryFn: () => getEmployeeOrders(employeeId),
  // });

  // if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Recent Orders</h3>
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
        columns={orderColumns}
        data={employee.employee.orders || []}
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
