"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/ui/data-table";
import { Client } from "@/lib/api/accounts/clients";
import { SendMarketingEmailForm } from "./sendMarketingEmailForm";
import { clientColumns } from "./columns/clientColumns";

interface ClientDashboardProps {
  clients: Client[];
}

export function ClientDashboard({ clients }: ClientDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientIds, setClientIds] = useState<string[] | null>(null);
  const router = useRouter();

  const toggleDialog = useCallback(() => {
    setIsDialogOpen((prev) => !prev);
  }, []);

  const getClientIds = useCallback(() => {
    const mappedClientIds = clients.map((client) => client.id);
    sendMarketetingEmailToClients(mappedClientIds);
  }, [clients]);

  const sendMarketetingEmailToClients = (clientIds: Array<string>) => {
    toggleDialog();
    setClientIds(clientIds);
  };

  const handleFormSuccess = useCallback(() => {
    setIsDialogOpen(false);
    router.refresh();
  }, [router]);
  const columns = clientColumns(sendMarketetingEmailToClients);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Client Management
          </h1>
          <p className="text-muted-foreground">
            Manage your clients and their interactions
          </p>
        </div>
        <Button onClick={getClientIds} className="gap-2" variant="brand">
          <Plus className="h-4 w-4" />
          Send Marketing Email
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        emptyMessage="No clients found"
        searchableColumns={["firstName", "lastName", "email"]}
        filterableColumns={[
          {
            id: "gender",
            title: "Gender",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ],
          },
        ]}
        dateRangeColumn="createdAt"
      />

      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogContent className="max-w-[90vw] sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Send Marketing Email</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-200px)]">
            <SendMarketingEmailForm
              clientIds={clientIds}
              onClose={toggleDialog}
              onSuccess={handleFormSuccess}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
