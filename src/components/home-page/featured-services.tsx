"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Clock, MapPin, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFeaturedServices,
  getServices,
  Service,
} from "@/lib/api/services/service";
import { cn } from "@/lib/utils";
import { ServiceCard } from "../services/service-card";

export function FeaturedServices() {
  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredServices"],
    queryFn: () => getServices({ limit: 6 }),
  });

  if (error) {
    return;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">Premium</span> Professional Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our most sought-after service treatments
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services?.data
              .slice(0, 4)
              .map((service: Service, index: number) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="lg" variant="brand" asChild>
            <a href="/services">Explore All Services</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Skeleton className="h-48 w-full" />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
