"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/lib/api/products/order";
import { toast } from "@/components/ui/use-toast";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

interface CancelOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CancelOrderDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: CancelOrderDialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await cancelOrder(orderId, reason);

      toast({
        title: "Success",
        description: "Order has been cancelled",
      });

      onOpenChange(false);
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        title: "Error",
        description: message || "Failed to cancel order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-700">
            Cancelling an order will notify the customer and may require a
            refund if payment was already processed.
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reason for cancellation (required)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this order..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
