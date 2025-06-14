"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/api/products/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  updateOrderStatus,
  processOrderPayment,
  refundOrderPayment,
} from "@/lib/api/products/order";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { OrderPaymentDialog } from "./order-payment-dialog";
import { OrderStatusDialog } from "./order-dialog";
import { OrderRefundDialog } from "./order-refund-dialog";
import { useAuth } from "@/lib/contexts/auth.context";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

export function OrderActions({
  order,
  canManage = true,
}: {
  order: Order;
  canManage?: Boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const { user } = useAuth();

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelOrder(order.id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Order cancelled",
        description: "The order has been cancelled successfully",
      });
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);

      toast({
        title: "Error",
        description: message || "Failed to cancel order",
        variant: "destructive",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (payload: {
      status?: string;
      paymentStatus?: string;
      trackingNumber?: string;
      estimatedDeliveryDate?: string;
    }) => updateOrderStatus(order.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setStatusOpen(false);
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);

      toast({
        title: "Error",
        description: message || "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (payload: { paymentMethod: string; paymentAmount?: number }) =>
      processOrderPayment(order.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setPaymentOpen(false);
      toast({
        title: "Payment processed",
        description: "Payment has been processed successfully",
      });
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);

      toast({
        title: "Error",
        description: message || "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  const refundMutation = useMutation({
    mutationFn: (payload: { amount: number; reason: string }) =>
      refundOrderPayment(order.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setRefundOpen(false);
      toast({
        title: "Refund processed",
        description: "Refund has been processed successfully",
      });
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);
      toast({
        title: "Error",
        description: message || "Failed to process refund",
        variant: "destructive",
      });
    },
  });

  const handleCancel = () => {
    const reason = prompt("Please enter the reason for cancellation:");
    if (reason) {
      cancelMutation.mutate(reason);
    }
  };

  const canCancel = ["pending", "processing"].includes(order.status);
  const canPay =
    order.paymentStatus !== "paid" &&
    order.status !== "cancelled" &&
    order.status !== "refunded" &&
    canManage;
  const canUpdateStatus =
    user?.role !== "customer" &&
    order.status !== "cancelled" &&
    order.status !== "refunded" &&
    canManage;
  const canRefund =
    (user?.role === "admin" || user?.id === order.providerId || canManage) &&
    order?.paidAmount > 0 &&
    ["paid", "partial"].includes(order.paymentStatus);

  return (
    <div className="flex flex-wrap gap-2">
      {/* Customer actions */}
      {user?.role === "customer" && canCancel && (
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={cancelMutation.isPending}
        >
          {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
        </Button>
      )}

      {/* Payment action */}
      {canPay && (
        <Button
          variant="brand"
          onClick={() => setPaymentOpen(true)}
          disabled={paymentMutation.isPending}
        >
          {paymentMutation.isPending
            ? "Processing..."
            : `${user?.role === "customer" ? "Make Payment" : "Process Payment"}`}
        </Button>
      )}

      {/* Status update action (provider/admin) */}
      {canUpdateStatus && (
        <Button
          variant="outline"
          onClick={() => setStatusOpen(true)}
          disabled={statusMutation.isPending}
        >
          {statusMutation.isPending ? "Updating..." : "Update Status"}
        </Button>
      )}

      {/* Refund action (provider/admin) */}
      {canRefund && (
        <Button
          variant="outline"
          onClick={() => setRefundOpen(true)}
          disabled={refundMutation.isPending}
        >
          {refundMutation.isPending ? "Processing..." : "Process Refund"}
        </Button>
      )}

      {/* Additional actions dropdown */}
      {(canUpdateStatus || canRefund) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {canUpdateStatus && (
              <DropdownMenuItem onClick={() => setStatusOpen(true)}>
                Update Status
              </DropdownMenuItem>
            )}
            {canRefund && (
              <DropdownMenuItem onClick={() => setRefundOpen(true)}>
                Process Refund
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <a href={`/providers/${order.providerId}`}>View Provider</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Dialogs */}
      <OrderPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        onProcessPayment={paymentMutation.mutate}
        isLoading={paymentMutation.isPending}
        amount={order.totalAmount - order?.paidAmount}
        order={order}
      />

      <OrderStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        onUpdateStatus={statusMutation.mutate}
        isLoading={statusMutation.isPending}
        currentStatus={order.status}
        currentPaymentStatus={order.paymentStatus}
        trackingNumber={order.trackingNumber}
        estimatedDeliveryDate={order.estimatedDeliveryDate}
      />

      <OrderRefundDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        onProcessRefund={refundMutation.mutate}
        isLoading={refundMutation.isPending}
        maxAmount={order.paidAmount}
        order={order}
      />
    </div>
  );
}
