"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
import { ServiceFilters } from "@/components/services/service-filters";
import { getServices, getServiceCategories } from "@/lib/api/services/service";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/services/service-card";
import { useInView } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ServicesComponent() {
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
      queryKey: ["services", searchParams.toString()],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getServices({
          page: pageParam,
          query: searchParams.get("query") || undefined,
          category: searchParams.get("category") || undefined,
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

  const { data: categories = [] } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: getServiceCategories,
  });

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const services =
    data?.pages.flatMap((page) =>
      Array.isArray(page.data) ? page.data : [page.data]
    ) || [];

  // Sort services based on sortBy parameter
  const sortedServices = [...services].sort((a, b) => {
    const sortBy = searchParams.get("sort") || "recommended";
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return (b.provider?.rating || 0) - (a.provider?.rating || 0);
      case "duration":
        return a.duration - b.duration;
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
              Professional Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-gray-300"
            >
              Book premium services from top-rated service professionals
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
              <ServiceFilters
                categories={categories}
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
                onPriceChange={(range) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("minPrice", range[0].toString());
                  params.set("maxPrice", range[1].toString());
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
                onDurationChange={(range) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("minDuration", range[0].toString());
                  params.set("maxDuration", range[1].toString());
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
                selectedCategory={searchParams.get("category") || ""}
                priceRange={[
                  searchParams.get("minPrice")
                    ? Number(searchParams.get("minPrice"))
                    : 0,
                  searchParams.get("maxPrice")
                    ? Number(searchParams.get("maxPrice"))
                    : 500,
                ]}
                durationRange={[
                  searchParams.get("minDuration")
                    ? Number(searchParams.get("minDuration"))
                    : 0,
                  searchParams.get("maxDuration")
                    ? Number(searchParams.get("maxDuration"))
                    : 180,
                ]}
              />
            </aside>

            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search services..."
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
                      <SelectItem value="duration">
                        Duration: Shortest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                  ))}
                </div>
              ) : sortedServices.length === 0 ? (
                <div className="py-12 text-center">
                  <h3 className="text-lg font-medium">No services found</h3>
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
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedServices.map((service: any, index: number) => (
                    <motion.div
                      key={`${service?.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <ServiceCard service={service} />
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
                ) : services.length > 0 ? (
                  <p className="text-muted-foreground">
                    No more services to load
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
                <ServiceFilters
                  categories={categories}
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
                  onPriceChange={(range) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minPrice", range[0].toString());
                    params.set("maxPrice", range[1].toString());
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                    setMobileFiltersOpen(false);
                  }}
                  onDurationChange={(range) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minDuration", range[0].toString());
                    params.set("maxDuration", range[1].toString());
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                    setMobileFiltersOpen(false);
                  }}
                  selectedCategory={searchParams.get("category") || ""}
                  priceRange={[
                    searchParams.get("minPrice")
                      ? Number(searchParams.get("minPrice"))
                      : 0,
                    searchParams.get("maxPrice")
                      ? Number(searchParams.get("maxPrice"))
                      : 500,
                  ]}
                  durationRange={[
                    searchParams.get("minDuration")
                      ? Number(searchParams.get("minDuration"))
                      : 0,
                    searchParams.get("maxDuration")
                      ? Number(searchParams.get("maxDuration"))
                      : 180,
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

function ServiceCardSkeleton() {
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
