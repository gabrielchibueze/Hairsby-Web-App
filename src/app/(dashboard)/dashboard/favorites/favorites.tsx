"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/components/favorite/favorite-provider";
import Image from "next/image";
import Link from "next/link";
import {
  getFavoriteServices,
  getFavoriteProducts,
  getFavoriteProviders,
} from "@/lib/api/accounts/favorite";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/breadcrumb";

export default function FavoriteComponent() {
  const {
    favorites,
    toggleFavorite,
    isLoading: contextLoading,
  } = useFavorite();

  // Fetch all favorites (though we could also use the context data directly)
  const {
    data: services = { favorites: [], pagination: { total: 0 } },
    isLoading: servicesLoading,
  } = useQuery({
    queryKey: ["favorites", "services"],
    queryFn: () => getFavoriteServices(1, 100),
  });

  const {
    data: products = { favorites: [], pagination: { total: 0 } },
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["favorites", "products"],
    queryFn: () => getFavoriteProducts(1, 100),
  });

  const {
    data: providers = { favorites: [], pagination: { total: 0 } },
    isLoading: providersLoading,
  } = useQuery({
    queryKey: ["favorites", "providers"],
    queryFn: () => getFavoriteProviders(1, 100),
  });

  const isLoading =
    servicesLoading || productsLoading || providersLoading || contextLoading;
  const totalFavorites =
    services.pagination.total +
    products.pagination.total +
    providers.pagination.total;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "My Favorites" },
        ]}
      />

      {/* Favorites Content */}
      <section className="py-12">
        <div className="container ">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
            {totalFavorites > 0 && (
              <Badge variant="outline" className="text-base">
                {totalFavorites} items
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="mt-8 space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalFavorites === 0 ? (
            <div className="mt-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Your favorites list is empty
              </h2>
              <p className="mt-2 text-gray-600">
                Start exploring to add items to your favorites
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
                  >
                    Browse Services
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {/* Favorite Services */}
              {services.favorites.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Favorite Services
                  </h2>
                  <ul className="divide-y divide-gray-200">
                    {services.favorites.map((favorite) => (
                      <motion.li
                        key={favorite.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-shrink-0 h-24 w-24 rounded-md bg-gray-100 overflow-hidden">
                            {/* Placeholder for service image */}
                            {/* <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"></div> */}
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              {favorite.service.images.length > 0 ? (
                                <Image
                                  src={favorite.service.images[0]}
                                  alt={favorite.service.name}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Heart className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {favorite.service.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {favorite.service.description.substring(
                                    0,
                                    60
                                  )}
                                  ...
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  toggleFavorite("service", favorite.service.id)
                                }
                                className="text-hairsby-orange hover:text-amber-600 ml-4"
                              >
                                <Heart className="h-6 w-6 fill-current" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-lg font-medium text-gray-900">
                                £{Number(favorite.service.price).toFixed(2)}
                              </span>
                              <Link href={`/services/${favorite.service.id}`}>
                                <Button variant="outline" size="sm">
                                  View Service
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Favorite Products */}
              {products.favorites.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Favorite Products
                  </h2>
                  <ul className="divide-y divide-gray-200">
                    {products.favorites.map((favorite) => (
                      <motion.li
                        key={favorite.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-shrink-0 h-24 w-24 rounded-md bg-gray-100 overflow-hidden">
                            {/* Placeholder for product image */}
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              {favorite.product.images.length > 0 ? (
                                <Image
                                  src={favorite.product.images[0]}
                                  alt={favorite.product.name}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Heart className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {favorite.product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {favorite.product.description.substring(
                                    0,
                                    60
                                  )}
                                  ...
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  toggleFavorite("product", favorite.product.id)
                                }
                                className="text-hairsby-orange hover:text-amber-600 ml-4"
                              >
                                <Heart className="h-6 w-6 fill-current" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-lg font-medium text-gray-900">
                                £{Number(favorite.product.price).toFixed(2)}
                              </span>
                              <Link href={`/products/${favorite.product.id}`}>
                                <Button variant="outline" size="sm">
                                  View Product
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Favorite Providers */}
              {providers.favorites.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Favorite Providers
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {providers.favorites.map((favorite) => (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-40 bg-gray-100">
                          {favorite.provider.photo ? (
                            <Image
                              src={favorite.provider.photo}
                              alt={
                                favorite.provider.businessName ||
                                `${favorite.provider.firstName} ${favorite.provider.lastName}`
                              }
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <Heart className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <button
                            onClick={() =>
                              toggleFavorite("provider", favorite.provider.id)
                            }
                            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-hairsby-orange hover:text-amber-600"
                          >
                            <Heart className="h-5 w-5 fill-current" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg">
                            {favorite.provider.businessName ||
                              `${favorite.provider.firstName} ${favorite.provider.lastName}`}
                          </h3>
                          {favorite.provider.rating && (
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i <
                                    Math.floor(favorite.provider.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-sm text-gray-500">
                                ({Number(favorite.provider.rating)?.toFixed(1)})
                              </span>
                            </div>
                          )}
                          <Link href={`/providers/${favorite.provider.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 w-full"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}
