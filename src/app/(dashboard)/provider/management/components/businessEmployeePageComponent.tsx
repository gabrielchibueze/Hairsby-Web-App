// app/provider/management/specialists/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { getBusinessEmployeeOrganisations } from "@/lib/api/accounts/business";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Spinner from "@/components/general/spinner";
import { useAuth } from "@/lib/contexts/auth.context";
import { BusinessEmployeeDashboard, InviteFormForSpecialists } from "./businessEmployeeDashboard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteEmployeeForm } from "./InviteEmployeeForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
export default function BusinessEmployeesPageComponent() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const isBusiness = user?.role === "business";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const toggleDialog = useCallback(() => {
    setIsDialogOpen((prev) => !prev);
  }, [isDialogOpen]);

  const {
    data: businessEmployee,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["businessEmployees"],
    queryFn: getBusinessEmployeeOrganisations,
  });
  const handleFormSuccess = useCallback(() => {
    setIsDialogOpen(false);
    router.refresh();
  }, []);
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-center text-lg font-medium">
          Please sign in to access this page
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            {isBusiness
              ? "Failed to load specialists"
              : "Failed to load organisations"}
          </p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!businessEmployee || businessEmployee.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            {isBusiness ? "No specialists found" : "No organisations found"}
          </p>
          <p className="text-muted-foreground">
            {isBusiness
              ? "Get started by inviting your first specialist/employee"
              : "You're not currently associated with any organisations"}
          </p>
          {isBusiness && (
            <Button onClick={toggleDialog} className="gap-2" variant="brand">
              <Plus className="h-4 w-4" />
              Invite Specialist
            </Button>
          )}
          {isBusiness && (
            <InviteFormForSpecialists
              isDialogOpen={isDialogOpen}
              toggleDialog={toggleDialog}
              setIsDialogOpen={setIsDialogOpen}
              handleFormSuccess={handleFormSuccess}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <BusinessEmployeeDashboard businessEmployee={businessEmployee} />
    </div>
  );
}
