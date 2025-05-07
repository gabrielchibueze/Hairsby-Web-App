import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/order/order-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Breadcrumb from "@/components/general/breadcrumb";

export default function OrdersComponent() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "My Favorites" },
        ]}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
          <Link href="/products">Shop Products</Link>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OrderList />
        </TabsContent>
        <TabsContent value="processing">
          <OrderList status="processing" />
        </TabsContent>
        <TabsContent value="shipped">
          <OrderList status="shipped" />
        </TabsContent>
        <TabsContent value="delivered">
          <OrderList status="delivered" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
