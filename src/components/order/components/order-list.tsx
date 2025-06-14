"use client";

import { Order } from "@/lib/api/products/order";
import { useState, useEffect } from "react";
import { StatusFilter } from "./status-filter";
import { Button } from "@/components/ui/button";
import { Package, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchFilter } from "./search-filter";
import { OrderCard } from "./order.card";

interface OrderListProps {
  orders: Order[];
  onEditOrder?: (order: Order) => void;
  onViewDetails?: (order: Order) => void;
  isLoading?: boolean;
  inDetails?: boolean;
  statusFilter?: string;
  searchTerm?: string;
}

export function OrderList({
  orders,
  onEditOrder,
  onViewDetails,
  isLoading = false,
  inDetails = false,
  statusFilter,
  searchTerm,
}: OrderListProps) {
  const router = useRouter();
  // const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  // const [statusFilter, setStatusFilter] = useState<string>("all");
  // const [searchTerm, setSearchTerm] = useState<string>("");

  // useEffect(() => {
  //   let result = [...orders];

  //   // Apply status filter
  //   if (statusFilter !== "all") {
  //     result = result?.filter((order) => order.status === statusFilter);
  //   }

  //   // Apply search filter
  //   if (searchTerm) {
  //     const term = searchTerm.toLowerCase();
  //     result = result?.filter(
  //       (order) =>
  //         order.orderCode.toLowerCase().includes(term) ||
  //         order.customer?.firstName?.toLowerCase().includes(term) ||
  //         order.customer?.lastName?.toLowerCase().includes(term) ||
  //         order.items.some((item) => item.name.toLowerCase().includes(term))
  //     );
  //   }

  //   setFilteredOrders(result);
  // }, [orders, statusFilter, searchTerm]);

  const handleRefresh = () => {
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)]?.map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={() => onEditOrder?.(order)}
              onViewDetails={() => onViewDetails?.(order)}
              inDetails={inDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No orders found</p>
          <p className="text-muted-foreground text-sm">
            {statusFilter !== "all" || searchTerm
              ? "Try adjusting your filters"
              : "No orders have been placed yet"}
          </p>
        </div>
      )}
    </div>
  );
}
