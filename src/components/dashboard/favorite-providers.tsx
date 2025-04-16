"use client";

import { motion } from "framer-motion";
import { Heart, Star, Scissors, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FavoriteProduct,
  FavoriteProvider,
  FavoriteService,
} from "@/lib/api/accounts/favorite";

interface FavoriteItem {
  services: Array<FavoriteService>;
  products: Array<FavoriteProduct>;
  providers: Array<FavoriteProvider>;
}

export function FavoriteProviders({ favorites }: { favorites: FavoriteItem }) {
  const hasFavorites =
    favorites?.services?.length > 0 ||
    favorites?.products?.length > 0 ||
    favorites?.providers?.length > 0;

  return (
    <div className="space-y-6">
      {/* Favorites Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Favorites</CardTitle>
          <CardDescription>Quick access to saved items</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-rose-50 p-3 rounded-full mb-2">
              <Heart className="h-5 w-5 text-rose-600" />
            </div>
            <span className="text-sm font-medium">Services</span>
            <span className="text-2xl font-bold">
              {favorites?.services?.length || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-amber-50 p-3 rounded-full mb-2">
              <ShoppingBag className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium">Products</span>
            <span className="text-2xl font-bold">
              {favorites?.products?.length || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-50 p-3 rounded-full mb-2">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium">Providers</span>
            <span className="text-2xl font-bold">
              {favorites?.providers?.length || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Services */}
      {favorites?.services?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {favorites.services.slice(0, 3).map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="relative h-32 bg-gray-100">
                  {fav.service?.images?.[0] ? (
                    <Image
                      src={fav.service?.images[0] || "/image-placeholder.png"}
                      alt={fav.service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Scissors className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{fav.service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {fav.service.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-medium">
                      £{fav.service.price.toFixed(2)}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/services/${fav.service.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Products */}
      {favorites?.products?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {favorites.products.slice(0, 3).map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="relative h-32 bg-gray-100">
                  {fav.product.images?.[0] ? (
                    <Image
                      src={fav.product.images[0]}
                      alt={fav.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{fav.product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {fav.product.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-medium">
                      £{fav.product.price.toFixed(2)}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/products/${fav.product.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Providers */}
      {favorites?.providers?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Providers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {favorites.providers.slice(0, 3).map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="relative h-32 bg-gray-100">
                  {fav.provider.photo ? (
                    <Image
                      src={fav.provider.photo}
                      alt={
                        fav.provider.businessName ||
                        `${fav.provider.firstName} ${fav.provider.lastName}`
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">
                    {fav.provider.businessName ||
                      `${fav.provider.firstName} ${fav.provider.lastName}`}
                  </h3>
                  {fav.provider.rating && (
                    <div className="flex items-center mt-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm">
                        {fav.provider.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/providers/${fav.provider.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {hasFavorites && (
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/favorites">View all favorites</Link>
          </Button>
        </div>
      )}

      {!hasFavorites && (
        <div className="py-8 text-center">
          <Heart className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No favorites yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Save your favorite items to see them here
          </p>
          <div className="mt-6 space-x-2">
            {/* <Button variant="outline" asChild>
              <Link href="/services">Book Services</Link>
            </Button>
            <Button asChild>
              <Link href="/products">Shop Products</Link>
            </Button> */}

            <Link href="/services">
              <Button
                variant="outline"
                className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
              >
                Book Services
              </Button>
            </Link>
            <Link href="/products">
              <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
                Shop Products
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
