"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getWallet,
  getTransactions,
  addFunds,
  withdrawFunds,
  transferFunds,
  addBankAccount,
  setDefaultBankAccount,
  removeBankAccount,
  Transaction,
} from "@/lib/api/financials/wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowRightLeft,
  Plus,
  Banknote,
  History,
  CreditCard,
  Wallet as WalletIcon,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { AddFundsDialog } from "./add-funds-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { WithdrawFundsDialog } from "./withdraw-funds-dialog";
import { TransferFundsDialog } from "./transfer-funds-dialog";
import { AddBankAccountDialog } from "./add-bank-account-dialog";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { any, number } from "zod";
import { transactionColumns } from "./transactions-columns";
import { safeFormatDate } from "@/lib/utils";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import { DataTable } from "@/components/ui/data-table";

export default function WalletPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wallet");
  const [accountToRemove, setAccountToRemove] = useState<string | null>(null);
  const [accountToSetDefault, setAccountToSetDefault] = useState<string | null>(
    null
  );
  // Fetch wallet data
  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  // Fetch transactions
  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions({ limit: 50 }),
  });

  // Mutation for setting default bank account
  const { mutate: setDefaultAccount } = useMutation({
    mutationFn: setDefaultBankAccount,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Default bank account updated",
        className: "bg-green-500 text-primary-foreground",
      });
      refetchWallet();
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    },
  });

  // Mutation for removing bank account
  const { mutate: removeAccount } = useMutation({
    mutationFn: removeBankAccount,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bank account removed",
        className: "bg-green-500 text-primary-foreground",
      });
      refetchWallet();
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "An error occured",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <div className="flex gap-2">
          <AddFundsDialog onSuccess={refetchWallet}>
            <ArrowDown className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:flex">Add Funds</span>
          </AddFundsDialog>
          <WithdrawFundsDialog wallet={wallet} onSuccess={refetchWallet}>
            <ArrowUp className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:flex">Withdraw</span>
          </WithdrawFundsDialog>
          <TransferFundsDialog
            wallet={wallet}
            onSuccess={() => {
              refetchWallet();
              refetchTransactions();
            }}
          >
            <ArrowRightLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:flex">Transfer</span>
          </TransferFundsDialog>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="flex justify-between gap:2 sm:gap-3 sm:justify-start sm:w-fit">
          <TabsTrigger value="wallet" className="flex gap-2">
            <WalletIcon className="h-4 w-4 hidden sm:block" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex gap-2">
            <History className="h-4 w-4 hidden sm:block" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="bank-accounts" className="flex gap-2">
            <CreditCard className="h-4 w-4 hidden sm:block" />
            Bank Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-4">
          {walletLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Balance
                  </CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                {wallet?.currency && wallet?.balance ? (
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {wallet?.currency} {Number(wallet?.balance).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Immediately available for use
                    </p>
                  </CardContent>
                ) : (
                  <CardContent>Nil</CardContent>
                )}
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Escrow Balance
                  </CardTitle>
                  <WalletIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                {wallet?.currency && wallet?.escrowBalance ? (
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {wallet?.currency}{" "}
                      {Number(wallet?.escrowBalance).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Held for active bookings
                    </p>
                  </CardContent>
                ) : (
                  <CardContent>Nil</CardContent>
                )}
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Last Transaction
                  </CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {wallet?.lastTransactionAt
                      ? new Date(wallet.lastTransactionAt).toLocaleDateString()
                      : "No transactions"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {wallet?.lastTransactionAt
                      ? new Date(wallet.lastTransactionAt).toLocaleTimeString()
                      : ""}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your wallet with these quick actions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <AddFundsDialog onSuccess={refetchWallet} variant="outline">
                <ArrowDown className="h-4 w-4 mr-2" />
                Add Funds
              </AddFundsDialog>

              <WithdrawFundsDialog
                wallet={wallet}
                onSuccess={refetchWallet}
                variant="outline"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Withdraw
              </WithdrawFundsDialog>

              <TransferFundsDialog
                wallet={wallet}
                onSuccess={() => {
                  refetchWallet();
                  refetchTransactions();
                }}
                variant="outline"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transfer
              </TransferFundsDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent activity in your wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transactions?.transactions?.slice(0, 10) || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(value) => safeFormatDate(value, "MMM dd")}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${wallet?.currency} ${value}`,
                        "Amount",
                      ]}
                      labelFormatter={(value) =>
                        `Date: ${safeFormatDate(value, "PPpp")}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Amount"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Deposits",
                        value:
                          transactions?.transactions
                            ?.filter((t: Transaction) => t.type === "deposit")
                            .reduce((sum: any, t: any) => sum + t.amount, 0) ||
                          0,
                      },
                      {
                        name: "Withdrawals",
                        value: Math.abs(
                          transactions?.transactions
                            ?.filter(
                              (t: Transaction) => t.type === "withdrawal"
                            )
                            .reduce((sum: any, t: any) => sum + t.amount, 0) ||
                            0
                        ),
                      },
                      {
                        name: "Transfers",
                        value: Math.abs(
                          transactions?.transactions
                            ?.filter((t: Transaction) => t.type === "transfer")
                            .reduce((sum: any, t: any) => sum + t.amount, 0) ||
                            0
                        ),
                      },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${wallet?.currency} ${value}`,
                        "Amount",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent activity in your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <DataTable
                  columns={transactionColumns}
                  data={transactions?.transactions || []}
                  isLoading={transactionsLoading}
                  emptyMessage="No transactions found"
                  searchableColumns={["reference", "description"]}
                  filterableColumns={[
                    {
                      id: "type",
                      title: "Type",
                      options: [
                        { value: "deposit", label: "Deposit" },
                        { value: "withdrawal", label: "Withdrawal" },
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
                      ],
                    },
                  ]}
                  dateRangeColumn="createdAt"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank-accounts">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>
                  Manage your connected bank accounts
                </CardDescription>
              </div>
              <AddBankAccountDialog onSuccess={refetchWallet} />
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : wallet?.bankAccounts?.length ? (
                <div className="space-y-4">
                  {wallet.bankAccounts.map((account: any) => (
                    <Card key={account.id} className="relative">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{account.bankName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {account.accountNumber} • {account.country}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 items-center ">
                            {account.id === wallet.defaultBankAccountId ? (
                              <span className="text-xs  bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDefaultAccount(account.id)}
                              >
                                Set Default
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAccountToRemove(account.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            <ConfirmationDialog
                              open={!!accountToRemove}
                              onOpenChange={(open) =>
                                !open && setAccountToRemove(null)
                              }
                              title="Remove Bank Account"
                              description="Are you sure you want to remove this bank account? This action cannot be undone."
                              onConfirm={() => {
                                removeAccount(accountToRemove!);
                                setAccountToRemove(null);
                              }}
                              variant="destructive"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Banknote className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No bank accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Add a bank account to withdraw funds
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
