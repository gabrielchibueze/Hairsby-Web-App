"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Filter, Search, Star, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { getProducts } from "@/lib/api/products/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ProductsComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products", searchParams.toString()],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getProducts({
          page: pageParam,
          query: searchParams.get("query") || undefined,
          category: searchParams.get("category") || undefined,
          brand: searchParams.get("brand") || undefined,
          minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined,
          maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
          limit: 12,
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (allPages.length < lastPage.pagination?.totalPages) {
          return allPages.length + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products =
    data?.pages.flatMap((page) =>
      Array.isArray(page.data) ? page.data : [page.data]
    ) || [];

  // Sort services based on sortBy parameter
  const sortedProducts = [...products].sort((a, b) => {
    const sortBy = searchParams.get("sort") || "recommended";
    switch (sortBy) {
      case "price_low":
        return (
          Number(a.discountPrice || a.price) -
          Number(b.discountPrice || b.price)
        );
      case "price_high":
        return (
          Number(b.discountPrice || b.price) -
          Number(a.discountPrice || a.price)
        );
      case "rating":
        return (
          (Number(b?.averageRating) || 0) - (Number(a?.averageRating) || 0)
        );
      case "newest":
        // Handle potential undefined createdAt values
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // For newest first
      default:
        return 0;
    }
  });
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-hairsby-dark to-hairsby-dark/90 text-white py-20">
        <div className="container px-4 sm:px-8">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Professional Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-gray-300"
            >
              Premium products trusted by service professionals worldwide
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-8">
          <div className="lg:hidden mb-6">
            <Button
              onClick={() => setMobileFiltersOpen(true)}
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span>Filters</span>
              <Filter className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
            <aside className="hidden lg:block">
              <ProductFilters
                onCategoryChange={(category) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (category) {
                    params.set("category", category);
                  } else {
                    params.delete("category");
                  }
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
                onBrandChange={(brand) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (brand) {
                    params.set("brand", brand);
                  } else {
                    params.delete("brand");
                  }
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
                onPriceChange={(range) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("minPrice", range[0].toString());
                  params.set("maxPrice", range[1].toString());
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
                selectedCategory={searchParams.get("category") || ""}
                selectedBrand={searchParams.get("brand") || ""}
                priceRange={[
                  searchParams.get("minPrice")
                    ? Number(searchParams.get("minPrice"))
                    : 0,
                  searchParams.get("maxPrice")
                    ? Number(searchParams.get("maxPrice"))
                    : 1000,
                ]}
              />
            </aside>

            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      debouncedSearch(e.target.value);
                    }}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select
                    value={searchParams.get("sort") || "recommended"}
                    onValueChange={(value) => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("sort", value);
                      router.replace(`${pathname}?${params.toString()}`);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Recommended" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price_low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {[...Array(8)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="mt-2 text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      router.replace(pathname);
                      setSearchQuery("");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {sortedProducts.map((product: any, index: number) => (
                    <motion.div
                      key={`${product?.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}

              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                ) : hasNextPage ? (
                  <Button variant="outline" onClick={() => fetchNextPage()}>
                    Load More
                  </Button>
                ) : products.length > 0 ? (
                  <p className="text-muted-foreground">
                    No more products to load
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="mt-6">
                <ProductFilters
                  onCategoryChange={(category) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (category) {
                      params.set("category", category);
                    } else {
                      params.delete("category");
                    }
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                    setMobileFiltersOpen(false);
                  }}
                  onBrandChange={(brand) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (brand) {
                      params.set("brand", brand);
                    } else {
                      params.delete("brand");
                    }
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                    setMobileFiltersOpen(false);
                  }}
                  onPriceChange={(range) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minPrice", range[0].toString());
                    params.set("maxPrice", range[1].toString());
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                    setMobileFiltersOpen(false);
                  }}
                  selectedCategory={searchParams.get("category") || ""}
                  selectedBrand={searchParams.get("brand") || ""}
                  priceRange={[
                    searchParams.get("minPrice")
                      ? Number(searchParams.get("minPrice"))
                      : 0,
                    searchParams.get("maxPrice")
                      ? Number(searchParams.get("maxPrice"))
                      : 1000,
                  ]}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
