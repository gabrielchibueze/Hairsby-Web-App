// // app/provider/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/lib/contexts/auth.context";
// import {
//   DollarSign,
//   Users,
//   Calendar,
//   Star,
//   ScissorsSquareIcon,
//   Package,
//   Plus,
// } from "lucide-react";
// import { RecentBookings } from "@/components/provider/dashboard/recent-bookings";
// import { RecentOrders } from "@/components/provider/dashboard/recent-orders";
// import { RevenueChart } from "@/components/provider/dashboard/revenue-chart";
// import { TopServices } from "@/components/provider/dashboard/top-services";
// import { RecentReviews } from "@/components/provider/dashboard/recent-reviews";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   getProviderDashboard,
//   ProviderDashboard,
// } from "@/lib/api/accounts/provider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Booking } from "@/lib/api/services/booking";
// import { BookingDialog } from "./bookings/components/booking-dialog";
// import { Order } from "@/lib/api/products/order";
// import { OrderDialog } from "./orders/components/order-dialog";

// export default function ProviderDashboardPage() {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState<ProviderDashboard | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const data = await getProviderDashboard();
//         setDashboardData(data);
//       } catch (err) {
//         console.error("Failed to fetch dashboard data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
//   const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

//   const handleNewBooking = () => {
//     setIsBookingDialogOpen(!isBookingDialogOpen);
//   };

