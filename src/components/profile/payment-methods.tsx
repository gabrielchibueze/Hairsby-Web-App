"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import {
  getPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from "@/lib/api/accounts/profile";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPaymentMethodForm } from "./add-payment-form";
import { Badge } from "../ui/badge";
import { PaymentMethod } from "@/lib/api/accounts/profile";
import { StripeProvider } from "../../lib/utils/stripe-utils/stripe-provider";
import Spinner from "../general/spinner";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

export function PaymentMethods({ source }: { source?: string | null }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        setLoading(true);
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error: any) {
        const message = await ErrorToastResponse(error.response);
        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Failed to load payment methods",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPaymentMethods();
  }, [toast]);

  const handleRemove = async (id: string) => {
    try {
      setLoading(true);
      await removePaymentMethod(id);
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
      toast({
        title: "Success",
        description: "Payment method removed",
        className: "bg-green-500 text-primary-foreground",
      });
      setLoading(false);
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to remove payment method",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      await setDefaultPaymentMethod(id);
      setPaymentMethods(
        paymentMethods.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      toast({
        title: "Success",
        description: "Default payment method updated",
        className: "bg-green-500 text-primary-foreground",
      });
      setLoading(false);
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to update default payment method",
      });
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "VISA";
      case "mastercard":
        return "MC";
      case "american express":
        return "AMEX";
      case "discover":
        return "DISC";
      default:
        return "CARD";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Payment Methods
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-hairsby-orange hover:bg-hairsby-orange/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-80 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <StripeProvider>
                <AddPaymentMethodForm
                  onSuccess={(newMethod) => {
                    setPaymentMethods([...paymentMethods, newMethod]);
                    toast({
                      title: "Success",
                      description: "Payment method added",
                      className: "bg-green-500 text-primary-foreground",
                    });
                  }}
                  source={source}
                />
              </StripeProvider>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No payment methods</h3>
            <p className="text-sm text-muted-foreground">
              Add a payment method to make bookings and purchases easier
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted font-medium">
                      {getCardIcon(method.card.brand)}
                    </div>
                    <div>
                      <h3 className="font-medium capitalize">
                        {method.card.brand}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        •••• •••• •••• {method.card.last4}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {method.card.exp_month}/{method.card.exp_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-col sm:flex-row">
                    {method.isDefault ? (
                      <Badge variant="success">Default</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        className="border-hairsby-orange text-hairsby-orange"
                      >
                        {loading ? <Spinner /> : null} Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(method.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <span>
                          <Trash2 className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
