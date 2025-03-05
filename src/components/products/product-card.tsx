"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "@/lib/api/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      await addItem(product.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart",
      });
    }
  };

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {product.discount > 0 && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        <div className="flex items-center">
          <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
          <span className="text-sm">{product.rating}</span>
          <span className="ml-1 text-sm text-muted-foreground">
            ({product.reviews} reviews)
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">£{product.price.toFixed(2)}</p>
            {product.originalPrice > product.price && (
              <p className="text-sm text-muted-foreground line-through">
                £{product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" asChild>
          <a href={`/products/${product.id}`}>View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
