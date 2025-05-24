// src/app/pricing/compare/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  ChevronRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Infinity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSubscriptionPlans,
  compareSubscriptionPlans,
  SubscriptionPlan,
} from "@/lib/api/financials/subscription";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Spinner from "@/components/general/spinner";
import { useAuth } from "@/lib/contexts/auth.context";

export default function ComparePlansPage() {
  const { user } = useAuth();
  const { data: subscriptionPlans = [], isLoading: isPlansLoading } = useQuery<
    SubscriptionPlan[]
  >({
    queryKey: ["subscriptionPlans"],
    queryFn: getSubscriptionPlans,
  });

  const [selectedPlanA, setSelectedPlanA] = useState("free");
  const [selectedPlanB, setSelectedPlanB] = useState("professional");

  const planA = subscriptionPlans.find((plan) => plan.id === selectedPlanA);
  const planB = subscriptionPlans.find((plan) => plan.id === selectedPlanB);

  const {
    data: comparison,
    isLoading: isComparisonLoading,
    error,
  } = useQuery({
    queryKey: ["comparePlans", selectedPlanA, selectedPlanB],
    queryFn: () => {
      if (!planA || !planB) return null;
      return compareSubscriptionPlans(planA.id, planB.id);
    },
    enabled: !!planA && !!planB,
  });

  if (isPlansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mx-auto flex items-center justify-center ">
          <Spinner plain={false} />{" "}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error loading comparison data
      </div>
    );
  }

  if (!planA || !planB) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Selected plans not found
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-hairsby-dark text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Compare Subscription Plans
              </h1>
              <p className="mt-4 text-xl text-gray-300">
                Side-by-side comparison to help you choose the perfect plan for
                your business
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plan Selection */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  htmlFor="planA"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Plan
                </label>
                <select
                  id="planA"
                  value={selectedPlanA}
                  onChange={(e) => setSelectedPlanA(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-hairsby-orange focus:border-transparent"
                >
                  {subscriptionPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} (£{plan.price}/{plan.interval})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="planB"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Second Plan
                </label>
                <select
                  id="planB"
                  value={selectedPlanB}
                  onChange={(e) => setSelectedPlanB(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-hairsby-orange focus:border-transparent"
                >
                  {subscriptionPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} (£{plan.price}/{plan.interval})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {isComparisonLoading && (
          <div className="mx-auto flex items-center justify-center mt-12 ">
            <Spinner plain={false} />{" "}
          </div>
        )}
      </section>

      {/* Comparison Results */}

      {comparison && (
        <section className="py-12">
          <div className="container">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200">
                <div className="p-6 md:p-8 border-r border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {planA.name}
                  </h2>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      £{planA.price}
                    </span>
                    <span className="text-gray-500">/{planA.interval}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{planA.description}</p>
                </div>
                <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-hairsby-orange/10 text-hairsby-orange mb-3">
                      {comparison.isUpgrade
                        ? "UPGRADE"
                        : comparison.isDowngrade
                          ? "DOWNGRADE"
                          : "SAME PLAN"}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {comparison.isUpgrade ? (
                        <span className="flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 mr-1 text-green-500" />
                          {!Number(comparison.pricePercentageDifference)
                            ? "100"
                            : `${comparison.pricePercentageDifference} `}
                          % more
                        </span>
                      ) : comparison.isDowngrade ? (
                        <span className="flex items-center justify-center">
                          <ArrowDownRight className="h-5 w-5 mr-1 text-red-500" />
                          {Math.abs(
                            Number(comparison.pricePercentageDifference)
                          )}
                          % less
                        </span>
                      ) : (
                        "Same price"
                      )}
                    </h3>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {planB.name}
                  </h2>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      £{planB.price}
                    </span>
                    <span className="text-gray-500">/{planB.interval}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{planB.description}</p>
                </div>
              </div>

              {/* Key Differences */}
              <div className="p-6 md:p-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Key Differences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Price</h4>
                    <p className="text-gray-700">
                      {comparison.isUpgrade ? (
                        <span className="text-green-600">
                          +£{comparison.priceDifference.toFixed(2)}
                        </span>
                      ) : comparison.isDowngrade ? (
                        <span className="text-red-600">
                          -£{Math.abs(comparison.priceDifference).toFixed(2)}
                        </span>
                      ) : (
                        "Same price"
                      )}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">
                      Bookings
                    </h4>
                    <p className="text-gray-700">
                      {!Number(comparison.bookings?.difference) ? (
                        <span className="flex items-center">
                          <Infinity className="h-4 w-4 mr-1" /> Unlimited
                        </span>
                      ) : (
                        <>
                          {comparison.bookings?.difference > 0 ? (
                            <span className="text-green-600">
                              +{comparison.bookings.difference}
                            </span>
                          ) : comparison.bookings?.difference < 0 ? (
                            <span className="text-red-600">
                              {comparison.bookings?.difference}
                            </span>
                          ) : (
                            "Same"
                          )}{" "}
                          ({comparison.bookings?.a} → {comparison.bookings?.b})
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">
                      Specialists
                    </h4>
                    <p className="text-gray-700">
                      {!Number(comparison.specialists.difference) ? (
                        <span className="flex items-center">
                          <Infinity className="h-4 w-4 mr-1" /> Unlimited
                        </span>
                      ) : (
                        <>
                          {Number(comparison.specialists.difference) > 0 ? (
                            <span className="text-green-600">
                              +{comparison.specialists.difference}
                            </span>
                          ) : Number(comparison.specialists.difference) < 0 ? (
                            <span className="text-red-600">
                              {comparison.specialists.difference}
                            </span>
                          ) : (
                            "Same"
                          )}{" "}
                          ({comparison.specialists.a} →{" "}
                          {comparison.specialists.b})
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Comparison */}
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 ">
                  Features Comparison
                </h3>
                <div className="md:flex justify-between md:w-full">
                  {/* Only in Plan A */}
                  {comparison.missingFeatures.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center underline">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        Only in {planA.name}
                      </h4>
                      <ul className="space-y-2">
                        {comparison.missingFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-500" />
                            <span className="ml-3 text-gray-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Features */}
                  {comparison.commonFeatures.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center underline">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Available in both plans
                      </h4>
                      <ul className="space-y-2">
                        {comparison.commonFeatures
                          // .slice(0, 10)
                          .map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-500" />
                              <span className="ml-3 text-gray-700">
                                {feature}
                              </span>
                            </li>
                          ))}
                        {/* {comparison.commonFeatures.length > 10 && (
                        <li className="text-sm text-gray-500">
                          + {comparison.commonFeatures.length - 10} more
                          features...
                        </li>
                      )} */}
                      </ul>
                    </div>
                  )}

                  {/* Only in Plan B */}
                  {comparison.additionalFeatures.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center underline">
                        <Zap className="h-5 w-5 text-hairsby-orange mr-2" />
                        Only in {planB.name}
                      </h4>
                      <ul className="space-y-2">
                        {comparison.additionalFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-500" />
                            <span className="ml-3 text-gray-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/* CTA */}
              <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Ready to upgrade?
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Choose the plan that fits your business needs
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                      variant={
                        planA.id === "professional" ? "default" : "outline"
                      }
                      className={`w-full ${planA.id === "professional" ? "bg-hairsby-orange hover:bg-hairsby-orange/80" : ""}`}
                      asChild
                    >
                      <Link
                        href={
                          user?.id
                            ? `/pricing?plan=${planA.id}`
                            : `/login?redirect=/pricing?plan=${planA.id}`
                        }
                      >
                        Choose {planA.name}
                      </Link>
                    </Button>
                    <Button
                      variant={
                        planB.id === "professional" ? "default" : "outline"
                      }
                      className={`w-full ${planB.id === "professional" ? "bg-hairsby-orange hover:bg-hairsby-orange/80" : ""}`}
                      asChild
                    >
                      <Link
                        href={
                          user?.id
                            ? `/pricing?plan=${planB.id}`
                            : `/login?redirect=/pricing?plan=${planB.id}`
                        }
                      >
                        Choose {planB.name}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Pricing */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center text-hairsby-orange hover:text-amber-600 font-medium"
            >
              <ChevronRight className="h-5 w-5 mr-1 rotate-180" />
              Back to all pricing plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
