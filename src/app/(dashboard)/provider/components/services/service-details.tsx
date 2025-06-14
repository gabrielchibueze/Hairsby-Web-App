"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  Tag,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { Service } from "@/lib/api/services/service";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import formatDuration from "@/lib/utils/minute-to-hour";
import { formatCurrency } from "@/lib/utils";

interface ServiceDetailsProps {
  service: Service | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEditService?: () => void;
  embedded?: boolean;
}

export function ServiceDetails({
  service,
  open = true,
  onOpenChange,
  onEditService,
  embedded = false,
}: ServiceDetailsProps) {
  if (!service) return null;

  const Wrapper = embedded ? "div" : Dialog;
  const WrapperContent = embedded ? "div" : DialogContent;

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent
        className={embedded ? "" : "max-w-[350px] sm:mx-0 sm:max-w-[800px]"}
      >
        {!embedded && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{service.name}</span>
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
              {service.isPackage && (
                <Badge className="bg-hairsby-orange text-primary-foreground hover:bg-hairsby-orange/80">
                  Package
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
        )}
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Service Images */}
            {service.images && service.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {service.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-md overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${service.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Service Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-hairsby-orange" />
                Service Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="capitalize">{service.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {formatCurrency(Number(service.price).toFixed(2))}
                    {service.discountPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatCurrency(
                          Number(service.discountPrice).toFixed(2)
                        )}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDuration(service?.duration)}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="whitespace-pre-line">{service.description}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Availability & Policies */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-hairsby-orange" />
                Availability & Policies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {service.isAvailable ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <p>{service.isAvailable ? "Available" : "Unavailable"}</p>
                  </div>
                </div>
                {service?.requiresAdvancePayment && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Advance Payment
                      </p>
                      <p className="font-medium">
                        {service.advancePaymentType === "fixed"
                          ? `£${Number(service?.advancePaymentAmount)?.toFixed(2)}`
                          : `${service.advancePaymentAmount}%`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cancellation Policy
                      </p>
                      <p className="capitalize">{service.cancellationPolicy}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Package Services */}
            {service.isPackage && service.packageServices && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-hairsby-orange" />
                    Included Services
                  </h3>
                  <div className="pl-7">
                    <p className="text-sm text-muted-foreground">
                      This package includes the following services:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {service.packageServices.map((serviceId, index) => (
                        <li key={index} className="text-sm">
                          Service {index + 1} (ID: {serviceId})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          {!embedded && (
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Close
              </Button>
              {onEditService && (
                <Button variant="brand" onClick={onEditService}>
                  Edit Service
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </WrapperContent>
    </Wrapper>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
