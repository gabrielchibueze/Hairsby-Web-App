// app/provider/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  DollarSign,
  Users,
  Calendar,
  Star,
  ScissorsSquareIcon,
  Package,
} from "lucide-react";
import { RecentBookings } from "@/components/provider/dashboard/recent-bookings";
import { RecentOrders } from "@/components/provider/dashboard/recent-orders";
import { RevenueChart } from "@/components/provider/dashboard/revenue-chart";
import { TopServices } from "@/components/provider/dashboard/top-services";
import { RecentReviews } from "@/components/provider/dashboard/recent-reviews";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProviderDashboard,
  ProviderDashboard,
} from "@/lib/api/accounts/provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<ProviderDashboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getProviderDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const DashboardSkeleton = () => {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[300px] rounded-xl" />
          <Skeleton className="col-span-3 h-[300px] rounded-xl" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  };
  if (loading) {
    return <DashboardSkeleton />;
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No data available</p>
      </div>
    );
  }

  const { stats, appointments, orders, reviews, revenueData, topServices } =
    dashboardData;

  return (
    <div className="space-y-4">
      <div className="md:flex justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === "specialist" ? "Specialist" : "Business"} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
        <div className="flex gap-2 mt-8">
          <Link href="provider/booking/new">
            <Button
              variant="outline"
              className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
            >
              New Booking
            </Button>
          </Link>
          <Link href="provider/order/new">
            <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
              New Order
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingAppointments} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingOrders} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueIncrease > 0 ? "+" : ""}
              {stats.revenueIncrease}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newCustomers} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <TopServices services={topServices} loading={loading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={appointments} loading={loading} />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={orders} loading={loading} />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentReviews
              loading={loading}
              reviews={reviews}
              averageRating={stats.averageRating}
              totalReviews={stats.totalReviews}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
