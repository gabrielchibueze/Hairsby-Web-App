// components/provider/management/specialists/ProductColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/api/products/product";
import { boolean } from "zod";
import { formatCurrency } from "@/lib/utils";

export const productColumns = (
  query: string,
  canManage?: boolean
): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          {product.coverPhoto && (
            <img
              src={product.coverPhoto}
              alt={product.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          )}
          <span>{product.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return formatCurrency(price, row.original.currency!);
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return stock > 0 ? stock : "Out of stock";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "active"
        | "inactive"
        | "out_of_stock";
      const statusMap = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        out_of_stock: "bg-red-100 text-red-800",
      };

      const formatted = status.replace(/_/g, " ");
      return (
        <Badge className={`capitalize ${statusMap[status]}`}>{formatted}</Badge>
      );
    },
  },
  {
    accessorKey: "Actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/provider/management/products/${product.id}?${query}`
                )
              }
            >
              View Product
            </DropdownMenuItem>{" "}
            {canManage && (
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/provider/management/products/${product.id}/edit?${query}`
                  )
                }
              >
                Edit Product
              </DropdownMenuItem>
            )}
            {canManage && (
              <DropdownMenuItem className="text-red-600">
                Delete Product
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
