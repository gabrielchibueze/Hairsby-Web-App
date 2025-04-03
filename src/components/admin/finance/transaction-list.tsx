"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dummyTransactions = [
  {
    id: "1",
    type: "credit",
    amount: 75.0,
    description: "Service payment",
    date: "2025-02-25T10:00:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "debit",
    amount: 50.0,
    description: "Provider payout",
    date: "2025-02-25T09:30:00Z",
    status: "completed",
  },
];

export function TransactionList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center space-x-4">
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
              <div className="text-right">
                <p
                  className={cn(
                    "font-medium",
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {transaction.type === "credit" ? "+" : "-"}£
                  {transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {transaction.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
