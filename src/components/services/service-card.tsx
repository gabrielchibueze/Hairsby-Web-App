"use client";

import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function ServiceCard({ service }: { service: any }) {
  const hasDiscount =
    service.discountPrice && service.discountPrice < service.price;
  const providerRating = service.provider?.rating || 0;
  const providerReviewCount = service.provider?.totalReviews || 0;

  return (
    <Link href={`/services/${service.id}`} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 group-hover:shadow-md"
      >
        {/* Service Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={service.images[0] || "/placeholder-service.jpg"}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-hairsby-orange text-white text-xs font-bold px-2 py-1 rounded-full">
              {Math.round(
                ((service.price - service.discountPrice) / service.price) * 100
              )}
              % OFF
            </div>
          )}
          <button className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-rose-500 transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Service Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                {service.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{service.category}</p>
            </div>
          </div>

          {/* Provider Info */}
          <div className="mt-2 flex items-center gap-2">
            {service.provider?.photo && (
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <Image
                  src={service.provider.photo}
                  alt={service.provider.businessName || "Provider"}
                  width={24}
                  height={24}
                  className="object-cover h-full w-full"
                />
              </div>
            )}
            <span className="text-xs text-gray-600">
              {service.provider?.businessName || "Professional"}
            </span>
          </div>

          {/* Rating */}
          <div className="mt-2 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-3 w-3 ${
                    rating <= providerRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">
              ({providerReviewCount})
            </span>
          </div>

          {/* Price and Duration */}
          <div className="mt-2 flex justify-between items-center">
            <div>
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    £{Number(service.discountPrice).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    £{Number(service.price).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-gray-900">
                  £{Number(service.price).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600">
              {service.duration} mins
            </span>
          </div>

          {/* Book Now Button */}
          <Button
            size="sm"
            className="w-full mt-3 bg-hairsby-orange/90 hover:bg-amber-500"
          >
            Book Now
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}
