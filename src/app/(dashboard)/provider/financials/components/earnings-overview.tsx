// app/(provider)/financials/components/earnings-overview.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Calendar, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { getEarnings, getEarningsMetrics } from "@/lib/api/accounts/provider";
import { EarningsChart } from "./earnings-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export function EarningsOverview() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ["provider-earnings", dateRange],
    queryFn: () => getEarnings({
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString(),
    }),
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["provider-earnings-metrics"],
    queryFn: getEarningsMetrics,
  });

  if (earningsLoading || metricsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Earnings Overview</h2>
        <DateRangePicker 
          onUpdate={({ range }) => setDateRange(range)}
          initialDateFrom={subDays(new Date(), 30)}
          initialDateTo={new Date()}
          showCompare={false} // Turn off comparison if not needed
          className="w-[300px]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{Number(metrics?.totalEarnings)?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time completed bookings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.completedBookings || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful appointments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(metrics?.averageRating)?.toFixed(1) || "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              From {metrics?.totalReviews || 0} reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Period
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{Number(earnings?.summary?.totalEarnings)?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {earnings?.summary?.totalBookings || 0} bookings
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <EarningsChart data={earnings?.earnings || []} />
        </CardContent>
      </Card>
    </div>
  );
}