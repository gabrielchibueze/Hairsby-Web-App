"use client";

import { Service } from "@/lib/api/services/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Package, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ServiceMetricsProps {
  services: Service[];
}

export function ServiceMetrics({ services }: ServiceMetricsProps) {
  // Calculate metrics
  const totalServices = services.length;
  const totalPackages = services.filter((s) => s.isPackage).length;
  const availableServices = services.filter((s) => s.isAvailable).length;
  const averagePrice =
    services.reduce((sum, service) => Number(sum) + Number(service.price), 0) /
    totalServices;
  const averageDuration =
    services.reduce((sum, service) => sum + service.duration, 0) /
    totalServices;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
          <p className="text-xs text-muted-foreground">
            {totalPackages} packages included
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableServices}</div>
          <p className="text-xs text-muted-foreground">
            {totalServices - availableServices} unavailable
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(Number(averagePrice).toFixed(2))}
          </div>
          <p className="text-xs text-muted-foreground">per service</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(averageDuration / 60)}h{" "}
            {Math.round(averageDuration % 60)}m
          </div>
          <p className="text-xs text-muted-foreground">per service</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalServices - availableServices}
          </div>
          <p className="text-xs text-muted-foreground">
            {Number(
              ((totalServices - availableServices) / totalServices) * 100
            ).toFixed(1)}
            % of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
