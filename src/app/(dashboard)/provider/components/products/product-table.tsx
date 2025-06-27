"use client";

import { Product } from "@/lib/api/products/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ProductStatusBadge } from "./status-badge";

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductTable({
  products,
  onEditProduct,
  onViewDetails,
}: ProductTableProps) {
  const router = useRouter();

  const handleStatusChange = async (productId: string, status: string) => {
    // Implement status change logic
    console.log(`Changing product ${productId} to ${status}`);
    router.refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id} className="hover:bg-background">
              <TableCell>
                <div className="relative w-12 h-12">
                  <Image
                    src={
                      product.coverPhoto ||
                      product.images?.[0] ||
                      "/placeholder-product.jpg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {product.description}
                </div>
              </TableCell>
              <TableCell className="capitalize">{product.category}</TableCell>
              <TableCell className="text-right">
                {product.discountPrice ? (
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-hairsby-orange">
                      {formatCurrency(
                        product.discountPrice,
                        product?.currency!
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.price, product?.currency!)}
                    </span>
                  </div>
                ) : (
                  formatCurrency(product.price, product?.currency!)
                )}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span>
                    {Number(product.averageRating)?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditProduct(product)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {product.status === "active" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(product.id, "inactive")
                        }
                        className="text-amber-600"
                      >
                        Mark as Inactive
                      </DropdownMenuItem>
                    )}
                    {product.status === "inactive" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(product.id, "active")}
                      >
                        Mark as Active
                      </DropdownMenuItem>
                    )}
                    {product.status === "out_of_stock" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(product.id, "active")}
                      >
                        Restock
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products match your filters
          </p>
        </div>
      )}
    </div>
  );
}
