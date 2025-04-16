"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Star, ChevronLeft, Heart, Share2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  userGetProviderById,
  userGetProviderProducts,
  userGetProviderServices,
} from "@/lib/api/accounts/provider";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { ServiceCard } from "@/components/services/service-card";
import Breadcrumb from "@/components/breadcrumb";

export default function ProviderDetailsComponent({
  params,
}: {
  params: { id: string };
}) {
  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", params.id], // This is correct
    queryFn: () => userGetProviderById(params.id),
  });

  console.log(params);

  //   const { data: products = [] } = useQuery({
  //     queryKey: ["provider-products", params.id], // Add providerId to key
  //     queryFn: () => userGetProviderProducts({ providerId: params.id }),
  //     enabled: !!params.id, // Enable based on params.id existing
  //   });

  //   const { data: services = [] } = useQuery({
  //     queryKey: ["provider-services", params.id], // Add providerId to key
  //     queryFn: () => userGetProviderServices({ providerId: params.id }),
  //     enabled: !!params.id, // Enable based on params.id existing
  //   });
  if (isLoading || !provider) {
    return (
      <div className="container py-12">
        <div className="space-y-8">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
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
          { name: "Providers", link: "/providers" },
          {
            name:
              provider.businessName ||
              `${provider.firstName} ${provider.lastName}`,
          },
        ]}
      />

      {/* Provider Bio */}
      <section className="py-12">
        <div className="container px-4 sm:px-8 ">
          <div className="flex justify-between items-start mb-8">
            <Button variant="ghost" asChild>
              <Link href="/providers">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Providers
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Provider Info */}
            <div className="md:w-1/3 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={provider.photo}
                    alt={
                      provider.businessName ||
                      `${provider.firstName} ${provider.lastName}`
                    }
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                  {provider.businessName ||
                    `${provider.firstName} ${provider.lastName}`}
                </h1>
                <div className="mt-2 flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 ${
                        rating <= provider.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {provider.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">About</h3>
                  <p className="mt-2 text-gray-600">
                    {provider.bio || "No bio provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Contact</h3>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2">📧</span>
                      {provider.email}
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📱</span>
                      {provider.phone || "Not provided"}
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📍</span>
                      {provider.address && `${provider.address}, `}
                      {provider.city && `${provider.city}, `}
                      {provider.country}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Provider Products and Info */}
            <div className="md:w-2/3">
              <Tabs defaultValue="about">
                <TabsList className="flex gap-2 sm:gap-8 w-full lg:w-fit">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-6">
                  <div className="prose prose-sm max-w-none">
                    {provider.description || (
                      <p className="text-gray-600">
                        No additional information provided.
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="services" className="mt-6">
                  <div className="grid gap-2 sm:gap-6 grid-cols-2 lg:grid-cols-3">
                    {provider.services?.length > 0 ? (
                      provider.services.map((service: any) => (
                        <ServiceCard service={service} />
                      ))
                    ) : (
                      <p className="text-gray-600 col-span-full text-center py-8">
                        This provider has no services listed yet.
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                  {provider.products.length > 0 ? (
                    <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                      {provider.products.map((product: any) => (
                        <ProductCard product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 py-8 text-center">
                      This provider has no products listed yet.
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    {provider.reviews?.length > 0 ? (
                      provider.reviews?.map((review: any) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6"
                        >
                          <div className="flex items-center gap-4">
                            {review.customer.photo && (
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <Image
                                  src={review.customer.photo}
                                  alt={review.customer.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">
                                {review.customer.name}
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
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 py-8 text-center">
                        No reviews yet.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
