import { Order } from "@/lib/api/products/order";
import { PackageIcon, ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/general/status-badge";
import { OrderStatusBadge } from "@/components/order/components/order-status-badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
  onEditOrder?: (order: Order) => void;
  onViewDetails?: (order: Order) => void;
  account?: string;
}

export function RecentOrders({
  orders,
  loading = false,
  onViewDetails,
  onEditOrder,
  account,
}: RecentOrdersProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="p-3 hover:bg-[#0a0e17]/5 transition-colors border-[#0a0e17]/20"
          >
            <div className="flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-10 w-10 rounded-lg bg-[#0a0e17]/10" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4 bg-[#0a0e17]/10" />
                  <Skeleton className="h-3 w-1/2 bg-[#0a0e17]/10" />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full justify-end">
                <Skeleton className="h-6 w-16 bg-[#0a0e17]/10" />
                <Skeleton className="h-6 w-16 bg-[#0a0e17]/10" />
                <Skeleton className="h-4 w-12 bg-[#0a0e17]/10" />
                <ChevronRightIcon className="h-4 w-4 text-[#0a0e17]/50" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.slice(0, 3).map((order) => (
        <Card
          key={order.id}
          className="p-3 transition-colors cursor-pointer border-[#0a0e17]/20"
        >
          <Link href={`/${account}/orders/${order.id}`}>
            <div className="flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-3 w-full">
                <div className="bg-[#F9A000]/10 p-2 rounded-lg">
                  <PackageIcon className="h-5 w-5 text-[#F9A000]" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#0a0e17] truncate">
                    Order #{order.orderCode}
                  </p>
                  <p className="text-sm text-[#0a0e17]/70 flex items-center">
                    <PackageIcon className="mr-1 h-3 w-3 text-[#0a0e17]/50" />
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full justify-end">
                <div className="flex gap-1 flex-wrap justify-end">
                  <OrderStatusBadge
                    status={order.status}
                    paymentStatus={order.paymentStatus}
                  />
                </div>
                <span className="font-medium text-sm min-w-[60px] text-right text-[#0a0e17]">
                  £{Number(order.totalAmount).toFixed(2)}
                </span>
                <ChevronRightIcon className="h-4 w-4 text-[#0a0e17]/50" />
              </div>
            </div>
          </Link>
        </Card>
      ))}
      {orders.length > 3 && (
        <div className="p-4 text-center">
          <Button variant="ghost" asChild>
            <Link href={`/${account}/orders`}>View all orders</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
