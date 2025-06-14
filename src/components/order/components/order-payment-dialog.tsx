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

interface OrderPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessPayment: (payload: {
    paymentMethod: string;
    paymentAmount?: number;
  }) => void;
  isLoading: boolean;
  amount: number;
  order: Order;
}

export function OrderPaymentDialog({
  open,
  onOpenChange,
  onProcessPayment,
  isLoading,
  amount,
  order,
}: OrderPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentAmount, setPaymentAmount] = useState<number | null>(amount);

  const handleSubmit = () => {
    if (paymentAmount && paymentAmount > amount) {
      alert(`Payment amount cannot exceed ${amount}`);
      return;
    }

    onProcessPayment({
      paymentMethod,
      paymentAmount: paymentAmount || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
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

          <div>
            <Label>Amount Due</Label>
            <div className="text-lg font-semibold">${amount}</div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment Amount</Label>
            <Input
              type="number"
              value={paymentAmount || ""}
              onChange={(e) =>
                setPaymentAmount(e.target.value ? Number(e.target.value) : null)
              }
              min={0.01}
              max={amount}
              step={0.01}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to pay full amount (${amount})
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant="brand" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Payment"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
