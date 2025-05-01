"use client";

import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById, getProductReviews } from "@/lib/api/products/product";
import { useCart } from "@/components/cart/cart-provider";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useFavorite } from "@/components/favorite/favorite-provider";
import Breadcrumb from "@/components/breadcrumb";

export default function ProductDetailComponent({
  params,
}: {
  params: { id: string };
}) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductById(params.id),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", params.id],
    queryFn: () => getProductReviews(params.id),
    enabled: !!product,
  });

  const averageRating = product?.averageRating || 0;
  const reviewCount = product?.reviewCount || 0;
  const providerAverageRating = product?.provider?.rating || 0;
  const providerReviewCount = product?.provider?.totalReviews || 0;
  const hasDiscount =
    product?.discountPrice &&
    Number(product.discountPrice) < Number(product.price);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      type: "product",
      itemId: product.id,
      quantity: 1,
    });
  };

  // Inside your component:
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  if (isLoading || !product) {
    return (
      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-32 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}

      <Breadcrumb
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Products", link: "/products" },
          {
            name:
              product.category.charAt(0).toUpperCase() +
              product.category.slice(1),
            link: `/services?category=${product.category.split(" ").join("-")}`,
          },
          { name: `${product?.name}` },
        ]}
      />
      {/* Product Detail */}
      <section className="py-12">
        <div className="container px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-hairsby-orange text-white text-sm font-bold px-3 py-1 rounded-full">
                    {Math.round(
                      ((Number(product.price) -
                        Number(product.discountPrice)!) /
                        Number(product.price)) *
                        100
                    )}
                    % OFF
                  </div>
                )}
              </div>

              <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`embla__slide flex-shrink-0 aspect-square rounded-md overflow-hidden border-2 mx-1 ${
                        selectedImage === index
                          ? "border-hairsby-orange"
                          : "border-transparent"
                      }`}
                      style={{ maxWidth: "100%" }}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {product.name}
                  </h1>
                  <p className="mt-2 text-gray-600">{product.category}</p>
                </div>
                <button onClick={() => toggleFavorite("product", product.id)}>
                  <Heart
                    className={`h-6 w-6 ${isFavorite("product", product.id) ? "fill-current text-rose-500 hover:text-rose-500" : ""}`}
                  />
                </button>
              </div>

              <div className="mt-4 flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 ${
                        rating <= averageRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {Number(averageRating).toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>

              <div className="mt-6">
                {hasDiscount ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">
                      £{Number(product.discountPrice)?.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      £{Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-hairsby-orange">
                      Save £
                      {(
                        Number(product.price) - Number(product.discountPrice)!
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    £{Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
              {/* Add this section in the Product Info section, right after the price display */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900">Sold by</h3>
                {/* Provider Info */}
                <div className="mt-4 flex items-center gap-4">
                  {product.provider?.photo && (
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={product.provider?.photo}
                        alt={
                          product.provider?.businessName ||
                          product.provider?.firstName ||
                          "Provider"
                        }
                        width={48}
                        height={48}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}
                  <div>
                    <Link href={`/providers/${product.provider?.id}`}>
                      <h4 className="font-medium underline">
                        {product.provider?.businessName ||
                          product.provider?.firstName ||
                          "Professional"}
                      </h4>
                    </Link>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-4 w-4 ${
                            rating <= providerAverageRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({providerReviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <p className="text-gray-700">{product.description}</p>

                {product.status === "out_of_stock" ? (
                  <p className="text-red-500 font-medium">Out of Stock</p>
                ) : (
                  <p className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </p>
                )}
              </div>

              {/* Variant Selection */}
              {product.hasVariants && product.variants && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Options</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          selectedVariant === variant.id
                            ? "border-hairsby-orange bg-hairsby-orange/10"
                            : "border-gray-300"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 bg-hairsby-orange hover:bg-hairsby-orange/80"
                    onClick={handleAddToCart}
                    disabled={product.status === "out_of_stock"}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Share and Details */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">
                  Additional notes
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.metadata?.description || product.description}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.metadata?.notes ||
                    product.notes ||
                    "No additonal notes"}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.metadata?.specifications?.map(
                    (spec: any, index: number) => (
                      <div
                        key={index}
                        className="border-b border-gray-100 py-2"
                      >
                        <dt className="font-medium text-gray-900">
                          {spec.name}
                        </dt>
                        <dd className="mt-1 text-gray-600">{spec.value}</dd>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="space-y-8">
                  {reviews.length === 0 ? (
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review!
                    </p>
                  ) : (
                    reviews?.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-8"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                            {review.customer?.photo && (
                              <Image
                                src={review.customer?.photo}
                                alt={review.customer.firstName}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {review.customer.firstName}{" "}
                              {review.customer.lastName}
                            </h4>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                  key={rating}
                                  className={`h-4 w-4 ${
                                    rating <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-600">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="mt-4 flex gap-2">
                            {review.images.map((image: string, index: any) => (
                              <div
                                key={index}
                                className="h-16 w-16 rounded-md overflow-hidden"
                              >
                                <Image
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  width={64}
                                  height={64}
                                  className="object-cover h-full w-full"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
