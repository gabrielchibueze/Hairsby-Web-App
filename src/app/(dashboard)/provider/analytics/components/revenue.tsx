"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import {
  EarningsMetricsResponse,
  getEarningMetrics,
} from "@/lib/api/accounts/provider";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { OverviewTab } from "./revenue/overview-tab";
import { BookingsTab } from "./revenue/bookings-tab";
import { OrdersTab } from "./revenue/orders-tab";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth.context";
export default function EarningsOverview() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "orders" | string | undefined
  >("overview");

  // Create stable query key parts
  const fromDateString = dateRange.from?.toISOString();
  const toDateString = dateRange.to?.toISOString();

  const { data, isLoading, isError, error } = useQuery<EarningsMetricsResponse>(
    {
      queryKey: ["provider-metrics", fromDateString, toDateString],
      queryFn: () =>
        getEarningMetrics({
          startDate: fromDateString,
          endDate: toDateString,
        }),
      retry: 2,
      staleTime: Infinity, // Prevent automatic refetches
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    }
  );

  // Debugging - log only when state changes
  useEffect(() => {
    console.log("Query state changed:", {
      isLoading,
      isError,
      data: !!data,
    });
  }, [isLoading, isError, data]);

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">
            Error loading financial data
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Failed to load dashboard metrics"}
          </p>
        </div>
      </div>
    );
  }

  // Only show skeleton on initial load when there's no data
  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        There was an error loading your analytics data
      </div>
    );
  }
  if (data) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Financial Dashboard
          </h2>
          <DateRangePicker
            onUpdate={({ range }) => setDateRange(range)}
            initialDateFrom={subDays(new Date(), 30)}
            initialDateTo={new Date()}
            align="end"
            className="w-full md:w-[300px]"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="mr-2 h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  data?.summary?.combinedRevenue || 0,
                  user?.currency!
                )}
              </div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Booking Revenue
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(data?.summary?.bookingRevenue || 0, user?.currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(data?.summary?.totalBookings || 0).toLocaleString()} bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Order Revenue
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  data?.summary?.orderRevenue || 0,
                  user?.currency!
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {(data?.summary?.totalOrders || 0).toLocaleString()} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Order Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  data?.summary?.avgOrderValue || 0,
                  user?.currency!
                )}
              </div>
              <p className="text-xs text-muted-foreground">Across all orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Content Based on Tab */}
        {activeTab === "overview" && <OverviewTab data={data} />}
        {activeTab === "bookings" && <BookingsTab data={data} />}
        {activeTab === "orders" && <OrdersTab data={data} />}
      </div>
    );
  }
}
