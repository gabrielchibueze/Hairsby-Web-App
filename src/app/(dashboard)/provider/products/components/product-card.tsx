"use client";

import { Product } from "@/lib/api/products/product";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ProductStatusBadge } from "./status-badge";

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onViewDetails: () => void;
}

export function ProductCard({
  product,
  onEdit,
  onViewDetails,
}: ProductCardProps) {
  const mainImage =
    product.coverPhoto || product.images?.[0] || "/placeholder-product.jpg";

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2">
          <ProductStatusBadge status={product.status} />
        </div>
        {product.discountPrice && (
          <div className="absolute top-2 right-2 bg-hairsby-orange text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
            <span>{Number(product.averageRating)?.toFixed(1) || "0.0"}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-hairsby-orange">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{product.stock} in stock</span>
            <span className="text-gray-500 capitalize">{product.category}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Link href={`/provider/products/${product.id}`}>
            <Button
              variant="outline"
              size="sm"
              // onClick={onViewDetails}
              className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </Link>
          <Link href={`/provider/products/${product.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              // onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
