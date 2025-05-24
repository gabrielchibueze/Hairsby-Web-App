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
import { Input } from "../ui/input";
import { useAuth } from "@/lib/contexts/auth.context";
import { Booking } from "@/lib/api/services/booking";

interface BookingPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessPayment: (payload: {
    paymentMethod: string;
    useWallet?: boolean;
    paymentAmount: number | null;
  }) => void;
  isLoading: boolean;
  amount: number | undefined;
  booking: Booking;
}

export function BookingPaymentDialog({
  open,
  onOpenChange,
  onProcessPayment,
  isLoading,
  amount,
  booking,
}: BookingPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [useWallet, setUseWallet] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const { user } = useAuth();
  const handleSubmit = () => {
    let finalPaymentAmount: number | null = Number(amount);

    if (customAmount) {
      const parsedAmount = parseFloat(customAmount);
      if (!isNaN(parsedAmount)) {
        finalPaymentAmount = parsedAmount;
      }
    }

    onProcessPayment({
      paymentMethod,
      useWallet,
      paymentAmount: finalPaymentAmount,
    });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-96 sm:max-w-[425px] sm:mx-0">
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
              {user?.id === booking.provider?.id && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
              )}
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
                className="h-4 w-4 rounded border-border/80 text-hairsby-orange focus:ring-hairsby-orange"
              />
              <Label htmlFor="useWallet">Use wallet balance</Label>
            </div>
            {user?.id === booking.provider?.id && (
              <div className="space-y-2">
                <Label htmlFor="customAmount">Custom amount (optional)</Label>
                <Input
                  id="customAmount"
                  type="text"
                  inputMode="decimal"
                  placeholder={`Enter amount (e.g., ${Number(amount).toFixed(2)})`}
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to use the full amount
                </p>
              </div>
            )}
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
