// @/app/provider/management/branches/components/businessBranchesPageComponent.tsx

"use client";

import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/general/spinner";
import { useAuth } from "@/lib/contexts/auth.context";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  BusinessBranchesDashboard,
  InviteFormForBranches,
} from "./businessBranchesDashboard";
import { getBusinessBranches } from "@/lib/api/accounts/company";

export default function BusinessBranchesPageComponent() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const toggleDialog = useCallback(() => {
    setIsDialogOpen((prev) => !prev);
  }, [isDialogOpen]);

  const {
    data: businessBranches,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["businessBranches"],
    queryFn: getBusinessBranches,
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
          <p className="text-lg font-medium">Failed to load branches</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!businessBranches || businessBranches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No branches found</p>
          <p className="text-muted-foreground">
            Get started by creating your first branch location
          </p>
          <Button onClick={toggleDialog} className="gap-2" variant="brand">
            <Plus className="h-4 w-4" />
            Create Branch
          </Button>
          <InviteFormForBranches
            isDialogOpen={isDialogOpen}
            toggleDialog={toggleDialog}
            setIsDialogOpen={setIsDialogOpen}
            handleFormSuccess={handleFormSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <BusinessBranchesDashboard businessBranches={businessBranches} />
    </div>
  );
}
