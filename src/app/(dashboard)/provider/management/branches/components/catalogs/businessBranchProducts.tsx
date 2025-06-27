// @/app/provider/management/branches/components/catalogs/businessBranchProducts.tsx

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { BranchTabsProps } from "../businessBranchTabs";
import { useAuth } from "@/lib/contexts/auth.context";
import { productColumns } from "../../../components/columns/productColumns";

export function BusinessBranchProducts({
  businessBranch,
  isLoading,
  modeAndCreateFunction,
}: BranchTabsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = businessBranch.permissions.manageProducts;

  const query = new URLSearchParams({
    branchId: businessBranch.branch.id as string,
    branchName: businessBranch.branchName as string,
    businessName: businessBranch.parentBusiness.businessName as string,
    businessId: businessBranch.parentBusinessId as string,
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
        data={businessBranch.branch.products || []}
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
