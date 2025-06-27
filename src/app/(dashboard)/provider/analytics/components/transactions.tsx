// app/(provider)/financials/components/transactions.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { getTransactions, calculateTotals } from "@/lib/api/financials/wallet";
import { providerTransactionColumns } from "./transactions-columns";
import { format } from "date-fns";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

export function Transactions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["provider-transactions"],
    queryFn: () => getTransactions(),
  });

  const { totalRevenue, totalIncome, totalExpenses } = useMemo(() => {
    return calculateTotals(data?.transactions || []);
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">
          Error loading transactions: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                totalRevenue.toFixed(2),
                data?.transactions[0].currency!
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (30d)</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                totalIncome.toFixed(2),
                data?.transactions[0].currency!
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All completed income
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expenses (30d)
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                totalExpenses.toFixed(2),
                data?.transactions[0].currency!
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All completed expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={providerTransactionColumns}
            data={data?.transactions || []}
            emptyMessage="No transactions found"
            searchableColumns={["description", "reference"]}
            filterableColumns={[
              {
                id: "type",
                title: "Type",
                options: [
                  { value: "deposit", label: "Deposit" },
                  { value: "withdrawal", label: "Withdrawal" },
                  { value: "escrow_hold", label: "Escrow Hold" },
                  { value: "escrow_release", label: "Escrow Release" },
                  { value: "transfer", label: "Transfer" },
                  { value: "payment", label: "Payment" },
                  { value: "refund", label: "Refund" },
                ],
              },
              {
                id: "status",
                title: "Status",
                options: [
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "reversed", label: "Reversed" },
                ],
              },
            ]}
            dateRangeColumn="createdAt"
            // pagination={{
            //   pageSize: data?.pagination.limit || 10,
            //   pageCount: data?.pagination.totalPages || 1,
            //   totalItems: data?.pagination.total || 0,
            // }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
