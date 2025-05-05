// components/provider/dashboard/recent-orders.tsx
import { Order } from "@/lib/api/products/order";
import { PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentOrdersProps {
  orders: Order[];
  loading: boolean;
  onEditOrder: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

export function RecentOrders({
  orders,
  loading = false,
  onViewDetails,
  onEditOrder,
}: RecentOrdersProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[150px]" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </div>
            <Skeleton className="ml-auto h-4 w-[50px]" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center"
          onClick={() => onViewDetails(order)}
        >
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Order #{order.orderCode}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <PackageIcon className="mr-1 h-3 w-3" />
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </div>
            <div className="flex gap-2">
              <Badge
                variant={order.status === "delivered" ? "default" : "secondary"}
              >
                {order.status}
              </Badge>
              <Badge
                variant={
                  order.paymentStatus === "paid" ? "default" : "destructive"
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
          <div className="ml-auto font-medium">
            £{order.totalAmount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
