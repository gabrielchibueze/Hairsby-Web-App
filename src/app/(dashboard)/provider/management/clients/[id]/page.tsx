"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClientDetails } from "@/lib/api/accounts/clients";
import Spinner from "@/components/general/spinner";
import { Booking } from "@/lib/api/services/booking";
import { Order } from "@/lib/api/products/order";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BookingForm } from "@/components/booking/components/booking-form";
import { OrderForm } from "@/components/order/components/order-form";
import { OrderDetails } from "@/components/order/components/order-details";
import { BookingDetails } from "@/components/booking/components/booking-details";
import { useAuth } from "@/lib/contexts/auth.context";
import { ClientProfile } from "../components/clientProfile";
import { ClientTabs } from "../components/clientTabs";
export type ViewMode =
  | "dashboard"
  | "newBooking"
  | "editBooking"
  | "bookingDetails"
  | "newOrder"
  | "editOrder"
  | "orderDetails";

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getClientDetails(clientId);
        setClient(data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (typeof window !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (viewMode === "dashboard") {
      fetchDashboardData();
    }
  }, [viewMode]);

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setViewMode("newBooking");
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("editBooking");
  };

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("bookingDetails");
  };

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setViewMode("newOrder");
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("editOrder");
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("orderDetails");
  };

  const modeAndCreateFunction = ({
    mode,
    order,
    booking,
  }: {
    mode: ViewMode;
    order?: Order;
    booking?: Booking;
  }) => {
    switch (mode) {
      case "dashboard":
        setViewMode("dashboard");
        break;
      case "newBooking":
        handleNewBooking();
        break;
      case "newOrder":
        handleNewOrder();
        break;
      case "editOrder":
        order && handleEditOrder(order);
        break;
      case "editBooking":
        booking && handleEditBooking(booking);
        break;
      case "orderDetails":
        order && handleViewOrderDetails(order);
        break;
      case "bookingDetails":
        booking && handleViewBookingDetails(booking);
        break;
    }
  };

  const handleSuccess = () => {
    setViewMode("dashboard");
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading client: {error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">
          Client not found. Please check that all information is correct
        </p>
      </div>
    );
  }
  console.log(client);
  return (
    <div className="space-y-4">
      {viewMode === "dashboard" ? (
        <div className="space-y-6">
          <ClientProfile client={client} isLoading={loading} />
          <ClientTabs
            client={client}
            isLoading={loading}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </div>
      ) : viewMode === "newBooking" || viewMode === "editBooking" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === "newBooking" ? "New Booking" : "Edit Booking"}
          </h1>

          <BookingForm
            booking={selectedBooking}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleBackToDashboard}
            clientId={clientId}
          />
        </div>
      ) : viewMode === "bookingDetails" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <BookingDetails
            booking={selectedBooking}
            embedded
            onOpenChange={handleBackToDashboard}
            onEditBooking={() => setViewMode("editBooking")}
          />
        </div>
      ) : viewMode === "newOrder" || viewMode === "editOrder" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === "newOrder" ? "New Order" : "Edit Order"}
          </h1>

          <OrderForm
            order={selectedOrder}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleBackToDashboard}
            clientId={clientId}
          />
        </div>
      ) : viewMode === "orderDetails" ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <OrderDetails
            order={selectedOrder}
            embedded
            onEditOrder={() => setViewMode("editOrder")}
          />
        </div>
      ) : null}
    </div>
  );
}
