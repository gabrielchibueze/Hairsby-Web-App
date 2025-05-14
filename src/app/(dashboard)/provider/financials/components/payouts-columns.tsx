// app/(provider)/financials/components/payouts-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Payout } from "@/lib/api/financials/wallet";

export const columns: ColumnDef<Payout>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return `£${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "completed"
              ? "success"
              : status === "failed"
              ? "destructive"
              : "warning"
          }
        >
          {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
  },
  {
    accessorKey: "bankDetails",
    header: "Bank Details",
    cell: ({ row }) => {
      const details = row.getValue("bankDetails") as {
        accountNumber: string;
        sortCode: string;
      };
      return `•••• ${details.accountNumber.slice(-4)}`;
    },
  },
];