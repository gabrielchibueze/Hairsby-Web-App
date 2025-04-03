"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getAllProductCategories } from "@/lib/api/products/product";
import { useQuery } from "@tanstack/react-query";

export function ProductFilters({
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  selectedCategory,
  selectedBrand,
  priceRange,
  onClose,
}: {
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (range: [number, number]) => void;
  selectedCategory: string;
  selectedBrand: string;
  priceRange: [number, number];
  onClose?: () => void;
}) {
  const { data: categories = [] } = useQuery({
    queryKey: ["productCategories"],
    queryFn: getAllProductCategories,
  });

  const brands = [
    "L'Oréal Professionnel",
    "Wella Professionals",
    "Schwarzkopf",
    "Olaplex",
    "GHD",
    "Dyson",
    "MAC Cosmetics",
  ];

  const handlePriceChange = (value: number[]) => {
    onPriceChange([value[0], value[1]]);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Header */}
      {onClose && (
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="text-lg font-medium">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`block text-sm ${selectedCategory === "" ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
          >
            All Categories
          </button>
          {categories?.length > 0 &&
            categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`block text-sm ${selectedCategory === category.id ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
              >
                {category.name}
              </button>
            ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2">
          <button
            onClick={() => onBrandChange("")}
            className={`block text-sm ${selectedBrand === "" ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand)}
              className={`block text-sm ${selectedBrand === brand ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={() => {
          onCategoryChange("");
          onBrandChange("");
          onPriceChange([0, 1000]);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
