"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Plus,
  Wallet as WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWallet, getTransactions } from "@/lib/api/wallet";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const [transactionType, setTransactionType] = useState("all");

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", transactionType],
    queryFn: () => getTransactions({ type: transactionType }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your balance and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/dashboard/wallet/add-funds">
              <Plus className="mr-2 h-4 w-4" />
              Add Funds
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/dashboard/wallet/payment-methods">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Methods
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Balance</CardTitle>
              <CardDescription>Your current wallet balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    £{wallet?.balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available Balance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
              </div>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="credit">Credits</SelectItem>
                  <SelectItem value="debit">Debits</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "rounded-full p-2",
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.date), "PPp")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "font-medium",
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {transaction.type === "credit" ? "+" : "-"}£
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wallet?.paymentMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        •••• •••• •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="text-sm text-muted-foreground">
                      Default
                    </span>
                  )}
                </motion.div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/wallet/payment-methods">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
