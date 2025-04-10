"use client";

import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServices } from "@/lib/api/services/service";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Link from "next/link";

export function ServiceList() {
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["services", searchParams.toString()],
      initialPageParam: 1, // Add this required property
      queryFn: (
        { pageParam } // Simplify the parameter destructuring
      ) =>
        getServices({
          page: pageParam,
          query: searchParams.get("query") || undefined,
          category: searchParams.get("category") || undefined,
          minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined,
          maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
          limit: 8,
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (allPages.length < lastPage.totalPages) {
          return allPages.length + 1;
        }
        return undefined;
      },
    });
  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted" />
            <CardHeader>
              <div className="h-6 w-2/3 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const services = data?.pages.flatMap((page) => page.services) || [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{service.name}</span>
                  <span className="text-lg font-normal">£{service.price}</span>
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {service.duration} min
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={service.provider.photo}
                          alt={service.provider.businessName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="ml-2 text-sm">
                        {service.provider.businessName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm">{service.provider.rating}</span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({service.provider.totalReviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {service.provider.address}
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/services/${service.id}`}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <div ref={loadMoreRef} className="flex justify-center">
        {isFetchingNextPage ? (
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        ) : hasNextPage ? (
          <Button variant="outline" onClick={() => fetchNextPage()}>
            Load More
          </Button>
        ) : null}
      </div>
    </div>
  );
}
