"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/use-toast";
import { getProductById } from "@/lib/api/products";
import { cn } from "@/lib/utils";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductById(params.id),
  });

  const handleAddToCart = async () => {
    try {
      await addItem(params.id, quantity);
      setQuantity(1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container py-10">
        <Button variant="ghost" className="mb-8" asChild>
          <a href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </a>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2",
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                  <span className="ml-1 text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  Brand: {product.brand}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  £{product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    £{product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-sm",
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={product.stock === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity((prev) => Math.min(product.stock, prev + 1))
                    }
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                Free delivery on orders over £50
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="grid gap-4">
                      <div>
                        <dt className="font-medium">Brand</dt>
                        <dd className="text-muted-foreground">
                          {product.brand}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Category</dt>
                        <dd className="text-muted-foreground">
                          {product.category}
                        </dd>
                      </div>
                      {/* Add more product details here */}
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      {product.reviews} reviews with an average rating of{" "}
                      {product.rating}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{/* Add reviews list here */}</CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <CartSheet />
    </div>
  );
}
