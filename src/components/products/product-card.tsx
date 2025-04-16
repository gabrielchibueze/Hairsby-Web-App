"use client";

import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorite } from "../favorite/favorite-provider";
import { Product } from "@/lib/api/products/product";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();

  const hasDiscount =
    product?.discountPrice && product?.discountPrice < product.price;
  const averageRating = product?.averageRating || 0;
  const reviewCount = product?.reviewCount || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      type: "product",
      itemId: product.id,
      quantity: 1,
      // name: product.name,
      // price: hasDiscount ? product.discountPrice : product.price,
      // image: product?.coverPhoto || product.images[0],
    });
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 group-hover:shadow-md"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              product?.coverPhoto ||
              product?.images[0] ||
              "/image-placeholder.png"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-hairsby-orange text-white text-xs font-bold px-2 py-1 rounded-full">
              {Math.round(
                ((product.price - (product?.discountPrice || 0)) /
                  product.price) *
                  100
              )}
              % OFF
            </div>
          )}
          <button
            onClick={() => toggleFavorite("product", product.id)}
            className={`absolute z-20 top-2 right-2 p-2 rounded-full bg-white/90 ${isFavorite("product", product.id) ? "text-rose-500" : "text-gray-400"} hover:text-rose-500 transition-colors`}
          >
            <Heart className="h-4 w-4 fill-current" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{product.brand}</p>
            </div>
          </div>
          {/* Rating */}
          <div className="mt-2 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-3 w-3 ${
                    rating <= averageRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">({reviewCount})</span>
          </div>
          {/* Price */}
          <div className="mt-2">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  £{Number(product?.discountPrice).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  £{Number(product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-gray-900">
                £{Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          {/* Add to Cart */}
          <Button
            size="sm"
            className="w-full mt-3 bg-hairsby-orange/90 hover:bg-hairsby-orange/80"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}
