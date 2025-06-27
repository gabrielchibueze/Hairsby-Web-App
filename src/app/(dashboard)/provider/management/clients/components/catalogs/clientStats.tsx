"use client";
import React from "react";
import { Client } from "@/lib/api/accounts/clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign, Package, Scissors } from "lucide-react";
import {
  areaCurrencyFormat,
  formatCurrency,
  safeFormatDate,
} from "@/lib/utils";

interface ClientStatsProps {
  client: Client & {
    stats?: {
      bookings: {
        totalBookings: number;
        totalSpent: number;
        completedBookings: number;
        cancelledBookings: number;
      };
      orders: {
        totalOrders: number;
        currency?: string;
        totalSpent: number;
        completedOrders: number;
        cancelledOrders: number;
      };
    };
  };
  isLoading: boolean;
}

export function ClientStats({ client, isLoading }: ClientStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Scissors className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {client.stats?.bookings.totalBookings || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {client.stats?.bookings.completedBookings || 0} completed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {client.stats?.orders.totalOrders || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {client.stats?.orders.completedOrders || 0} completed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(
              Number(client.stats?.bookings.totalSpent || 0) +
                Number(client.stats?.orders.totalSpent || 0),
              client.stats?.orders?.currency || areaCurrencyFormat()
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Last seen:{" "}
            {client?.lastSeen
              ? safeFormatDate(new Date(client?.lastSeen), "PPP")
              : "Never"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {format(new Date(client.createdAt), "yyyy")}
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(client.createdAt), "PPP")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
