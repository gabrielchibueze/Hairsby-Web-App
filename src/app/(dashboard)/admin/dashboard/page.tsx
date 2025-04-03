"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, DollarSign, ShoppingBag, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOverviewChart } from "@/components/admin/overview-chart";
import { AdminUserTable } from "@/components/admin/user-table";
import { AdminRecentOrders } from "@/components/admin/recent-orders";
import { getDashboard } from "@/lib/api/accounts/admin";

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log(dashboard);
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                {(dashboard?.totalBusinesses || 0) +
                  (dashboard?.totalSpecialists || 0) +
                  (dashboard?.totalCustomers || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                +
                {(dashboard?.totalBusinesses || 0) +
                  (dashboard?.totalSpecialists || 0)}{" "}
                active providers
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{dashboard?.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {dashboard?.totalBookings} bookings
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard?.totalBookings}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                {dashboard?.recentBookings} new today
              </p> */}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Providers
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(dashboard?.totalBusinesses || 0) +
                  (dashboard?.totalSpecialists || 0)}{" "}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {dashboard?.totalUsers} total users
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminOverviewChart data={dashboard?.revenueData || []} />
          </CardContent>
        </Card>
      </motion.div> */}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Users */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUserTable />
            </CardContent>
          </Card>
        </motion.div> */}

        {/* Recent Orders */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminRecentOrders orders={dashboard?.recentBookings || []} />
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </div>
  );
}
