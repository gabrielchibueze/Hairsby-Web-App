"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface BookingPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessPayment: (payload: {
    paymentMethod: string;
    useWallet?: boolean;
  }) => void;
  isLoading: boolean;
  amount: number;
}

export function BookingPaymentDialog({
  open,
  onOpenChange,
  onProcessPayment,
  isLoading,
  amount,
}: BookingPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [useWallet, setUseWallet] = useState(false);

  const handleSubmit = () => {
    onProcessPayment({
      paymentMethod,
      useWallet,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Amount: £{Number(amount).toFixed(2)}
            </h3>
          </div>

          <div className="space-y-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useWallet"
                checked={useWallet}
                onChange={(e) => setUseWallet(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-hairsby-orange focus:ring-hairsby-orange"
              />
              <Label htmlFor="useWallet">Use wallet balance</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
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
              {isLoading ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
