"use client";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FavoriteProduct,
  FavoriteProvider,
  FavoriteService,
} from "@/lib/api/accounts/favorite";
import { EmptySection, FavoriteSection } from "../favorite/favorite-components";

interface FavoriteItem {
  services: Array<FavoriteService>;
  products: Array<FavoriteProduct>;
  providers: Array<FavoriteProvider>;
}

export function RecentFavorites({ favorites }: { favorites: FavoriteItem }) {
  const hasFavorites =
    favorites?.services?.length > 0 ||
    favorites?.products?.length > 0 ||
    favorites?.providers?.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-background">
        {/* <CardHeader>
          <CardTitle className="text-foreground">Your Favorites</CardTitle>
          <CardDescription className="text-muted-foreground">
            Quick access to your saved items
          </CardDescription>
        </CardHeader> */}
        <CardContent className="grid grid-cols-3 gap-4 text-center pt-4">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Services
            </span>
            <span className="text-2xl font-bold text-foreground">
              {favorites?.services?.length || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Products
            </span>
            <span className="text-2xl font-bold text-foreground">
              {favorites?.products?.length || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Providers
            </span>
            <span className="text-2xl font-bold text-foreground">
              {favorites?.providers?.length || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          {/* <TabsTrigger value="all">
            All (
            {favorites.services.length +
              favorites.products.length +
              favorites.providers.length}
            )
          </TabsTrigger> */}
          <TabsTrigger value="services">
            Services ({favorites.services.length})
          </TabsTrigger>
          <TabsTrigger value="products">
            Products ({favorites.products.length})
          </TabsTrigger>
          <TabsTrigger value="providers">
            Providers ({favorites.providers.length})
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="all" className="mt-6">
          {hasFavorites ? (
            <div className="space-y-8">
              {favorites.services.length > 0 && (
                <FavoriteSection
                  title="Services"
                  items={favorites.services}
                  type="service"
                />
              )}
              {favorites.products.length > 0 && (
                <FavoriteSection
                  title="Products"
                  items={favorites.products}
                  type="product"
                />
              )}
              {favorites.providers.length > 0 && (
                <FavoriteSection
                  title="Providers"
                  items={favorites.providers}
                  type="provider"
                />
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                No favorites yet
              </h3>
              <p className="mt-2 text-muted-foreground">
                Save your favorite items to see them here
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Browse Services
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent> */}

        <TabsContent value="services" className="mt-6">
          {favorites.services.length > 0 ? (
            <FavoriteSection items={favorites.services} type="service" />
          ) : (
            <EmptySection type="services" />
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          {favorites.products.length > 0 ? (
            <FavoriteSection items={favorites.products} type="product" />
          ) : (
            <EmptySection type="products" />
          )}
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          {favorites.providers.length > 0 ? (
            <FavoriteSection items={favorites.providers} type="provider" />
          ) : (
            <EmptySection type="providers" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
