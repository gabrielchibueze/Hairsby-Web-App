"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getServices,
  getServiceCategories,
  Service,
} from "@/lib/api/services/service";
import {
  getProducts,
  getAllProductCategories,
  Product,
} from "@/lib/api/products/product";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  slug: string;
  name: string;
}

export default function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    services: Service[];
    products: Product[];
  }>({
    services: [],
    products: [],
  });
  const [categoriesSearchResults, setCategoriesSearchResults] = useState<{
    categories: Category[];
  }>({
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const router = useRouter();
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedCategory("all");
      fetchAllCategoriesResults();
      setIsFirstLoad(true);
    } else {
      setSearchResults({ services: [], products: [] });
    }
  }, [open]);

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (!open) return;

    if (debouncedQuery.length > 0 || !isFirstLoad) {
      fetchSearchResults();
      setIsFirstLoad(false);
    } else {
      setSearchResults({ services: [], products: [] });
    }
  }, [debouncedQuery, selectedCategory, open]);

  const fetchAllCategoriesResults = async () => {
    setIsLoading(true);
    try {
      const [serviceCategories, productCategories] = await Promise.all([
        getServiceCategories(),
        getAllProductCategories(),
      ]);

      setCategoriesSearchResults({
        categories: [
          ...(serviceCategories || []),
          ...(productCategories || []),
        ],
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const [services, products] = await Promise.all([
        getServices({
          query: debouncedQuery,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          page: 1,
          limit: 5,
        }),
        getProducts({
          query: debouncedQuery,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          page: 1,
          limit: 5,
        }),
      ]);

      setSearchResults({
        services: services?.data || [],
        products: products?.data || [],
      });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ services: [], products: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`
      );
      onOpenChange(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?query=${encodeURIComponent(query)}`);
    onOpenChange(false);
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        <span className="text-xs ml-1">
          {rating ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-[90vw]  sm:max-w-[800px] h-[95vh] gap-2 p-2">
        {/* Header */}
        <DialogHeader className="sticky top-0 bg-background z-10 p-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Search Hairsby
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-accent"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Search form */}
        <form onSubmit={handleSearch} className="px-4 pt-2 pb-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for salons, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base focus:border-border active:border-border"
              autoFocus
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </form>

        {/* Category filter */}
        <div className="px-4 pb-2">
          <ScrollArea orientation="horizontal">
            <div className="flex gap-2 pb-2 max-[450px]:w-[350px] min-[451px]:w-[400px] max-[700px]:w-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-hairsby-orange text-white"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                All
              </button>
              {categoriesSearchResults.categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap shrink-0 ${
                    selectedCategory === category.slug
                      ? "bg-hairsby-orange text-white"
                      : "bg-accent hover:bg-accent/80"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        {/* Quick search suggestions */}
        {!searchQuery && (
          <div className="px-4 pb-2">
            <h3 className="text-sm font-medium mb-2">Popular Searches</h3>
            <ScrollArea orientation="horizontal">
              <div className="flex gap-2 pb-2 max-[450px]:w-[350px] min-[451px]:w-[400px] max-[700px]:w-auto">
                {["Haircut", "Manicure", "Hair Color", "Facial"].map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSearch(item)}
                    className="text-xs"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Search results */}
        <ScrollArea className="flex flex-col gap-4 px-4 pb-4 h-[60vh] ">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 p-2">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-[77vw] sm:w-full">
              {searchResults.services.length > 0 && (
                <div className="mb-6 w-full">
                  <h3 className="text-sm font-medium mb-2">Services</h3>
                  <div className="space-y-2 w-full">
                    {searchResults.services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="block p-2 hover:bg-accent rounded-md transition-colors duration-200 border w-full"
                        onClick={() => onOpenChange(false)}
                      >
                        <div className="flex gap-2 sm:gap-4 w-full">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 relative shrink-0">
                            <Image
                              src={
                                service.images?.[0] ||
                                "/placeholder-service.jpg"
                              }
                              alt={service.name}
                              fill
                              className="object-cover rounded-md"
                              sizes="(max-width: 640px) 48px, 64px"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex flex-row justify-between items-center gap-2">
                              <h4 className="font-medium truncate text-xs sm:text-sm">
                                {service.name}
                              </h4>
                              <div className="flex gap-1 text-xs whitespace-nowrap">
                                <span>£{service.price}</span>
                                {service.discountPrice && (
                                  <span className="text-muted-foreground line-through">
                                    £{service.discountPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {service.category}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              {renderRatingStars(service.averageRating || 0)}
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {service.duration} mins
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.products.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Products</h3>
                  <div className="space-y-2">
                    {searchResults.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="block p-2 hover:bg-accent rounded-md transition-colors duration-200 border"
                        onClick={() => onOpenChange(false)}
                      >
                        <div className="flex gap-2 sm:gap-4 w-full">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 relative shrink-0">
                            <Image
                              src={
                                product.images?.[0] ||
                                "/placeholder-product.jpg"
                              }
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                              sizes="(max-width: 640px) 48px, 64px"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex flex-row justify-between items-center gap-2">
                              <h4 className="font-medium truncate text-xs sm:text-sm">
                                {product.name}
                              </h4>
                              <div className="flex gap-1 text-xs whitespace-nowrap">
                                <span>£{product.price}</span>
                                {product.discountPrice && (
                                  <span className="text-muted-foreground line-through">
                                    £{product.discountPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {product.category}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              {renderRatingStars(product.averageRating || 0)}
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {product.brand}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery &&
                !isLoading &&
                searchResults.services.length === 0 &&
                searchResults.products.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
