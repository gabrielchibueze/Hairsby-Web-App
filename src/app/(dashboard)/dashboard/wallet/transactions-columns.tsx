import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/lib/api/financials/wallet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowRightLeft } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      const amount = parseFloat(row.getValue("amount"));

      let icon;
      let variant:
        | "default"
        | "outline"
        | "destructive"
        | "secondary"
        | "success"
        | "warning"
        | "info" = "default";
      switch (type) {
        case "deposit":
          icon = <ArrowDown className="h-4 w-4 text-green-500" />;
          variant = "success";
          break;
        case "withdrawal":
          icon = <ArrowUp className="h-4 w-4 text-red-500" />;
          variant = "destructive";
          break;
        case "transfer":
          icon = <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
          variant = amount > 0 ? "success" : "destructive";
          break;
        case "payment":
          icon = <ArrowUp className="h-4 w-4 text-orange-500" />;
          variant = "warning";
          break;
        case "refund":
          icon = <ArrowDown className="h-4 w-4 text-purple-500" />;
          variant = "secondary";
          break;
        default:
          icon = null;
          variant = "default";
      }

      return (
        <div className="flex items-center gap-2">
          {icon}
          <Badge variant={variant}>
            {String(type).charAt(0).toUpperCase() + String(type).slice(1)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(Math.abs(amount));

      return (
        <div className={amount >= 0 ? "text-green-500" : "text-red-500"}>
          {amount >= 0 ? "+" : "-"} {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate">
          {row.getValue("description") || "No description"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default";

      if (status === "completed") variant = "default";
      else if (status === "pending") variant = "secondary";
      else if (status === "failed") variant = "destructive";
      else if (status === "cancelled") variant = "outline";

      return (
        <Badge variant={variant}>
          {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm">{row.getValue("reference")}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return safeFormatDate(date, "MMM dd, yyyy h:mm a");
    },
  },
];
