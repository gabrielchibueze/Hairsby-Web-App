"use client";

import { motion } from "framer-motion";
import {
  Check,
  Zap,
  ChevronRight,
  BadgeCheck,
  Crown,
  CreditCard,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getFeatureMatrix,
  getSubscriptionPlans,
  subscribe,
  getCurrentSubscription,
  SubscriptionPlan,
} from "@/lib/api/financials/subscription";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/general/spinner";
import { useAuth } from "@/lib/contexts/auth.context";
import { useToast } from "@/components/ui/use-toast";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import { getPaymentMethods, PaymentMethod } from "@/lib/api/accounts/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PricingComponent() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const targetPlanId = searchParams.get("plan");
  // State for subscription flow
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [showCardForm, setShowCardForm] = useState(false);

  // Fetch data
  const { data: subscriptionPlans = [], isLoading: isPlansLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: getSubscriptionPlans,
  });

  const { data: featureMatrix = [] } = useQuery({
    queryKey: ["featureMatrix"],
    queryFn: getFeatureMatrix,
  });

  const { data: currentSubscription, isLoading: isSubscriptionLoading } =
    useQuery({
      queryKey: ["currentSubscription"],
      queryFn: getCurrentSubscription,
      enabled: isAuthenticated,
    });

  const { data: paymentMethods = [], isLoading: isPaymentMethodsLoading } =
    useQuery({
      queryKey: ["paymentMethods"],
      queryFn: getPaymentMethods,
      enabled: isAuthenticated && isPaymentDialogOpen,
    });

  // Mutation for subscription changes
  const subscribeMutation = useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
      toast({
        title: "Success",
        description: "Subscription updated successfully",
        className: "bg-green-500 text-white",
      });
      setIsPaymentDialogOpen(false);
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to update subscription",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });
  useEffect(() => {
    if (targetPlanId) {
      const targetSelectedPlan = subscriptionPlans.find(
        (plan: SubscriptionPlan) => plan.id === targetPlanId
      );
      if (targetSelectedPlan) {
        setSelectedPlan(targetSelectedPlan);

        console.log("targetSelectedPlan", targetSelectedPlan);
        console.log("selectedPlan", selectedPlan);
        // Free plan doesn't need payment
        if (selectedPlan && Number(selectedPlan.price) === 0) {
          handleFreeSubscription();
          return;
        }

        // Open payment dialog for paid plans
        setIsPaymentDialogOpen(true);
      }
    }
  }, [searchParams, targetPlanId]);
  // Handle plan selection
  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan",
        variant: "default",
        action: (
          <Button
            asChild
            variant="outline"
            className="border-hairsby-orange text-hairsby-orange"
          >
            <a
              href={`/login?redirect=${encodeURIComponent(`/pricing?plan=${plan?.id}`)}`}
            >
              Sign In
            </a>
          </Button>
        ),
      });
      return;
    }

    setSelectedPlan(plan);

    // Free plan doesn't need payment
    if (Number(plan.price) === 0) {
      handleFreeSubscription();
      return;
    }

    // Open payment dialog for paid plans
    setIsPaymentDialogOpen(true);
  };

  // Handle free subscription
  const handleFreeSubscription = async () => {
    if (!selectedPlan) return;

    try {
      setIsProcessing(true);
      await subscribeMutation.mutateAsync({
        planId: selectedPlan.id,
        paymentMethodId: null,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle paid subscription
  const handlePaidSubscription = async () => {
    if (!selectedPlan) return;

    try {
      setIsProcessing(true);

      // If using existing payment method
      if (!showCardForm && selectedPaymentMethodId) {
        await subscribeMutation.mutateAsync({
          planId: selectedPlan.id,
          paymentMethodId: selectedPaymentMethodId,
        });
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

      await subscribeMutation.mutateAsync({
        planId: selectedPlan.id,
        paymentMethodId: paymentMethod.id,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Payment processing failed",
      });
    }
  };

  // Get button text based on current subscription
  const getButtonText = (plan: SubscriptionPlan) => {
    const planPrice = Number(plan?.price);
    const currentSubscriptionPrice = Number(currentSubscription?.price);
    if (!currentSubscription) {
      return planPrice === 0 ? "Get Started" : "Choose Plan";
    }

    if (currentSubscription.planId === plan.id) {
      return "Current Plan";
    }

    if (currentSubscriptionPrice > planPrice && plan.id === "free") {
      return "downgrade";
    }

    if (currentSubscriptionPrice < planPrice) {
      return "Upgrade";
    }

    if (currentSubscriptionPrice > planPrice) {
      return "Downgrade";
    }

    return "Choose Plan";
  };

  // Check if plan is current
  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId;
  };

  // Get plan highlight status
  const getPlanHighlight = (plan: SubscriptionPlan) => {
    if (isCurrentPlan(plan.id)) return "current";
    if (plan.id === "professional") return "popular";
    return "none";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <section className="bg-hairsby-dark text-white py-16 md:py-24">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-hairsby-orange" />
              <span className="text-sm font-medium">Flexible Pricing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-4xl mx-auto">
              Simple Pricing for Businesses of All Sizes
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your business needs. Scale up or down
              as your business grows.
            </p>
          </motion.div>
        </div>
      </section> */}
      <section className="bg-hairsby-dark text-white py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Pricing Built for Every Service and Product Business
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're a solo professional or a multi-location business,
              we have a plan that fits
            </p>
          </motion.div>
        </div>
      </section>
      {/* Pricing Tiers */}
      {isPlansLoading || isSubscriptionLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <section className="py-12 md:py-20">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {subscriptionPlans.map(
                (plan: SubscriptionPlan, index: number) => {
                  const highlight = getPlanHighlight(plan);
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      className={cn(
                        "relative rounded-xl border bg-white shadow-sm transition-all hover:shadow-md overflow-hidden",
                        highlight === "popular" &&
                          "border-hairsby-orange ring-1 ring-hairsby-orange/50",
                        highlight === "current" && "ring-2 ring-hairsby-dark"
                      )}
                    >
                      {highlight === "popular" && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-hairsby-orange to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                          POPULAR
                        </div>
                      )}

                      {highlight === "current" && (
                        <div className="absolute top-0 right-0 bg-hairsby-dark text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                          YOUR PLAN
                        </div>
                      )}

                      <div className="p-6 h-full flex flex-col">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">
                              {plan.name}
                            </h2>
                            {plan.id === "business" && (
                              <Crown className="h-5 w-5 text-amber-500" />
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-600 min-h-[3rem]">
                            {plan.description}
                          </p>

                          <div className="mt-6 flex items-end">
                            <span className="text-3xl font-bold text-gray-900">
                              {formatCurrency(plan.price)}
                            </span>
                            <span className="text-gray-500 ml-1.5 text-sm">
                              /{plan.interval}
                            </span>
                            {Number(plan.price) === 0 && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Free forever
                              </span>
                            )}
                          </div>

                          {/* Limits Badges */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {plan.limits?.bookingsPerMonth &&
                              Number(plan.limits.bookingsPerMonth) >= 10000
                                ? "∞ bookings"
                                : `Up to ${plan.limits.bookingsPerMonth}`}{" "}
                              bookings
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {plan.limits.specialists === 0
                                ? "Solo"
                                : plan.limits?.specialists &&
                                    Number(plan.limits?.specialists) >= 500
                                  ? "∞ specialists"
                                  : `${plan.limits.specialists}`}{" "}
                              specialists
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {plan.limits?.locations &&
                              Number(plan.limits.locations) >= 100
                                ? "Multi-location"
                                : `${plan.limits.locations}`}{" "}
                              location
                              {Number(plan.limits.locations) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex-1">
                          <ul className="space-y-2.5">
                            {plan.features
                              .slice(0, !showMoreFeatures ? 6 : 50)
                              .map((feature: any, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <Check
                                    className={cn(
                                      "h-4 w-4 mt-0.5 flex-shrink-0",
                                      feature.includes("Everything in")
                                        ? "text-gray-400"
                                        : "text-green-500"
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "ml-2 text-sm",
                                      feature.includes("Everything in")
                                        ? "text-gray-500 italic"
                                        : "text-gray-700"
                                    )}
                                  >
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            {plan.features.length > 6 && (
                              <li
                                className="text-xs text-gray-500 cursor-pointer"
                                onClick={() =>
                                  setShowMoreFeatures(!showMoreFeatures)
                                }
                              >
                                {!showMoreFeatures
                                  ? `+${plan.features.length - 6} more feature${plan.features.length - 6 > 1 ? "s" : ""}`
                                  : "Show less features"}
                              </li>
                            )}
                          </ul>
                        </div>

                        <Button
                          size="sm"
                          className={cn(
                            "w-full mt-6 transition-all",
                            highlight === "popular"
                              ? "bg-gradient-to-r from-hairsby-orange to-amber-500 hover:from-hairsby-orange/90 hover:to-amber-500/90 text-white"
                              : highlight === "current"
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-default"
                                : "bg-hairsby-dark hover:bg-hairsby-dark/90 text-white"
                          )}
                          onClick={() => handlePlanSelect(plan)}
                          disabled={highlight === "current"}
                        >
                          {getButtonText(plan)}
                          {highlight === "popular" &&
                            !isCurrentPlan(plan.id) && (
                              <Zap className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* Feature Comparison */}
      {subscriptionPlans.length > 0 && featureMatrix && (
        <section className="py-12 md:py-20 bg-white">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Feature Comparison
              </h2>
              <p className="mt-2 md:mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                See how our plans compare across key features
              </p>
            </div>

            <ScrollArea orientation="horizontal" className="pb-4">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Feature
                      </th>
                      {subscriptionPlans.map((plan: any) => (
                        <th
                          key={plan.id}
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries({
                      "Booking Management": "bookingManagement",
                      Notifications: "notifications",
                      "Customer Support": "support",
                      Analytics: "analytics",
                      Customization: "customization",
                      Integrations: "integrations",
                      Security: "security",
                      Reporting: "reporting",
                    }).map(([label, key]) => (
                      <tr key={key}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {label}
                        </td>
                        {subscriptionPlans.map((plan: any) => {
                          const featureValue =
                            featureMatrix?.[key]?.[plan.id] || "Not available";

                          let badgeStyle = "bg-gray-100 text-gray-800";
                          if (plan.id === "free" && featureValue === "Basic") {
                            badgeStyle = "bg-blue-100 text-blue-800";
                          } else if (
                            plan.id === "basic" &&
                            featureValue === "Advanced"
                          ) {
                            badgeStyle = "bg-purple-100 text-purple-800";
                          } else if (
                            plan.id === "professional" &&
                            featureValue.includes("Advanced")
                          ) {
                            badgeStyle = "bg-green-100 text-green-800";
                          } else if (
                            plan.id === "business" &&
                            featureValue.includes("Enterprise")
                          ) {
                            badgeStyle = "bg-amber-100 text-amber-800";
                          }

                          return (
                            <td
                              key={`${key}-${plan.id}`}
                              className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600"
                            >
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}
                              >
                                {featureValue}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-hairsby-dark to-hairsby-dark/90 text-white">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm p-3 rounded-full w-14 h-14 mx-auto">
              <BadgeCheck className="h-6 w-6 text-hairsby-orange" />
            </div>
            <h2 className="mt-6 text-2xl md:text-3xl font-bold">
              Need Help Choosing?
            </h2>
            <p className="mt-2 md:mt-4 text-gray-300 text-sm md:text-base">
              Our team is ready to help you select the perfect plan for your
              business needs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                asChild
              >
                <a href="/contact">Talk to an Expert</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-gray-900 border-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href="/pricing/compare">
                  Compare All Features <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[500px] sm:mx-0">
          <DialogHeader>
            <DialogTitle>
              {Number(selectedPlan?.price) === 0
                ? "Start Your Free Plan"
                : `Subscribe to ${selectedPlan?.name}`}
            </DialogTitle>
            <DialogDescription>
              {Number(selectedPlan?.price) === 0
                ? "Get started with basic features at no cost"
                : `${formatCurrency(selectedPlan?.price)}/${selectedPlan?.interval} - billed ${selectedPlan?.interval}ly`}
            </DialogDescription>
          </DialogHeader>

          {Number(selectedPlan?.price) === 0 ? (
            <div className="py-4">
              <p className="text-gray-700 mb-4 text-sm">
                You'll have access to all free features immediately. No payment
                required.
              </p>
              <Button
                className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
                onClick={handleFreeSubscription}
                disabled={isProcessing}
              >
                {isProcessing ? <Spinner className="mr-2" /> : null}
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
                    <label className="block text-sm font-medium text-gray-700">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-hairsby-orange focus:ring-hairsby-orange sm:text-sm p-2"
                      placeholder="John Smith"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Card Details
                    </label>
                    <div className="rounded-md border border-gray-300 p-3">
                      <CardElement
                        options={{
                          style: {
                            base: {
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
                onClick={handlePaidSubscription}
                disabled={
                  isProcessing ||
                  (!showCardForm &&
                    paymentMethods.length > 0 &&
                    !selectedPaymentMethodId) ||
                  (showCardForm && (!nameOnCard || !stripe))
                }
              >
                {isProcessing ? <Spinner className="mr-2" /> : null}
                {Number(selectedPlan?.price) === 0
                  ? "Start Free Plan"
                  : `Subscribe for ${formatCurrency(selectedPlan?.price)}/${selectedPlan?.interval}`}
              </Button>

              <p className="text-xs text-gray-500 mt-2">
                By subscribing, you agree to our{" "}
                <a
                  href="/terms-conditions"
                  target="__blank"
                  className="underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="__blank"
                  className="underline"
                >
                  Privacy Policy
                </a>
                .
                {selectedPlan &&
                  Number(selectedPlan?.price) > 0 &&
                  " Your subscription will automatically renew until canceled."}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
