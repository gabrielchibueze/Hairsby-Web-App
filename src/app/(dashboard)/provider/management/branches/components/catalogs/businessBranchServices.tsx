// @/app/provider/management/branches/components/catalogs/businessBranchServices.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ScissorsSquareIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { BranchTabsProps } from "../businessBranchTabs";
import { useAuth } from "@/lib/contexts/auth.context";
import { ServiceColumns } from "../../../components/columns/serviceColumns";

export function BusinessBranchServices({
  businessBranch,
  isLoading,
  modeAndCreateFunction,
}: BranchTabsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = businessBranch.permissions.manageServices;

  const query = new URLSearchParams({
    branchId: businessBranch.branch.id as string,
    branchName: businessBranch.branchName as string,
    businessName: businessBranch.parentBusiness.businessName as string,
    businessId: businessBranch.parentBusinessId as string,
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
        data={businessBranch.branch.services || []}
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
