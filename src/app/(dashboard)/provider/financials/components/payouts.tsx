// app/(provider)/financials/components/payouts.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, CreditCard, Banknote, History } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPayouts, requestPayout } from "@/lib/api/accounts/provider";
import { PayoutRequestDialog } from "./payout-request-dialog";
import { payoutColumns } from "./payouts-columns";
import { DataTable } from "@/components/ui/data-table";

export function Payouts() {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const { data: payouts, isLoading } = useQuery({
    queryKey: ["provider-payouts"],
    queryFn: getPayouts,
  });

  // const handlePayoutRequest = async (data: {
  //   amount: number;
  //   paymentMethod: string;
  //   bankDetails: any;
  // }) => {
  //   try {
  //     await requestPayout(data);
  //     setRequestDialogOpen(false);
  //     // Invalidate queries or show success message
  //   } catch (error) {
  //     console.error("Failed to request payout", error);
  //   }
  // };

  const handlePayoutRequest = async (data: {
    amount: number;
    paymentMethod: "bank_transfer" | "paypal";
    bankDetails?: {
      accountNumber: string;
      sortCode: string;
    };
  }) => {
    try {
      await requestPayout(data);
      setRequestDialogOpen(false);
    } catch (error) {
      console.error("Failed to request payout", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£1,250.00</div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payouts
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£350.00</div>
            <p className="text-xs text-muted-foreground">
              Processing or in escrow
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid Out
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£5,780.00</div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>
              View your past and pending payout requests
            </CardDescription>
          </div>
          <PayoutRequestDialog
            open={requestDialogOpen}
            onOpenChange={setRequestDialogOpen}
            onSubmit={handlePayoutRequest}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={payoutColumns}
            data={payouts || []}
            isLoading={isLoading}
            emptyMessage="No payouts found"
            searchableColumns={["paymentMethod"]}
            filterableColumns={[
              {
                id: "status",
                title: "Status",
                options: [
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
                ],
              },
            ]}
            dateRangeColumn="createdAt"
          />
        </CardContent>
      </Card>
    </div>
  );
}
