"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/lib/api/products/order";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const validTransitions: Record<string, string[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "delivered", "pickedup", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  pickedup: [],
  cancelled: [],
  refunded: [],
};

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (payload: {
    status?: string;
    paymentStatus?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
  }) => void;
  isLoading: boolean;
  currentStatus: string;
  currentPaymentStatus?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export function OrderStatusDialog({
  open,
  onOpenChange,
  onUpdateStatus,
  isLoading,
  currentStatus,
  currentPaymentStatus,
  trackingNumber,
  estimatedDeliveryDate,
}: OrderStatusDialogProps) {
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>(
    currentPaymentStatus || ""
  );
  const [newTrackingNumber, setNewTrackingNumber] = useState(
    trackingNumber || ""
  );
  const [newEstimatedDeliveryDate, setNewEstimatedDeliveryDate] = useState(
    estimatedDeliveryDate || ""
  );
  const [reason, setReason] = useState("");

  const availableStatuses = validTransitions[currentStatus] || [];

  const handleSubmit = () => {
    const payload: any = {};
    if (status) payload.status = status;
    if (paymentStatus && paymentStatus !== currentPaymentStatus)
      payload.paymentStatus = paymentStatus;
    if (newTrackingNumber !== trackingNumber)
      payload.trackingNumber = newTrackingNumber;
    if (newEstimatedDeliveryDate !== estimatedDeliveryDate)
      payload.estimatedDeliveryDate = newEstimatedDeliveryDate;
    if (reason && status === "cancelled") payload.reason = reason;

    onUpdateStatus(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {availableStatuses.length > 0 && (
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select
              value={paymentStatus}
              onValueChange={setPaymentStatus}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tracking Number</Label>
            <Input
              value={newTrackingNumber}
              onChange={(e) => setNewTrackingNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Estimated Delivery Date</Label>
            <Input
              type="date"
              value={newEstimatedDeliveryDate}
              onChange={(e) => setNewEstimatedDeliveryDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {status === "cancelled" && (
            <div className="space-y-2">
              <Label>Cancellation Reason</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-hairsby-orange hover:bg-amber-500"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
