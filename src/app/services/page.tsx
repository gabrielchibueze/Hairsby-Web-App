// "use client"

import { Suspense, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServiceList } from "@/components/services/service-list";
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceCategories } from "@/components/services/service-categories";

export const metadata: Metadata = {
  title: "Beauty Services | Hairsby",
  description: "Browse and book professional beauty services in your area",
};

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Beauty Services
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover and book professional beauty services in your area
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b py-12">
        <div className="container">
          <Suspense fallback={<div>Loading categories...</div>}>
            <ServiceCategories />
          </Suspense>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
            {/* Filters */}
            <aside>
              <Suspense fallback={<div>Loading filters...</div>}>
                <ServiceFilters />
              </Suspense>
            </aside>

            {/* Service List */}
            <div>
              <Suspense fallback={<div>Loading services...</div>}>
                <ServiceList />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
