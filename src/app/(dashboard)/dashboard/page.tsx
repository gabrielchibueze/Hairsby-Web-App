"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Package,
  Star,
  Wallet,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserDashboard } from "@/lib/api/accounts/profile";
import { RecentBookings } from "@/components/dashboard/recent-booking";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import Link from "next/link";
// import { RecentOrders } from "@/components/order/components/recent-orders";
// import { RecentBookings } from "@/components/booking/components/recent-bookings";
import { RecentFavorites } from "@/components/dashboard/recent-favorite";

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getUserDashboard,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
        <div className="flex gap-2 mt-8">
          <a href="/services">
            <Button
              variant="outline"
              className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
            >
              Book Services
            </Button>
          </a>
          <a href="/products">
            <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
              Shop Products
            </Button>
          </a>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/bookings">
          <StatCard
            title="Appointments"
            value={Number(dashboard?.stats.totalAppointments)}
            secondaryValue={`${dashboard?.stats.upcomingAppointments} upcoming`}
            icon={<Calendar className="h-5 w-5" />}
            trend="up"
            delay={0}
          />
        </Link>
        <Link href="/dashboard/orders">
          <StatCard
            title="Orders"
            value={Number(dashboard?.stats?.totalOrders)}
            secondaryValue={`${dashboard?.stats.pendingOrders} pending`}
            icon={<Package className="h-5 w-5" />}
            trend="neutral"
            delay={0.1}
          />
        </Link>
        <Link href="/dashboard/wallet">
          <StatCard
            title="Wallet"
            value={`£${Number(dashboard?.stats.walletBalance).toFixed(2)}`}
            secondaryValue={`${dashboard?.stats.recentTransactions} recent`}
            icon={<Wallet className="h-5 w-5" />}
            trend="down"
            delay={0.2}
          />
        </Link>
        <Link href="/dashboard/reviews">
          <StatCard
            title="Reviews"
            value={Number(dashboard?.stats?.totalReviews)}
            secondaryValue={`${dashboard?.stats.pendingReviews} pending`}
            icon={<Star className="h-5 w-5" />}
            trend="up"
            delay={0.3}
          />
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Appointments */}
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your next beauty sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings bookings={dashboard?.appointments || []} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Sidebar */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={dashboard?.orders || []} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Favorite Providers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Favorites</CardTitle>
            <CardDescription>Quick access to your saved items</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentFavorites
              favorites={
                dashboard?.favorites || {
                  services: [],
                  products: [],
                  providers: [],
                }
              }
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  secondaryValue,
  icon,
  trend,
  delay = 0,
}: {
  title: string;
  value: number | string;
  secondaryValue?: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  delay?: number;
}) {
  const trendColors = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    neutral: "text-muted-FOREGROUND bg-muted",
  };

  const trendIcons = {
    up: <span className={trendColors.up}>↑</span>,
    down: <span className={trendColors.down}>↓</span>,
    neutral: <span className={trendColors.neutral}>→</span>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground/100">
            {title}
          </CardTitle>
          <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">{secondaryValue}</p>
            <div
              className={`text-xs px-2 py-1 rounded-full ${trendColors[trend]}`}
            >
              {trendIcons[trend]}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mt-2" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-10 w-48 mt-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>

      {/* Favorite Providers Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
