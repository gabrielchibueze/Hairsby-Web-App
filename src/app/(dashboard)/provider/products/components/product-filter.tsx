"use client";

import { Product } from "@/lib/api/products/product";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

export function ProductFilters({
  products,
  onFilterChange,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Get unique categories from products
  const categories = Array.from(
    new Set(products?.map((p) => p.category.toLowerCase()))
  ).sort();

  useEffect(() => {
    const filtered = products?.filter((product) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === "all" ||
        product.category.toLowerCase() === categoryFilter;

      // Price range filter
      let matchesPrice = true;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-")?.map(Number);
        const price = product.discountPrice || product.price;
        matchesPrice = price >= min && (max ? price <= max : true);
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesPrice;
    });

    onFilterChange(filtered);
  }, [
    products,
    searchTerm,
    statusFilter,
    categoryFilter,
    priceRange,
    onFilterChange,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriceRange("all");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-3 sm:mt-0">
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:col-span-2"
      />

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-20">Under £20</SelectItem>
            <SelectItem value="20-50">£20 - £50</SelectItem>
            <SelectItem value="50-100">£50 - £100</SelectItem>
            <SelectItem value="100-">Over £100</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={resetFilters}
          className="px-2"
          title="Reset filters"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
