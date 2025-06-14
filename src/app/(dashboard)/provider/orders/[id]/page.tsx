"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderForm } from "@/components/order/components/order-form";
import { OrderDetails } from "@/components/order/components/order-details";
import { getOrderById, Order } from "@/lib/api/products/order";
import Spinner from "@/components/general/spinner";
import { useRouter } from "next/navigation";
type ViewMode = "editOrder" | "orderDetails";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("orderDetails");
  const [order, setOrders] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(params.id);
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch order data:", err);
        setError("Failed to load order data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (viewMode === "orderDetails") {
      fetchOrderData();
    }
  }, [viewMode]);

  const handleEditOrder = () => {
    setViewMode("editOrder");
  };

  const handleViewOrderDetails = () => {
    setViewMode("orderDetails");
  };

  const handleSuccess = () => {
    setViewMode("orderDetails");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }
  function handleBack() {
    router.back();
  }
  return (
    <div>
      {viewMode === "orderDetails" ? (
        <div className="space-y-4">
          <Button onClick={handleBack} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {order ? (
            <OrderDetails
              order={order}
              embedded
              onOpenChange={handleBack}
              onEditOrder={handleEditOrder}
            />
          ) : (
            <div className="h-96 flex justify-center items-center flex-col gap-4">
              <h2 className="font-bold">Order not found</h2>

              <p>Process new service orders to get started</p>
              <Link href="/provider/orders">
                <Button variant="brand">New Order</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={params.id ? handleBack : handleViewOrderDetails}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">Edit Order</h1>

          <OrderForm
            order={order}
            providerId={order?.provider?.id || " "}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleViewOrderDetails}
          />
        </div>
      )}
    </div>
  );
}
