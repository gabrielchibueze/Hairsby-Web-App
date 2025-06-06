"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ScissorsSquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ServiceColumns } from "../columns/serviceColumns";
import { EmployeeTabsProps } from "../businessEmployeeTabs";
import { useAuth } from "@/lib/contexts/auth.context";

export function BusinessEmployeeServices({
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
    businessEmployee.permissions.manageServices &&
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

  const columns = ServiceColumns(query, canManage);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ScissorsSquareIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-2xl">Services</h3>
        </div>
        {canManage && (
          <Button
            onClick={() =>
              router.push(`/provider/management/services/new?${query}`)
            }
            className="gap-2"
            variant="brand"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={businessEmployee.employee.services || []}
        isLoading={isLoading}
        emptyMessage="No services found"
        searchableColumns={["name", "category"]}
        filterableColumns={[
          {
            id: "isAvailable",
            title: "Availability",
            options: [
              { value: "true", label: "Available" },
              { value: "false", label: "Unavailable" },
            ],
          },
        ]}
      />
    </div>
  );
}
