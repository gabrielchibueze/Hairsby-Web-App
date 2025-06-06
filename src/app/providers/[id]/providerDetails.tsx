"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Star,
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Phone,
  Mail,
  Scissors,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { userGetProviderById } from "@/lib/api/accounts/provider";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { ServiceCard } from "@/components/services/service-card";
import Breadcrumb from "@/components/general/breadcrumb";
import { useFavorite } from "@/components/favorite/favorite-provider";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { GetProviderSchedule } from "./provider-schedule";
import ReviewRatings from "@/components/reviews/review-rating";
import { AddReviewForm } from "@/components/reviews/add-review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { useAuth } from "@/lib/contexts/auth.context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MapPreview = dynamic(() => import("@/lib/utils/map"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
});

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
  const { user } = useAuth();
  const [hasLocationCoordinates, setHasLocationCoordinates] = useState<
    boolean | false
  >(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("services");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;
  const source = searchParams.get("s") as string;

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("services");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };

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
        <div className="container py-6">
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
      <div className="container py-8">
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
                <ReviewRatings
                  rating={provider.rating}
                  reviews={provider.totalReviews}
                />
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
                  <GetProviderSchedule
                    providerId={params.id}
                    schedule={provider.schedule}
                  />
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
            <div className="bg-background sm:rounded-xl sm:shadow-sm sm:border overflow-hidden container space-y-4 py-4">
              <Tabs defaultValue={activeTab} onValueChange={setPathActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="services">
                    <Scissors className="h-4 w-4 mr-2" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    <Star className="h-4 w-4 mr-2" />
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="services">
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

                <TabsContent value="products">
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

                <TabsContent value="reviews">
                  <div className="flex gap-8 flex-col">
                    {user?.id !== provider?.id && (
                      <AddReviewForm
                        id={provider?.id}
                        authenticated={user?.id ? true : false}
                        type="provider"
                      />
                    )}

                    {/* Reviews List */}
                    <ReviewList id={provider?.id} type="provider" />
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
