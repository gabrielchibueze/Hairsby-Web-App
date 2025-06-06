"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { productColumns } from "../columns/productColumns";
import { Product } from "@/lib/api/products/product";
import { EmployeeTabsProps } from "../businessEmployeeTabs";
import { useAuth } from "@/lib/contexts/auth.context";

export function BusinessEmployeeProducts({
  businessEmployee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isBusiness =
    user?.role === "business" &&
    businessEmployee.employmentStatus !== "terminated";
  const employeePermission =
    businessEmployee.permissions.manageProducts &&
    businessEmployee.employmentStatus !== "terminated";
  const canManage = isBusiness ? isBusiness : employeePermission;

  const query = new URLSearchParams({
    employeeId: businessEmployee.employeeId as string,
    firstName: businessEmployee.employee.firstName as string,
    lastName: businessEmployee.employee.lastName as string,
    businessName: businessEmployee.business.businessName as string,
    businessId: businessEmployee.businessId as string,
    role: user?.role as string,
    canManage: canManage ? "true" : "false",
  }).toString();

  const columns = productColumns(query, canManage);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Products</h3>
        </div>
        {canManage && (
          <Button
            onClick={() =>
              router.push(`/provider/management/products/new?${query}`)
            }
            className="gap-2"
            variant="brand"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={businessEmployee.employee.products || []}
        isLoading={isLoading}
        emptyMessage="No products found"
        searchableColumns={["name", "category"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "out_of_stock", label: "Out of Stock" },
            ],
          },
        ]}
      />
    </div>
  );
}
