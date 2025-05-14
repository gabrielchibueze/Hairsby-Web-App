"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { CreditCard, ShoppingBag, Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/use-toast";
import { getWallet } from "@/lib/api/financials/wallet";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

export default function ProductCheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart } = useCart();
  const { toast } = useToast();

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      // TODO: Implement checkout logic
      toast({
        title: "Success",
        description: "Order placed successfully",
      });
      // Redirect to confirmation page
      window.location.href = "/products/checkout/confirmation";
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);

      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to process payment",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart?.items.length) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center py-10">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some products to your cart to checkout
        </p>
        <Button className="mt-8" asChild>
          <a href="/products">Shop Now</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items?.length &&
                cart.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>£{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "card" | "wallet") =>
                  setPaymentMethod(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet Balance (£{wallet?.balance.toFixed(2)})
                  </Label>
                </div>
              </RadioGroup>

              {wallet && wallet.balance > 0 && paymentMethod === "card" && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Use Wallet Balance</Label>
                    <p className="text-sm text-muted-foreground">
                      Available: £{wallet.balance.toFixed(2)}
                    </p>
                  </div>
                  <Switch
                    checked={useWalletBalance}
                    onCheckedChange={setUseWalletBalance}
                  />
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Month</Label>
                      <Input placeholder="MM" />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry Year</Label>
                      <Input placeholder="YY" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  Free delivery on orders over £50
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
