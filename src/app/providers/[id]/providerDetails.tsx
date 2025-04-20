"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Star,
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  Scissors,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { userGetProviderById } from "@/lib/api/accounts/provider";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { ServiceCard } from "@/components/services/service-card";
import Breadcrumb from "@/components/breadcrumb";
import { useFavorite } from "@/components/favorite/favorite-provider";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { ProviderSchedule } from "@/components/provider/schedule";
import { useEffect, useState } from "react";
import { geocodeAddress } from "@/lib/utils/geocode";
import { format } from "date-fns";
import { GetProviderSchedule } from "./provider-schedule";
import MapPreview from "@/components/map";

// const MapWithNoSSR = dynamic(() => import("@/components/map"), {
//   ssr: false,
//   loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
// });

export default function ProviderDetailsComponent({
  params,
}: {
  params: { id: string };
}) {
  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", params.id],
    queryFn: () => userGetProviderById(params.id),
  });

  const { toggleFavorite, isFavorite } = useFavorite();
  const [hasLocationCoordinates, setHasLocationCoordinates] = useState<
    boolean | false
  >(false);

  useEffect(() => {
    if (provider) {
      if (provider.latitude && provider.longitude) {
        setHasLocationCoordinates(true);
      } else if (provider.address || provider.city || provider.country) {
        setHasLocationCoordinates(true);
      }
    }
  }, [provider]);

  if (isLoading || !provider) {
    return (
      <div className="container py-12 px-4 sm:px-8">
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

  const providerName =
    provider.businessName || `${provider.firstName} ${provider.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Providers", link: "/providers" },
          { name: providerName },
        ]}
      />

      {/* Provider Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-6 px-4 sm:px-8">
          <div className="flex justify-between items-center">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/providers">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Providers
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite("provider", provider.id)}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite("provider", provider.id) ? "fill-current text-rose-500 hover:text-rose-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Content */}
      <div className="container py-8 px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Provider Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                  <Image
                    src={provider.photo || "/placeholder-avatar.jpg"}
                    alt={providerName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 160px"
                  />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {providerName}
                </h1>
                <div className="mt-2 flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 ${
                        rating <= Math.round(provider.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {provider.rating.toFixed(1)} ({provider.totalReviews || 0}{" "}
                    reviews)
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Contact Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Contact Information
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-700">{provider.email}</span>
                    </li>
                    {provider.phone && (
                      <li className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{provider.phone}</span>
                      </li>
                    )}
                    {(provider.address ||
                      provider.city ||
                      provider.country) && (
                      <li className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">
                          {provider.address && `${provider.address}, `}
                          {provider.city && `${provider.city}, `}
                          {provider.country}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Schedule */}
                <div className="pt-4">
                  <GetProviderSchedule providerId={params.id} />
                </div>

                {/* Location Map */}
                {hasLocationCoordinates ? (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Location
                    </h3>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <MapPreview
                        latitude={provider.latitude}
                        longitude={provider.longitude}
                        markerText={providerName}
                        location={{
                          address: provider.address,
                          city: provider.City,
                          country: provider.country,
                        }}
                        showDirection={true}
                      />
                    </div>
                    {/* <Button
                      variant="outline"
                      className="w-full mt-3 border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
                      asChild
                    >
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </a>
                    </Button> */}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <div className="prose max-w-none text-gray-700">
                {provider.description || (
                  <p className="text-gray-600">No description provided.</p>
                )}
              </div>
            </div>

            {/* Services/Products Tabs */}
            <div className="sm:bg-white sm:rounded-xl sm:shadow-sm sm:border overflow-hidden">
              <Tabs defaultValue="services">
                <div className="border-b">
                  <TabsList className="w-full flex justify-between sm:justify-start px-0 sm:px-6 h-fit py-0">
                    <TabsTrigger value="services" className="px-4 py-4">
                      <Scissors className="h-4 w-4 mr-2" />
                      Services
                    </TabsTrigger>
                    <TabsTrigger value="products" className="px-4 py-4">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Products
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="px-4 py-4">
                      <Star className="h-4 w-4 mr-2" />
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="services" className="p-0 py-4 sm:p-6">
                  <div className="grid gap-2 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
                    {provider.services?.length > 0 ? (
                      provider.services.map((service: any) => (
                        <ServiceCard key={service.id} service={service} />
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Scissors className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                          No services available
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This provider hasn't listed any services yet.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="products" className="p-0 py-4 sm:p-6">
                  <div className="grid gap-2 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
                    {provider.products?.length > 0 ? (
                      provider.products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                          No products available
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This provider hasn't listed any products yet.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-0 py-4 sm:p-6">
                  <div className="space-y-8">
                    {provider.reviews?.length > 0 ? (
                      provider.reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                              {review.customer.photo ? (
                                <Image
                                  src={review.customer.photo}
                                  alt={review.customer.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
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
                                <span className="ml-2 text-xs text-gray-500">
                                  {format(
                                    new Date(review.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Star className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                          No reviews yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Be the first to review this provider.
                        </p>
                        <Button className="mt-4 bg-hairsby-orange hover:bg-hairsby-orange/90">
                          Write a Review
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