//   const handleNewOrder = () => {
//     setIsOrderDialogOpen(!isOrderDialogOpen);
//   };
//   const DashboardSkeleton = () => {
//     return (
//       <div className="space-y-4">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
//           ))}
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//           <Skeleton className="col-span-4 h-[300px] rounded-xl" />
//           <Skeleton className="col-span-3 h-[300px] rounded-xl" />
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {[...Array(3)].map((_, i) => (
//             <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
//           ))}
//         </div>
//       </div>
//     );
//   };
//   if (loading) {
//     return <DashboardSkeleton />;
//   }
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p>No data available</p>
//       </div>
//     );
//   }

//   const { stats, appointments, orders, reviews, revenueData, topServices } =
//     dashboardData;

//   return (
//     <div className="space-y-4">
//       <div className="md:flex justify-between items-center ">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             {user?.role === "specialist" ? "Specialist" : "Business"} Dashboard
//           </h1>
//           <p className="text-muted-foreground">
//             Welcome back! Here's what's happening with your account.
//           </p>
//         </div>
//         <div className="flex gap-2 mt-8">
//           <Button
//             variant="outline"
//             onClick={handleNewBooking}
//             className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
//             title="Quickly create a new booking"
//           >
//             New Booking
//           </Button>
//           <BookingDialog
//             open={isBookingDialogOpen}
//             onOpenChange={handleNewBooking}
//             booking={null}
//             providerId={user?.id || " "}
//             onSuccess={handleNewBooking}
//           />
//           <Button
//             onClick={handleNewOrder}
//             className="bg-hairsby-orange hover:bg-hairsby-orange/80"
//             title="Quickly create a new product order"
//           >
//             New Order
//           </Button>
//           <OrderDialog
//             open={isOrderDialogOpen}
//             onOpenChange={handleNewOrder}
//             order={null}
//             providerId={user?.id || ""}
//             onSuccess={handleNewOrder}
//           />
//         </div>
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Today's Appointments
//             </CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.todayAppointments}</div>
//             <p className="text-xs text-muted-foreground">
//               {stats.upcomingAppointments} upcoming
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Today's Orders
//             </CardTitle>
//             <Package className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.todayOrders}</div>
//             <p className="text-xs text-muted-foreground">
//               {stats.upcomingOrders} upcoming
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               £{stats.totalRevenue.toFixed(2)}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               {stats.revenueIncrease > 0 ? "+" : ""}
//               {stats.revenueIncrease}% from last period
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Customers</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalCustomers}</div>
//             <p className="text-xs text-muted-foreground">
//               +{stats.newCustomers} new this month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <Card className="col-span-4">
//           <CardHeader>
//             <CardTitle>Revenue Overview</CardTitle>
//           </CardHeader>
//           <CardContent className="pl-2">
//             <RevenueChart data={revenueData} />
//           </CardContent>
//         </Card>
//         <Card className="col-span-4 sm:col-span-3">
//           <CardHeader>
//             <CardTitle>Top Services</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <TopServices services={topServices} loading={loading} />
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Recent Bookings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <RecentBookings bookings={appointments} loading={loading} />
//           </CardContent>
//         </Card>
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Recent Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <RecentOrders orders={orders} loading={loading} />
//           </CardContent>
//         </Card>
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Recent Reviews</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <RecentReviews
//               loading={loading}
//               reviews={reviews}
//               averageRating={stats.averageRating}
//               totalReviews={stats.totalReviews}
//             />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

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
  Package,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { RecentBookings } from "@/components/booking/components/recent-bookings";
import { RecentOrders } from "@/components/order/components/recent-orders";
import { RevenueChart } from "@/components/provider/dashboard/revenue-chart";
import { TopServices } from "@/components/provider/dashboard/top-services";
import { RecentReviews } from "@/components/provider/dashboard/recent-reviews";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProviderDashboard,
  ProviderDashboard,
} from "@/lib/api/accounts/provider";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/api/services/booking";
import { Order } from "@/lib/api/products/order";
import { BookingForm } from "../../../components/booking/components/booking-form";
import { BookingDetails } from "../../../components/booking/components/booking-details";
import { OrderDetails } from "../../../components/order/components/order-details";
import { OrderForm } from "@/components/order/components/order-form";

type ViewMode =
  | "dashboard"
  | "newBooking"
  | "editBooking"
  | "bookingDetails"
  | "newOrder"
  | "editOrder"
  | "orderDetails";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<ProviderDashboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (typeof window !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (viewMode === "dashboard") {
      fetchDashboardData();
    }
  }, [viewMode]);

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setViewMode("newBooking");
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("editBooking");
  };

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("bookingDetails");
  };

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setViewMode("newOrder");
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("editOrder");
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("orderDetails");
  };

  const handleSuccess = () => {
    setViewMode("dashboard");
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
  };

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

  if (loading && viewMode === "dashboard") {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!dashboardData && viewMode === "dashboard") {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No data available</p>
      </div>
    );
  }

  const { stats, appointments, orders, reviews, revenueData, topServices } =
    dashboardData || {};

  return (
    <div className="space-y-4">
      {viewMode === "dashboard" ? (
        <>
          <div className="md:flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user?.role === "specialist" ? "Specialist" : "Business"}{" "}
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your account.
              </p>
            </div>
            <div className="flex gap-2 mt-8">
              <Button
                variant="outline"
                onClick={handleNewBooking}
                className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
                title="Quickly create a new booking"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
              <Button
                onClick={handleNewOrder}
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                title="Quickly create a new product order"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
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
                <div className="text-2xl font-bold">
                  {stats?.todayAppointments}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.upcomingAppointments} upcoming
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
                <div className="text-2xl font-bold">{stats?.todayOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.upcomingOrders} upcoming
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  £{Number(stats?.totalRevenue).toFixed(2)}
                </div>
                {stats?.revenueIncrease && (
                  <p className="text-xs text-muted-foreground">
                    {stats.revenueIncrease > 0 ? "+" : ""}
                    {stats.revenueIncrease}% from last period
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalCustomers}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.newCustomers} new this month
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
                <RevenueChart data={revenueData || []} />
              </CardContent>
            </Card>
            <Card className="col-span-4 sm:col-span-3">
              <CardHeader>
                <CardTitle>Top Services</CardTitle>
              </CardHeader>
              <CardContent>
                <TopServices services={topServices || []} loading={loading} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentBookings
                  bookings={appointments || []}
                  loading={loading}
                  onEditBooking={handleEditBooking}
                  onViewDetails={handleViewBookingDetails}
                  account="provider"
                />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentOrders
                  orders={orders || []}
                  loading={loading}
                  onEditOrder={handleEditOrder}
                  onViewDetails={handleViewOrderDetails}
                  account="provider"
                />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentReviews
                  loading={loading}
                  reviews={reviews || []}
                  averageRating={stats?.averageRating || 0}
                  totalReviews={stats?.totalReviews || 0}
                />
              </CardContent>
            </Card>
          </div>
        </>
      ) : viewMode === "newBooking" || viewMode === "editBooking" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === "newBooking" ? "New Booking" : "Edit Booking"}
          </h1>

          <BookingForm
            booking={selectedBooking}
            providerId={user?.id || " "}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleBackToDashboard}
          />
        </div>
      ) : viewMode === "bookingDetails" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <BookingDetails
            booking={selectedBooking}
            embedded
            onOpenChange={handleBackToDashboard}
            onEditBooking={() => setViewMode("editBooking")}
          />
        </div>
      ) : viewMode === "newOrder" || viewMode === "editOrder" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === "newOrder" ? "New Order" : "Edit Order"}
          </h1>

          <OrderForm
            order={selectedOrder}
            providerId={user?.id || ""}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleBackToDashboard}
          />
        </div>
      ) : viewMode === "orderDetails" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <OrderDetails
            order={selectedOrder}
            embedded
            onEditOrder={() => setViewMode("editOrder")}
          />
        </div>
      ) : null}
    </div>
  );
}
