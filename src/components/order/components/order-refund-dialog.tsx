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
import { Order } from "@/lib/api/products/order";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface OrderRefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessRefund: (payload: { amount: number; reason: string }) => void;
  isLoading: boolean;
  maxAmount: number;
  order: Order;
}

export function OrderRefundDialog({
  open,
  onOpenChange,
  onProcessRefund,
  isLoading,
  maxAmount,
  order,
}: OrderRefundDialogProps) {
  const [amount, setAmount] = useState(maxAmount);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (amount <= 0) {
      alert("Refund amount must be greater than 0");
      return;
    }

    if (amount > maxAmount) {
      alert(`Refund amount cannot exceed ${maxAmount}`);
      return;
    }

    if (!reason) {
      alert("Please provide a reason for the refund");
      return;
    }

    onProcessRefund({ amount, reason });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Order Total</Label>
            <div className="text-lg font-semibold">${order.totalAmount}</div>
          </div>

          <div>
            <Label>Amount Paid</Label>
            <div className="text-lg font-semibold">${order.paidAmount}</div>
          </div>

          <div className="space-y-2">
            <Label>Refund Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0.01}
              max={maxAmount}
              step={0.01}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Maximum refundable amount: ${maxAmount}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Refund Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
          </div>

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
                  Processing...
                </>
              ) : (
                "Process Refund"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
