"use client";

import { Service } from "@/lib/api/services/service";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import formatDuration from "@/lib/utils/minute-to-hour";

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onViewDetails: () => void;
}

export function ServiceCard({
  service,
  onEdit,
  onViewDetails,
}: ServiceCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card">
      <div className="relative aspect-video w-full">
        {service.images?.[0] ? (
          <Image
            src={service.images[0]}
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-muted w-full h-full flex items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={service.isAvailable ? "default" : "destructive"}
            className={cn(
              service.isAvailable
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            )}
          >
            {service.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {service.isPackage && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-hairsby-orange text-primary-foreground hover:bg-hairsby-orange/80">
              Package
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{service.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-medium">
              {formatCurrency(
                Number(service.price).toFixed(2),
                service?.currency!
              )}
              {service.discountPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {formatCurrency(
                    Number(service.discountPrice).toFixed(2),
                    service?.currency!
                  )}
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="text-sm">{formatDuration(service?.duration)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Category</span>
            <span className="text-sm capitalize">{service.category}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`/provider/services/${service.id}`}>
            <Button
              variant="brandline"
              size="sm"
              // onClick={onViewDetails}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </Link>
          <Link href={`/provider/services/${service.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              // onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
