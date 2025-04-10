"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const dummyDisputes = [
  {
    id: "1",
    customer: {
      name: "Emma Thompson",
      email: "emma@example.com",
    },
    provider: {
      name: "Luxe Hair Studio",
      email: "info@luxehair.com",
    },
    amount: 75.0,
    reason: "Service not  described",
    status: "open",
    createdAt: "2025-02-25T10:00:00Z",
  },
  {
    id: "2",
    customer: {
      name: "Sophie Chen",
      email: "sophie@example.com",
    },
    provider: {
      name: "Glam Squad",
      email: "info@glamsquad.com",
    },
    amount: 120.0,
    reason: "Appointment missed",
    status: "in_review",
    createdAt: "2025-02-25T09:30:00Z",
  },
];

export function DisputeList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Disputes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyDisputes.map((dispute, index) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dispute #{dispute.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {dispute.reason}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Contact Parties</DropdownMenuItem>
                    <DropdownMenuItem>Resolve Dispute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="font-medium">Customer</p>
                  <p>{dispute.customer.name}</p>
                  <p className="text-muted-foreground">
                    {dispute.customer.email}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Provider</p>
                  <p>{dispute.provider.name}</p>
                  <p className="text-muted-foreground">
                    {dispute.provider.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      dispute.status === "open" &&
                        "bg-yellow-100 text-yellow-800",
                      dispute.status === "in_review" &&
                        "bg-blue-100 text-blue-800"
                    )}
                  >
                    {dispute.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Opened {format(new Date(dispute.createdAt), "PP")}
                  </span>
                </div>
                <span className="font-medium">
                  £{dispute.amount.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
