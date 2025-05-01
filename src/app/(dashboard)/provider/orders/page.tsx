"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  List,
  Grid,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { OrderList } from "./components/order-list";
import { OrderDialog } from "./components/order-dialog";
import { OrderDetails } from "./components/order-details";
import { OrderTable } from "./components/order-table";
import { StatusFilter } from "./components/status-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrders, Order } from "@/lib/api/products/order";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

    fetchOrders();
  }, [statusFilter]);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-hairsby-orange hover:bg-hairsby-orange/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
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
          <StatusFilter value={statusFilter} onChange={handleStatusChange} />
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

      <OrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
        providerId={user?.id || ""}
        onSuccess={() => {
          setIsDialogOpen(false);
          // You might want to add a refresh function here
        }}
      />

      <OrderDetails
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditOrder={() => {
          setIsDetailsOpen(false);
          setIsDialogOpen(true);
        }}
      />
    </div>
  );
}
