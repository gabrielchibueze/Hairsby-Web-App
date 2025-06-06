"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/order/order-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders, Order } from "@/lib/api/products/order";

export default function OrdersComponent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;

  // Fetch all orders at once
  const { data: allOrders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("all");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };

  // Filter orders by status on the frontend
  const getFilteredOrders = (tab: string) => {
    if (!allOrders?.orders) return [];

    switch (tab) {
      case "all":
        return allOrders.orders;
      case "processing":
        return allOrders.orders.filter(
          (order: Order) => order.status === "processing"
        );
      case "shipped":
        return allOrders.orders.filter(
          (order: Order) => order.status === "shipped"
        );
      case "delivered":
        return allOrders.orders.filter(
          (order: Order) => order.status === "delivered"
        );
      default:
        return [];
    }
  };

  return (
    <Suspense>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
            <Link href="/products">Shop Products</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setPathActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <OrderList
              orders={getFilteredOrders("all")}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="processing">
            <OrderList
              orders={getFilteredOrders("processing")}
              status="processing"
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="shipped">
            <OrderList
              orders={getFilteredOrders("shipped")}
              status="shipped"
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="delivered">
            <OrderList
              orders={getFilteredOrders("delivered")}
              status="delivered"
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
