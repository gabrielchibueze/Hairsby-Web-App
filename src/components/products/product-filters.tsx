"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProductCategories,
  getProductBrands,
} from "@/lib/api/products/product";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter } from "next/navigation";

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

  const { data: brandsData } = useQuery({
    queryKey: ["productBrands"],
    queryFn: () => getProductBrands({ limit: 100 }), // Adjust limit as needed
  });

  const debouncedPriceChange = useDebouncedCallback(
    (value: number[]) => onPriceChange([value[0], value[1]]),
    500
  );
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
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
                onClick={() => onCategoryChange(category.slug)}
                className={`block text-sm ${selectedCategory === category.slug ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
              >
                {category.name}
                {category?.productCount && (
                  <span>({category.productCount})</span>
                )}
              </button>
            ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2">
          <button
            onClick={() => onBrandChange("")}
            className={`block text-sm ${selectedBrand === "" ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
          >
            All Brands
          </button>
          {brandsData?.brands.map((brand) => (
            <button
              key={brand.slug}
              onClick={() => onBrandChange(brand.slug)}
              className={`block text-sm ${selectedBrand === brand.slug ? "font-medium text-hairsby-orange" : "text-gray-600"}`}
            >
              {brand.name}
              {brand.productCount > 0 && (
                <span className="ml-1">({brand.productCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={1000}
            step={10}
            defaultValue={priceRange}
            onValueCommit={debouncedPriceChange}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={() => {
          onCategoryChange("");
          onBrandChange("");
          onPriceChange([0, 1000]);
          router.replace(pathname);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
