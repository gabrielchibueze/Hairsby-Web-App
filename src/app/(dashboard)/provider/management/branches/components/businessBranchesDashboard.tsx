// @/app/provider/management/branches/components/businessBranchesDashboard.tsx

"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BusinessBranch } from "@/lib/api/accounts/company";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/lib/contexts/auth.context";
import { InviteBranchForm } from "./InviteBranchForm";
import { businessBranchColumns } from "./columns/businessBranchColumns";

interface BranchesDashboardProps {
  businessBranches: BusinessBranch[];
}

export function BusinessBranchesDashboard({
  businessBranches,
}: BranchesDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const toggleDialog = useCallback(() => {
    setIsDialogOpen((prev) => !prev);
  }, [isDialogOpen]);

  const handleFormSuccess = useCallback(() => {
    setIsDialogOpen(false);
    router.refresh();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Branch Management
          </h1>
          <p className="text-muted-foreground">
            Manage your business locations and their operations
          </p>
        </div>
        <Button onClick={toggleDialog} className="gap-2" variant="brand">
          <Plus className="h-4 w-4" />
          Create Branch
        </Button>
      </div>

      <DataTable
        columns={businessBranchColumns}
        data={businessBranches}
        emptyMessage="No branches found"
        searchableColumns={["branch"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "pending_setup", label: "Pending Setup" },
              { value: "suspended", label: "Suspended" },
            ],
          },
          {
            id: "isPrimaryBranch",
            title: "Type",
            options: [
              { value: "true", label: "Primary" },
              { value: "false", label: "Secondary" },
            ],
          },
        ]}
        dateRangeColumn="createdAt"
      />

      <InviteFormForBranches
        isDialogOpen={isDialogOpen}
        toggleDialog={toggleDialog}
        setIsDialogOpen={setIsDialogOpen}
        handleFormSuccess={handleFormSuccess}
      />
    </div>
  );
}

export function InviteFormForBranches({
  isDialogOpen,
  toggleDialog,
  setIsDialogOpen,
  handleFormSuccess,
}: {
  isDialogOpen: boolean;
  toggleDialog: () => void;
  setIsDialogOpen: any;
  handleFormSuccess: () => void;
}) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogContent className="max-w-[90vw] sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Create a new Branch</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-200px)]">
          <InviteBranchForm
            onClose={setIsDialogOpen}
            onSuccess={handleFormSuccess}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
