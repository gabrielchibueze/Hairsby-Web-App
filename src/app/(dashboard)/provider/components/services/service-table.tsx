"use client";

import { Service } from "@/lib/api/services/service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, MoreHorizontal, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import formatDuration from "@/lib/utils/minute-to-hour";
import { formatCurrency } from "@/lib/utils";

interface ServiceTableProps {
  services: Service[];
  onEditService: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

export function ServiceTable({
  services,
  onEditService,
  onViewDetails,
}: ServiceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id} className="hover:bg-background">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {service.images?.[0] ? (
                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                      <Image
                        src={service.images[0]}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div>{service.name}</div>
                    {service.isPackage && (
                      <Badge className="bg-hairsby-orange text-primary-foreground hover:bg-hairsby-orange/80 text-xs mt-1">
                        Package
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="capitalize">{service.category}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(
                  Number(service.price).toFixed(2),
                  service?.currency!
                )}
                {service.discountPrice && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatCurrency(
                      Number(service.discountPrice).toFixed(2),
                      service?.currency!
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>{formatDuration(service.duration)}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(service)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditService(service)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // Toggle availability
                        onEditService({
                          ...service,
                          isAvailable: !service.isAvailable,
                        });
                      }}
                    >
                      {service.isAvailable
                        ? "Make Unavailable"
                        : "Make Available"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
