"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import {  as MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dummyPayouts = [
  {
    id: "1",
    provider: {
      name: "Luxe Hair Studio",
      email: "info@luxehair.com"
    },
    amount: 250.00,
    status: "pending",
    requestDate: "2025-02-25T10:00:00Z"
  },
  {
    id: "2",
    provider: {
      name: "Glam Squad",
      email: "payments@glamsquad.com"
    },
    amount: 175.00,
    status: "processing",
    requestDate: "2025-02-25T09:30:00Z"
  }
]

export function PayoutList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyPayouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-medium">{payout.provider.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {payout.provider.email}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Requested: {format(new Date(payout.requestDate), "PP")}</span>
                  <span>•</span>
                  <span className={cn(
                    "capitalize",
                    payout.status === "pending" ? "text-yellow-600" : "text-blue-600"
                  )}>
                    {payout.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">£{payout.amount.toFixed(2)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}