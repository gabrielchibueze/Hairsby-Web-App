// app/(provider)/financials/components/transactions-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/lib/api/financials/wallet";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <Badge
          variant={
            type === "deposit" || type === "escrow_release"
              ? "success"
              : "destructive"
          }
        >
          {String(type)
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.getValue("type");
      const isNegative = ["withdrawal", "escrow_hold"].includes(type as string);
      return (
        <span className={isNegative ? "text-red-500" : "text-green-500"}>
          {isNegative ? "-" : "+"}£{Math.abs(amount).toFixed(2)}
        </span>
      );
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return row.getValue("description") || "N/A";
    },
  },
];