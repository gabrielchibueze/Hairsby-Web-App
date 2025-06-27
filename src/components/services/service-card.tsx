import { Clock, Heart, MapPin, Star, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Service } from "@/lib/api/services/service";
import { useFavorite } from "../favorite/favorite-provider";
import Link from "next/link";
import formatDuration from "@/lib/utils/minute-to-hour";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const { toggleFavorite, isFavorite } = useFavorite();

  const hasDiscount =
    service.discountPrice && service.discountPrice < service.price;

  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Service image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.images[0] || "/placeholder-service.jpg"}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-hairsby-orange text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(
              ((service.price - (service?.discountPrice || 0)) /
                service.price) *
                100
            )}
            % OFF
          </div>
        )}
        <button
          onClick={() => toggleFavorite("service", service.id)}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 500 transition-colors text-gray-400 hover:text-gray-500`}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite("service", service.id) ? "fill-current text-rose-500 hover:text-rose-500" : ""}`}
          />
        </button>
      </div>

      {/* Service details */}
      <div className="p-5">
        {/* Provider info */}
        <div className="flex items-center gap-3">
          {service.provider?.photo && (
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={service.provider.photo}
                alt={
                  service.provider.businessName ||
                  service.provider?.firstName ||
                  "Provider"
                }
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <h4 className="truncate text-sm font-medium text-gray-600">
              {service.provider?.businessName ||
                service.provider?.firstName ||
                "Professional"}
            </h4>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-500">
                {service.provider?.rating?.toFixed(1) || "0.0"}
                {service.provider?.totalReviews && (
                  <span className="text-gray-400">
                    {" "}
                    ({service.provider.totalReviews})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Service title and description */}
        <Link href={`/services/${service.id}`}>
          <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-2">
            {service.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {service.description}
        </p>

        {/* Service meta */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(service?.duration)}</span>
            {service.provider?.city && (
              <>
                <span className="text-gray-300">•</span>
                <MapPin className="h-4 w-4" />
                <span>{service.provider.city}</span>
              </>
            )}
          </div>

          {/* Quick book button */}
          <button className="rounded-full bg-hairsby-orange/10 p-2 text-hairsby-orange transition-all hover:bg-hairsby-orange/20">
            <Zap className="h-4 w-4" />
          </button>
        </div>

        {/* Price and action */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(service?.discountPrice, service?.currency!)}
                </span>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatCurrency(service.price, service?.currency!)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(service.price, service?.currency!)}
              </span>
            )}
          </div>
          <Button size="sm" variant="brand" asChild>
            <a href={`/services/${service.id}`}>Book Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
