"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function ServiceFilters({
  categories,
  onCategoryChange,
  onPriceChange,
  onDurationChange,
  selectedCategory,
  priceRange,
  durationRange,
  onClose,
}: {
  categories: any[];
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onDurationChange: (range: [number, number]) => void;
  selectedCategory: string;
  priceRange: [number, number];
  durationRange: [number, number];
  onClose?: () => void;
}) {
  const handlePriceChange = (value: number[]) => {
    onPriceChange([value[0], value[1]]);
  };

  const handleDurationChange = (value: number[]) => {
    onDurationChange([value[0], value[1]]);
  };
  console.log(categories);
  return (
    <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
      {/* Mobile Header */}
      {/* {onClose && (
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="text-lg font-medium">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )} */}

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
            categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => onCategoryChange(category.slug)}
                className={`block text-sm ${selectedCategory === category.slug ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
              >
                {category.name}
                {category?.serviceCount && (
                  <span>({category.serviceCount})</span>
                )}{" "}
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
            max={500}
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

      {/* Duration Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Duration (mins)
        </h4>
        <div className="px-2">
          <Slider
            min={0}
            max={180}
            step={15}
            value={durationRange}
            onValueChange={handleDurationChange}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{durationRange[0]} min</span>
            <span>{durationRange[1]} min</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={() => {
          onCategoryChange("");
          onPriceChange([0, 500]);
          onDurationChange([0, 180]);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
