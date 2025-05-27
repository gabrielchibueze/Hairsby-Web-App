"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, X, ChevronRight, Star, ShoppingCart } from "lucide-react";
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
import Breadcrumb from "@/components/general/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "../cart/cart-provider";

export default function FavoriteComponent() {
  const {
    favorites,
    toggleFavorite,
    isLoading: contextLoading,
  } = useFavorite();
  const { addToCart } = useCart();
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
      <section className="">
        <div className="mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My Favorites
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your saved items and providers
              </p>
            </div>
            {totalFavorites > 0 && (
              <Badge variant="outline" className="text-sm sm:text-base">
                {totalFavorites} saved items
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : totalFavorites === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
              <h2 className="text-xl font-medium text-foreground">
                Your favorites list is empty
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Save your favorite services, products, and providers to see them
                here
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
                <Link href="/services" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    Browse Services
                  </Button>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All ({totalFavorites})</TabsTrigger>
                <TabsTrigger value="services">
                  Services ({services.pagination.total})
                </TabsTrigger>
                <TabsTrigger value="products">
                  Products ({products.pagination.total})
                </TabsTrigger>
                <TabsTrigger value="providers">
                  Providers ({providers.pagination.total})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="space-y-8">
                  {services.favorites.length > 0 && (
                    <FavoriteSection
                      title="Services"
                      items={services.favorites}
                      type="service"
                      onToggle={toggleFavorite}
                    />
                  )}
                  {products.favorites.length > 0 && (
                    <FavoriteSection
                      title="Products"
                      items={products.favorites}
                      type="product"
                      onToggle={toggleFavorite}
                    />
                  )}
                  {providers.favorites.length > 0 && (
                    <FavoriteSection
                      title="Providers"
                      items={providers.favorites}
                      type="provider"
                      onToggle={toggleFavorite}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                {services.favorites.length > 0 ? (
                  <FavoriteSection
                    items={services.favorites}
                    type="service"
                    onToggle={toggleFavorite}
                  />
                ) : (
                  <EmptySection type="services" />
                )}
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                {products.favorites.length > 0 ? (
                  <FavoriteSection
                    items={products.favorites}
                    type="product"
                    onToggle={toggleFavorite}
                  />
                ) : (
                  <EmptySection type="products" />
                )}
              </TabsContent>

              <TabsContent value="providers" className="mt-6">
                {providers.favorites.length > 0 ? (
                  <FavoriteSection
                    items={providers.favorites}
                    type="provider"
                    onToggle={toggleFavorite}
                  />
                ) : (
                  <EmptySection type="providers" />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}

export function FavoriteSection({ title, items, type, onToggle }: any) {
  const isProvider = type === "provider";
  const gridClass = isProvider
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    : "space-y-4";

  return (
    <div>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div className={gridClass}>
        {items.map((item: any) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={isProvider ? "" : "border rounded-lg p-4"}
          >
            {isProvider ? (
              <ProviderCard item={item} onToggle={onToggle} />
            ) : (
              <ProductServiceCard item={item} type={type} onToggle={onToggle} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProductServiceCard({ item, type, onToggle }: any) {
  const { addToCart } = useCart();
  const { toggleFavorite } = useFavorite();

  const data = type === "service" ? item.service : item.product;
  const link =
    type === "service" ? `/services/${data.id}` : `/products/${data.id}`;
  console.log(type);
  console.log(data.id);
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative h-32 w-full sm:w-32 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        {data.images?.length > 0 ? (
          <Image
            src={data.images[0]}
            alt={data.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-muted-foreground/60" />
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-foreground line-clamp-1">
              {data.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {data.description}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(type, data?.id)}
            className="text-[red] hover:text-[red]/80 ml-2"
          >
            <Heart className="h-5 w-5 fill-current" />
          </button>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-medium text-foreground">
            £{Number(data.price).toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={link}>
                <span className="hidden sm:block sm:mr-1">View</span> Details
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() =>
                data.id &&
                addToCart({ type: type, serviceId: data.id, quantity: 1 })
              }
            >
              <ShoppingCart className="h-4 w-4 mr-2 hidden sm:block" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProviderCard({ item, onToggle }: any) {
  const { toggleFavorite } = useFavorite();
  const provider = item.provider;
  const displayName =
    provider.businessName || `${provider.firstName} ${provider.lastName}`;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative h-40 bg-muted">
        {provider.photo ? (
          <Image
            src={provider.photo}
            alt={displayName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground/60" />
          </div>
        )}
        <button
          onClick={() => toggleFavorite("provider", provider?.id)}
          className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full text-primary hover:text-primary/80"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-foreground line-clamp-1">
          {displayName}
        </h3>
        {provider.rating && (
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(provider.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40"
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">
              ({Number(provider.rating)?.toFixed(1)})
            </span>
          </div>
        )}
        <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
          <a href={`/providers/${provider?.id}`}>View Profile</a>
        </Button>
      </div>
    </div>
  );
}

export function EmptySection({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Heart className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-medium text-foreground">
        No favorite {type} yet
      </h3>
      <p className="mt-2 text-muted-foreground max-w-md">
        You haven't saved any {type} to your favorites
      </p>
      <Button variant="brand" className="mt-6">
        <a href={`/${type}`}>Browse {type}</a>
      </Button>
    </div>
  );
}
