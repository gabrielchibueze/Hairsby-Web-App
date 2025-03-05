"use client"

import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionListProps {
  transactions: Array<{
    id: string
    type: "credit" | "debit"
    amount: number
    description: string
    date: string
  }>
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "rounded-full p-2",
                transaction.type === "credit"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}>
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
            <p className={cn(
              "font-medium",
              transaction.type === "credit"
                ? "text-green-600"
                : "text-red-600"
            )}>
              {transaction.type === "credit" ? "+" : "-"}
              £{Math.abs(transaction.amount).toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}