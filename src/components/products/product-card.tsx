"use client";

import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorite } from "../favorite/favorite-provider";
import { Product } from "@/lib/api/products/product";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();

  const hasDiscount =
    product?.discountPrice && product?.discountPrice < product?.price;
  const averageRating = product?.averageRating || 0;
  const reviewCount = product?.reviewCount || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      type: "product",
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Product image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            product?.coverPhoto ||
            product?.images[0] ||
            "/image-placeholder.png"
          }
          alt={product?.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-hairsby-orange text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(
              ((product?.price - (product?.discountPrice || 0)) /
                product?.price) *
                100
            )}
            % OFF
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite("product", product?.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 transition-colors text-gray-400 hover:text-gray-500`}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite("product", product?.id) ? "fill-current text-rose-500 hover:text-rose-500" : ""}`}
          />
        </button>
      </div>

      {/* Product details */}
      <div className="p-5">
        {/* Category and rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {product?.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500">
              {averageRating.toFixed(1)}
              {reviewCount > 0 && (
                <span className="text-gray-400"> ({reviewCount})</span>
              )}
            </span>
          </div>
        </div>

        {/* Product title */}
        <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
          <Link href={`/products/${product?.id}`}>{product?.name}</Link>
        </h3>

        {/* Product meta */}
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          {product?.brand && (
            <>
              <span>Brand: {product?.brand}</span>
              <span className="text-gray-300">•</span>
            </>
          )}
          {product?.provider?.city && (
            <>
              <MapPin className="h-4 w-4" />
              <span>{product?.provider?.city}</span>
            </>
          )}
        </div>

        {/* Price and action */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(Number(product?.discountPrice).toFixed(2))}
                </span>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatCurrency(Number(product?.price).toFixed(2))}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                £{Number(product?.price).toFixed(2)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="bg-hairsby-orange hover:bg-hairsby-orange/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
