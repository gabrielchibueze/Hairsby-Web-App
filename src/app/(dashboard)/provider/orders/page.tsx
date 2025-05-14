"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, Grid, ArrowLeft } from "lucide-react";
import { OrderList } from "@/components/order/components/order-list";
import { OrderDetails } from "@/components/order/components/order-details";
import { OrderTable } from "@/components/order/components/order-table";
import { StatusFilter } from "@/components/order/components/status-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrders, Order } from "@/lib/api/products/order";
import { OrderForm } from "@/components/order/components/order-form";

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
  }, [statusFilter, viewMode]); // Added viewMode to refresh when returning to list view

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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
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
            <Button
              onClick={handleNewOrder}
              className="bg-hairsby-orange hover:bg-hairsby-orange/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex flex-row justify-between gap-8">
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
              <StatusFilter
                value={statusFilter}
                onChange={handleStatusChange}
              />
            </div>

            <TabsContent value="table" className="space-y-4">
              <OrderTable
                orders={orders}
                onEditOrder={handleEditOrder}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <OrderList
                orders={orders}
                onEditOrder={handleEditOrder}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
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
