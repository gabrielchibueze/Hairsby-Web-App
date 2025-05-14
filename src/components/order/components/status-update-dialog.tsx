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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/api/products/order";
import { toast } from "@/components/ui/use-toast";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

interface StatusUpdateDialogProps {
  orderId: string;
  currentStatus: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StatusUpdateDialog({
  orderId,
  currentStatus,
  open,
  onOpenChange,
  onSuccess,
}: StatusUpdateDialogProps) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getNewStatus = () => {
    switch (currentStatus) {
      case "pending":
        return "processing";
      case "processing":
        return "shipped";
      case "shipped":
        return "delivered";
      default:
        return currentStatus;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        status: getNewStatus(),
      };

      if (getNewStatus() === "shipped") {
        payload.trackingNumber = trackingNumber;
      }

      if (notes) {
        payload.notes = notes;
      }

      await updateOrderStatus(orderId, payload);

      toast({
        title: "Success",
        description: `Order status updated to ${getNewStatus()}`,
      });

      onOpenChange(false);
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        title: "Error",
        description: message || "Failed to update order status",
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
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>Current status: {currentStatus}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="font-medium">
            New status: <span className="capitalize">{getNewStatus()}</span>
          </div>

          {getNewStatus() === "shipped" && (
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-hairsby-orange hover:bg-hairsby-orange/80"
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
