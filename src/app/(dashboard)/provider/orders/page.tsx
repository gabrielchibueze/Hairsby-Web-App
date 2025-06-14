"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, Grid, ArrowLeft, RefreshCw, Package } from "lucide-react";
import { OrderList } from "@/components/order/components/order-list";
import { OrderDetails } from "@/components/order/components/order-details";
import { OrderTable } from "@/components/order/components/order-table";
import { StatusFilter } from "@/components/order/components/status-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrders, Order } from "@/lib/api/products/order";
import { OrderForm } from "@/components/order/components/order-form";
import { SearchFilter } from "@/components/order/components/search-filter";
import { useRouter } from "next/navigation";
import Spinner from "@/components/general/spinner";

type ViewMode = "list" | "form" | "details";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders({
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (typeof window !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (viewMode === "list" && statusFilter) fetchOrders();
  }, [viewMode]); // Added viewMode to refresh when returning to list view

  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let result = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result?.filter((order) => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result?.filter(
        (order) =>
          order.orderCode.toLowerCase().includes(term) ||
          order.customer?.firstName?.toLowerCase().includes(term) ||
          order.customer?.lastName?.toLowerCase().includes(term) ||
          order.items.some((item) => item.name.toLowerCase().includes(term))
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm]);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("form");
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("details");
  };

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setViewMode("form");
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleSuccess = () => {
    setViewMode("list");
    // Refresh orders after successful operation
    const fetchOrders = async () => {
      const data = await getOrders({
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setOrders(data.orders);
    };
    fetchOrders();
  };

  const handleBackToList = () => {
    setViewMode("list");
  };
  const handleRefresh = () => {
    router.refresh();
  };

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <Skeleton className="h-10 w-[200px]" />
  //       <div className="grid gap-4">
  //         <Skeleton className="h-[500px] w-full rounded-xl" />
  //       </div>
  //     </div>
  //   );
  // }
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <Button onClick={handleNewOrder} variant="brand">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-8">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="table">
                    <List className="mr-2 h-4 w-4" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="grid">
                    <Grid className="mr-2 h-4 w-4" />
                    Grid
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex items-center gap-4">
                <SearchFilter value={searchTerm} onChange={setSearchTerm} />
                <StatusFilter value={statusFilter} onChange={setStatusFilter} />
              </div>
            </div>
            {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div> */}
            {filteredOrders.length > 0 ? (
              <>
                <TabsContent value="table" className="space-y-4">
                  <OrderTable
                    orders={filteredOrders}
                    onEditOrder={handleEditOrder}
                    onViewDetails={handleViewDetails}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                  />
                </TabsContent>

                <TabsContent value="grid" className="space-y-4">
                  <OrderList
                    orders={filteredOrders}
                    onEditOrder={handleEditOrder}
                    onViewDetails={handleViewDetails}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                  />
                </TabsContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 justify-self-center w-full">
                <Package className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">No orders found</p>
                <p className="text-muted-foreground text-sm">
                  {statusFilter !== "all" || searchTerm
                    ? "Try adjusting your filters"
                    : "No orders have been placed yet"}
                </p>
              </div>
            )}
          </Tabs>
        </>
      ) : viewMode === "form" ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {selectedOrder ? "Edit Order" : "New Order"}
          </h1>

          <OrderForm
            order={selectedOrder}
            providerId={user?.id || ""}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleBackToList}
          />
        </div>
      ) : viewMode === "details" ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <OrderDetails
            order={selectedOrder}
            embedded
            onEditOrder={() => setViewMode("form")}
          />
        </div>
      ) : null}
    </div>
  );
}
