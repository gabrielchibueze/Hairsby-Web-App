"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCard } from "@/components/provider/service-card";
import { getProviderServices } from "@/lib/api/accounts/provider";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["providerServices", searchQuery, categoryFilter],
    queryFn: () =>
      getProviderServices({ search: searchQuery, category: categoryFilter }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button asChild>
          <a href="/provider/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </a>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="hair">Hair</SelectItem>
            <SelectItem value="makeup">Makeup</SelectItem>
            <SelectItem value="nails">Nails</SelectItem>
            <SelectItem value="skincare">Skincare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: any, index: number) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
