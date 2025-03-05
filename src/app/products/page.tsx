"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Filter, Search, ShoppingCart, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { CartSheet } from "@/components/cart/cart-sheet";
import { searchProducts } from "@/lib/api/products";
import { useCart } from "@/components/cart/cart-provider";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { cart } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, sortBy],
    queryFn: () =>
      searchProducts({
        query: searchQuery,
        category: selectedCategory,
        sortBy,
      }),
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">
                Beauty Products
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Shop professional beauty products from top brands
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
            {/* Filters */}
            <aside>
              <ProductFilters
                onCategoryChange={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </aside>

            {/* Products */}
            <div className="space-y-6">
              {/* Search and Sort */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-muted rounded-lg" />
                      <div className="mt-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CartSheet />
    </main>
  );
}
