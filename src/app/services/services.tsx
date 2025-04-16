"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

export default function ServicesComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [durationRange, setDurationRange] = useState<[number, number]>([
    0, 180,
  ]);
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortedServices, setSortedServices] = useState<any>([]);

  const { data: services, isLoading } = useQuery({
    queryKey: [
      "services",
      searchQuery,
      selectedCategory,
      priceRange,
      durationRange,
      sortBy,
    ],
    queryFn: () =>
      getServices({
        query: searchQuery,
        category: selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: getServiceCategories,
  });
  console.log(categories);
  useEffect(() => {
    if (!isLoading && services) {
      const serviceList = Array.isArray(services)
        ? services
        : services.services;

      if (serviceList && serviceList.length > 0) {
        const currentSortedServices = [...serviceList].sort((a, b) => {
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
        setSortedServices(currentSortedServices);
      }
    }
  }, [services, isLoading, sortBy, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-hairsby-dark to-hairsby-dark/90 text-white py-20">
        <div className="container px-4 sm:px-8  ">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Professional Beauty Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-gray-300"
            >
              Book premium services from top-rated beauty professionals
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container px-4 sm:px-8 ">
          {/* Mobile Filters */}
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
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <ServiceFilters
                categories={categories}
                onCategoryChange={setSelectedCategory}
                onPriceChange={setPriceRange}
                onDurationChange={setDurationRange}
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                durationRange={durationRange}
              />
            </aside>

            {/* Services Grid */}
            <div className="space-y-6">
              {/* Search and Sort */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
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

              {/* Services Grid */}
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
                      setSearchQuery("");
                      setSelectedCategory("");
                      setPriceRange([0, 500]);
                      setDurationRange([0, 180]);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2 sm:gap-6 grid-cols-2 lg:grid-cols-3">
                  {sortedServices.map((service: any, index: number) => (
                    <motion.div
                      key={service.id}
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
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Panel */}
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
                  {/* <ChevronDown className="h-5 w-5" /> */}
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="mt-6">
                <ServiceFilters
                  categories={categories}
                  onCategoryChange={setSelectedCategory}
                  onPriceChange={setPriceRange}
                  onDurationChange={setDurationRange}
                  selectedCategory={selectedCategory}
                  priceRange={priceRange}
                  durationRange={durationRange}
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
