"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BusinessEmployee } from "@/lib/api/accounts/business";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InviteEmployeeForm } from "./InviteEmployeeForm";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/ui/data-table";
import { businessEmployeeColumns } from "./columns/businessEmployeeColums";
import { useAuth } from "@/lib/contexts/auth.context";

interface EmployeeDashboardProps {
  businessEmployee: BusinessEmployee[];
}

export function BusinessEmployeeDashboard({
  businessEmployee,
}: EmployeeDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const isBusiness = user?.role === "business";

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
            {isBusiness ? "Team Management" : "Organisations"}
          </h1>
          <p className="text-muted-foreground">
            {isBusiness
              ? "Manage your specialists and their permissions"
              : "Manage organisations you work with"}
          </p>
        </div>
        {isBusiness && (
          <Button onClick={toggleDialog} className="gap-2" variant="brand">
            <Plus className="h-4 w-4" />
            Invite Specialist
          </Button>
        )}
      </div>

      <DataTable
        columns={businessEmployeeColumns}
        data={businessEmployee}
        emptyMessage={
          isBusiness ? "No specialists found" : "No organisations found"
        }
        searchableColumns={[isBusiness ? "employee" : "business"]}
        filterableColumns={[
          {
            id: "role",
            title: "Role",
            options: [
              { value: "admin", label: "Admin" },
              { value: "specialist", label: "Specialist" },
            ],
          },
          ...(isBusiness
            ? [
                {
                  id: "employmentStatus",
                  title: "Status",
                  options: [
                    { value: "active", label: "Active" },
                    { value: "pending", label: "Pending" },
                    { value: "on_leave", label: "On Leave" },
                    { value: "terminated", label: "Terminated" },
                  ],
                },
              ]
            : []),
        ]}
        dateRangeColumn="joinedAt"
      />

      {isBusiness && (
        <InviteFormForSpecialists
          isDialogOpen={isDialogOpen}
          toggleDialog={toggleDialog}
          setIsDialogOpen={setIsDialogOpen}
          handleFormSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export function InviteFormForSpecialists({
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
          <DialogTitle>Onboard a new Specialist</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-200px)]">
          <InviteEmployeeForm
            onClose={setIsDialogOpen}
            onSuccess={handleFormSuccess}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
