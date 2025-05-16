// "use client";

// import { Order } from "@/lib/api/products/order";
// import { OrderCard } from "./order-card";
// import { useState } from "react";
// import { SearchFilter } from "./search-filter";

// interface OrderListProps {
//   orders: Order[];
//   onEditOrder: (order: Order) => void;
//   onViewDetails: (order: Order) => void;
// }

// export function OrderList({
//   orders,
//   onEditOrder,
//   onViewDetails,
// }: OrderListProps) {
//   const [filteredOrders, setFilteredOrders] = useState(orders);

//   return (
//     <div className="space-y-4">
//       <SearchFilter orders={orders} onFilterChange={setFilteredOrders} />

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredOrders?.map((order) => (
//           <OrderCard
//             key={order.id}
//             order={order}
//             onEdit={() => onEditOrder(order)}
//             onViewDetails={() => onViewDetails(order)}
//           />
//         ))}
//       </div>

//       {filteredOrders?.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground/100">No orders match your filters</p>
//         </div>
//       )}
//     </div>
//   );
// }

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
}

export function OrderList({
  orders,
  onEditOrder,
  onViewDetails,
  isLoading = false,
  inDetails = false,
}: OrderListProps) {
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SearchFilter value={searchTerm} onChange={setSearchTerm} />
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {filteredOrders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders?.map((order) => (
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
          <Package className="h-12 w-12 text-muted-FOREGROUND/60" />
          <p className="text-muted-foreground/100 text-lg">No orders found</p>
          <p className="text-muted-FOREGROUND/60 text-sm">
            {statusFilter !== "all" || searchTerm
              ? "Try adjusting your filters"
              : "No orders have been placed yet"}
          </p>
        </div>
      )}
    </div>
  );
}
