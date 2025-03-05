"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServiceCategories } from "@/lib/api/services";

export function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sortBy") || "";

  const { data: categories = [] } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: getServiceCategories,
  });

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/services?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/services");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={currentQuery}
              onChange={(e) => updateFilters({ query: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <Select
            value={currentCategory}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Price Range</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              min="0"
              value={currentMinPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Max"
              min="0"
              value={currentMaxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Sort By</label>
          <Select
            value={currentSort}
            onValueChange={(value) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
