"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/app/(dashboard)/dashboard/wallet/transactions-table";
import { columns } from "./transactions-columns";
import { getTransactions } from "@/lib/api/financials/wallet";

export function Transactions() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["provider-transactions"],
    queryFn: () => getTransactions(), // Wrap the function call if it needs no params
    // OR if your API needs pagination params:
    // queryFn: () => getTransactions({ page: 1, limit: 10 }), 
  });

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
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£12,450.00</div>
            <p className="text-xs text-muted-foreground">
              All-time transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Income (30d)
            </CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£1,250.00</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
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
            <div className="text-2xl font-bold">£350.00</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
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
            columns={columns}
            data={transactions || []}
            emptyMessage="No transactions found"
          />
        </CardContent>
      </Card>
    </div>
  );
}