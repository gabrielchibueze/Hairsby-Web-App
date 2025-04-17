// "use client";

// import { motion } from "framer-motion";
// import { format } from "date-fns";
// import { Package } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Order } from "@/lib/api/products/order";

// interface OrdersProps {
//   orders: Array<Order>;
// }

// export function RecentOrders({ orders }: OrdersProps) {
//   if (!orders?.length) {
//     return (
//       <div className="flex flex-col items-center justify-center py-8">
//         <p className="text-muted-foreground">No recent orders</p>
//         <Button className="mt-4" asChild>
//           <a href="/products">Shop Now</a>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {orders.map((order, index) => (
//         <motion.div
//           key={order.id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//           className="flex items-center justify-between rounded-lg border p-4"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="rounded-full bg-primary/10 p-2">
//               <Package className="h-4 w-4 text-primary" />
//             </div>
//             <div>
//               <h4 className="font-medium">
//                 {order.items
//                   .map((item) => `${item.quantity}x ${item.name}`)
//                   .join(", ")}
//               </h4>
//               <p className="text-sm text-muted-foreground">
//                 {order.createdAt && format(new Date(order?.createdAt), "PP")}
//               </p>
//               <p className="text-sm font-medium">
//                 £{Number(order?.totalAmount).toFixed(2)}
//               </p>
//             </div>
//           </div>
//           <div>
//             <Button variant="outline" size="sm" asChild>
//               <a href={`/dashboard/orders/${order.id}`}>View Order</a>
//             </Button>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { Package, Check, X, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Order } from "@/lib/api/products/order";

export function RecentOrders({ orders }: { orders: Order[] }) {
  const statusConfig = {
    pending: {
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      text: "Processing",
    },
    processing: {
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      text: "Processing",
    },
    shipped: {
      icon: <Truck className="h-4 w-4 text-blue-500" />,
      text: "Shipped",
    },
    delivered: {
      icon: <Check className="h-4 w-4 text-green-500" />,
      text: "Delivered",
    },
    cancelled: {
      icon: <X className="h-4 w-4 text-red-500" />,
      text: "Cancelled",
    },
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="py-2 text-center">
          <Package className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No recent orders
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your order history will appear here
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
                Shop Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {orders.slice(0, 3).map((order, index) => (
            <Link href={`/dashboard/orders/${order.id}`}>
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {statusConfig[order.status as keyof typeof statusConfig]
                      ?.icon || <Package className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      Order #{order.orderCode}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    £{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </span>
                </div>
                <div className="mt-2 text-xs font-medium">
                  {statusConfig[order.status as keyof typeof statusConfig]
                    ?.text || order.status}
                </div>
              </motion.div>
            </Link>
          ))}
          {orders.length > 3 && (
            <div className="pt-2 text-center">
              <Button variant="ghost" asChild>
                <Link href="/dashboard/orders">View all orders</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
