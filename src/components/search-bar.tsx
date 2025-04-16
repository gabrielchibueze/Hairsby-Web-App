"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
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
import { getServices, getServiceCategories } from "@/lib/api/services/service";
import {
  getProducts,
  getAllProductCategories,
} from "@/lib/api/products/product";
import { DialogOverlay } from "@radix-ui/react-dialog";

interface Service {
  id: string;
  name: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
}

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
  const router = useRouter();
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchAllCategoriesResults();
    if (debouncedQuery.length > 0 && open) {
      fetchSearchResults();
    } else {
      setSearchResults((prev) => ({ ...prev, services: [], products: [] }));
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
        services: services?.services || [],
        products: products || [],
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/services?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`
      );
      onOpenChange(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/services?q=${encodeURIComponent(query)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog content with proper responsive sizing */}
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[32rem] min-h-[80vh] rounded-lg bg-white shadow-xl overflow-hidden border-0 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="sticky top-0 bg-white z-10 p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Search Hairsby
              </DialogTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>

          {/* Search form */}
          <form onSubmit={handleSearch} className="p-4 pb-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for salons, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base"
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Category filter */}
          {/* <div className="px-4 pb-2 overflow-x-auto">
            <div className="flex space-x-2 min-w-max"> */}

          <div className="px-4 pb-2 overflow-x-auto">
            {/* <div className="flex space-x-2" style={{ minWidth: "max-content" }}> */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-hairsby-orange text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoriesSearchResults.categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category.slug
                      ? "bg-hairsby-orange text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick search suggestions */}
          {!searchQuery && (
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
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
            </div>
          )}

          {/* Search results */}
          <ScrollArea className="flex-1 px-4 pb-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hairsby-orange"></div>
              </div>
            ) : (
              <>
                {searchResults.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Services</h3>
                    <div className="space-y-2">
                      {searchResults.services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border"
                          onClick={() => onOpenChange(false)}
                        >
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            {service.category}
                          </p>
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
                          className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border"
                          onClick={() => onOpenChange(false)}
                        >
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.brand}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery &&
                  !isLoading &&
                  searchResults.services.length === 0 &&
                  searchResults.products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
              </>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
