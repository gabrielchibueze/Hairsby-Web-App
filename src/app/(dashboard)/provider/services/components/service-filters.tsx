"use client";

import { Service } from "@/lib/api/services/service";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface ServiceFiltersProps {
  services: Service[];
  onFilterChange: (filteredServices: Service[]) => void;
}

export function ServiceFilters({
  services,
  onFilterChange,
}: ServiceFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const filtered = services.filter((service) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service?.description &&
          service?.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && service.isAvailable) ||
        (statusFilter === "unavailable" && !service.isAvailable);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    onFilterChange(filtered);
  }, [services, searchTerm, categoryFilter, statusFilter, onFilterChange]);

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((service) => service.category))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="Search by name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category as string}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="unavailable">Unavailable</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
