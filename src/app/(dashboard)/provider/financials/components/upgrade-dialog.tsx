"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubscriptionPlan } from "@/lib/api/financials/subscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscribe } from "@/lib/api/financials/subscription";
import { useAuth } from "@/lib/contexts/auth.context";
import { useToast } from "@/components/ui/use-toast";
import { getPaymentMethods, PaymentMethod } from "@/lib/api/accounts/profile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export function UpgradeDialog({
  plans,
  children,
}: {
  plans: SubscriptionPlan[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoadingPaymentMethods(true);
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error 
            ? error.message 
            : "Failed to load payment methods",
        });
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    if (open) {
      fetchPaymentMethods();
    }
  }, [open, toast]);

  useEffect(() => {
    if (paymentMethods.length > 0) {
      const defaultMethod = paymentMethods.find(method => method.isDefault) || paymentMethods[0];
      setSelectedPaymentMethodId(defaultMethod.id);
    }
  }, [paymentMethods]);

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedPaymentMethodId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both a plan and payment method",
      });
      return;
    }

    try {
      setLoading(true);
      await subscribe({ planId: selectedPlan, paymentMethodId: selectedPaymentMethodId });
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to update subscription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              {isLoadingPaymentMethods ? (
                <div className="border rounded-md p-4 text-sm text-muted-foreground">
                  Loading payment methods...
                </div>
              ) : paymentMethods.length > 0 ? (
                <Select
                  value={selectedPaymentMethodId || ""}
                  onValueChange={setSelectedPaymentMethodId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.card.brand.toUpperCase()} •••• {method.card.last4}
                        (Exp {method.card.exp_month}/{method.card.exp_year})
                        {method.isDefault && " • Default"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <div className="border rounded-md p-4 text-sm text-muted-foreground">
                    No payment methods available
                  </div>
                  <p className="text-sm">
                    No payment methods found -{" "}
                    <Link 
                      href="/dashboard/settings?source=/provider/financials&target=payments" 
                      className="text-hairsby-orange underline"
                      onClick={() => setOpen(false)}
                    >
                      add payment method
                    </Link>
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? "border-hairsby-orange ring-2 ring-hairsby-orange/50" 
                      : ""
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>
                    </div>
                    <Badge variant="outline">
                      £{plan.price}/{plan.interval}
                    </Badge>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.slice(0, 3).map((feature: SubscriptionPlan["features"], i:number) => (
                      <li key={i} className="flex items-center">
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-sm text-muted-foreground">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-hairsby-orange hover:bg-hairsby-orange/90"
              onClick={handleSubscribe}
              disabled={!selectedPlan || !selectedPaymentMethodId || loading}
            >
              {loading ? "Processing..." : "Upgrade Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}