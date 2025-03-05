"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProductCategories } from "@/lib/api/products";

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["productCategories"],
    queryFn: getProductCategories,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="text-sm font-medium">Price Range</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input type="number" placeholder="Min" min="0" />
            <Input type="number" placeholder="Max" min="0" />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm font-medium">Categories</label>
          <div className="mt-2 space-y-2">
            <Button
              variant={selectedCategory === "" ? "secondary" : "outline"}
              className="w-full justify-start"
              onClick={() => onCategoryChange("")}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "secondary" : "outline"
                }
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onCategoryChange("")}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
