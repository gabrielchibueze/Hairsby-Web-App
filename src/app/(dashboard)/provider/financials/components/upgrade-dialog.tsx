"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  changeSubscriptionPlan,
  SubscriptionPlan,
} from "@/lib/api/financials/subscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { getPaymentMethods, PaymentMethod } from "@/lib/api/accounts/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Plus, CreditCard } from "lucide-react";
import Spinner from "@/components/general/spinner";
import { formatCurrency } from "@/lib/utils";

export function UpgradeDialog({
  plans,
  children,
}: {
  plans: SubscriptionPlan[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

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
          description:
            error instanceof Error
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
      const defaultMethod =
        paymentMethods.find((method) => method.isDefault) || paymentMethods[0];
      setSelectedPaymentMethodId(defaultMethod?.id || null);
    }
  }, [paymentMethods]);

  const handleChangeSubscriptionPlan = async () => {
    if (!selectedPlan) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a plan",
      });
      return;
    }

    // Handle free plan
    if (Number(selectedPlan.price) === 0) {
      try {
        setLoading(true);
        await changeSubscriptionPlan({
          newPlanId: selectedPlan.id,
          paymentMethodId: null,
        });
        toast({
          title: "Success",
          description: "Subscription updated successfully",
        });
        setOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update subscription",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle paid plans
    try {
      setLoading(true);

      // If using existing payment method
      if (!showCardForm && selectedPaymentMethodId) {
        await changeSubscriptionPlan({
          newPlanId: selectedPlan.id,
          paymentMethodId: selectedPaymentMethodId,
        });
        toast({
          title: "Success",
          description: "Subscription updated successfully",
        });
        setOpen(false);
        return;
      }

      // If adding new card
      if (!stripe || !elements || !nameOnCard) {
        throw new Error("Payment processing failed");
      }

      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: {
          name: nameOnCard,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      await changeSubscriptionPlan({
        newPlanId: selectedPlan.id,
        paymentMethodId: paymentMethod.id,
      });
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Payment processing failed",
      });
    } finally {
      setLoading(false);
      setSelectedPlan(null);
      setShowCardForm(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };
  const closeModal = () => {
    setOpen(!open);
    setSelectedPlan(null);
    setShowCardForm(false);
  };
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-w-[90vw] sm:max-w-[725px] sm:mx-0">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan && Number(selectedPlan.price) === 0
                ? "Start Your Free Plan"
                : selectedPlan
                  ? `Subscribe to ${selectedPlan.name}`
                  : "Upgrade Your Plan"}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan && Number(selectedPlan.price) === 0
                ? "Get started with basic features at no cost"
                : selectedPlan
                  ? `${formatCurrency(selectedPlan.price)}/${selectedPlan.interval} - billed ${selectedPlan.interval}ly`
                  : "Select a plan to continue"}
            </DialogDescription>
          </DialogHeader>

          {!selectedPlan ? (
            <ScrollArea className="max-h-[500px]">
              <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`p-6 cursor-pointer transition-all`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {plan.description}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatCurrency(plan.price)}/{plan.interval}
                      </Badge>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {plan.features
                        .slice(0, 5)
                        .map((feature: any, i: number) => (
                          <li key={i} className="flex items-center">
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      {plan.features.length > 5 && (
                        <li className="text-sm text-muted-foreground">
                          +{plan.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : Number(selectedPlan.price) === 0 ? (
            <div className="py-4">
              <p className="text-gray-700 mb-4 text-sm">
                You'll have access to all free features immediately. No payment
                required.
              </p>
              <Button
                className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
                onClick={handleChangeSubscriptionPlan}
                disabled={loading}
              >
                {loading ? <Spinner className="mr-2" /> : null}
                Start Free Plan
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {!showCardForm && paymentMethods.length > 0 && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Payment Method
                    </label>
                    <Select
                      value={selectedPaymentMethodId || ""}
                      onValueChange={(value) =>
                        setSelectedPaymentMethodId(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method: PaymentMethod) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                              <span>
                                {method.card.brand.toUpperCase()} ••••{" "}
                                {method.card.last4}
                                {method.isDefault && " (Default)"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center gap-2 text-hairsby-orange">
                            <Plus className="h-4 w-4" />
                            <span>Add new card</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPaymentMethodId === "new" && (
                    <div className="pt-2">
                      <button
                        type="button"
                        className="text-sm text-hairsby-orange hover:underline"
                        onClick={() => setShowCardForm(true)}
                      >
                        Add new payment method
                      </button>
                    </div>
                  )}
                </>
              )}

              {(showCardForm || paymentMethods.length === 0) && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className=" bg-background block w-full rounded-md shadow-sm focus:border-hairsby-orange focus:ring-hairsby-orange sm:text-sm p-2 border-2"
                      placeholder="John Smith"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Card Details
                    </label>
                    <div className="rounded-md border border-border p-3">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              backgroundColor: "bg-muted",
                              fontSize: "16px",
                              color: "#424770",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#9e2146",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90 mt-4"
                onClick={handleChangeSubscriptionPlan}
                disabled={
                  loading ||
                  (!showCardForm &&
                    paymentMethods.length > 0 &&
                    !selectedPaymentMethodId) ||
                  (showCardForm && (!nameOnCard || !stripe))
                }
              >
                {loading ? <Spinner className="mr-2" /> : null}
                {Number(selectedPlan.price) === 0
                  ? "Start Free Plan"
                  : `Subscribe for ${formatCurrency(selectedPlan.price)}/${selectedPlan.interval}`}
              </Button>

              <p className="text-xs text-gray-500 mt-2">
                By subscribing, you agree to our{" "}
                <Link
                  href="/terms-conditions"
                  target="_blank"
                  className="underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="underline"
                >
                  Privacy Policy
                </Link>
                .
                {selectedPlan &&
                  Number(selectedPlan.price) > 0 &&
                  " Your subscription will automatically renew until canceled."}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
