"use client";

import { Service } from "@/lib/api/services/service";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
            <Package className="h-10 w-10 text-muted-FOREGROUND/60" />
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
            <p className="text-sm text-muted-FOREGROUND line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground/100">Price</span>
            <span className="font-medium">
              £{Number(service.price).toFixed(2)}
              {service.discountPrice && (
                <span className="ml-2 text-sm text-muted-foreground/100 line-through">
                  £{Number(service.discountPrice).toFixed(2)}
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground/100">Duration</span>
            <span className="text-sm">
              {Math.floor(service.duration / 60)}h {service.duration % 60}m
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground/100">Category</span>
            <span className="text-sm capitalize">{service.category}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`/provider/services/${service.id}`}>
            <Button
              variant="outline"
              size="sm"
              // onClick={onViewDetails}
              className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
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
