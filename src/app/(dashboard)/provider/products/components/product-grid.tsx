"use client";

import { Product } from "@/lib/api/products/product";
import { ProductCard } from "./product-card";
// import { ProductFilters } from "./filters";
import { useState } from "react";

interface ProductGridProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductGrid({
  products,
  onEditProduct,
  onViewDetails,
}: ProductGridProps) {
  return (
    <div className="space-y-4">
      {products?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => onEditProduct(product)}
              onViewDetails={() => onViewDetails(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products match your filters</p>
        </div>
      )}
    </div>
  );
}
