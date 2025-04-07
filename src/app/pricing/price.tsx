"use client";

import { motion } from "framer-motion";
import { Check, Zap, ChevronRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getFeatureMatrix,
  getSubscriptionPlans,
} from "@/lib/api/financials/subscription";
import { useQuery } from "@tanstack/react-query";
import { HairsbyIcon } from "@/components/logo";

export default function PricingComponent() {
  const { data: subscriptionPlans = [], isLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: getSubscriptionPlans,
  });

  const { data: featureMatrix = [] } = useQuery({
    queryKey: ["featureMatrix"],
    queryFn: getFeatureMatrix,
  });
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-hairsby-dark text-white py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Pricing Built for Every Beauty Business
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're a solo artist or a multi-location salon, we have a
              plan that fits
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionPlans.map((plan: any, index: number) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-xl border ${
                  plan.id === "professional"
                    ? "border-hairsby-orange shadow-lg ring-1 ring-hairsby-orange/50"
                    : "border-gray-200"
                }`}
              >
                {plan.id === "professional" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hairsby-orange text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6 h-full flex flex-col">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h2>
                    <p className="mt-2 text-gray-600 min-h-[3rem]">
                      {plan.description}
                    </p>

                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">
                        £{plan.price}
                      </span>
                      <span className="text-gray-500">/{plan.interval}</span>
                    </div>

                    {/* Limits Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {plan.limits.bookingsPerMonth >= 10000
                          ? "Unlimited"
                          : `Up to ${plan.limits.bookingsPerMonth}`}{" "}
                        bookings
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {plan.limits.specialists === 0
                          ? "Solo"
                          : plan.limits.specialists >= 500
                            ? "Unlimited"
                            : `${plan.limits.specialists}`}{" "}
                        specialists
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {plan.limits.locations >= 100
                          ? "Multi-location"
                          : `${plan.limits.locations}`}{" "}
                        location{plan.limits.locations !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature: any, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <Check
                            className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                              feature.includes("Everything in")
                                ? "text-gray-400"
                                : "text-green-500"
                            }`}
                          />
                          <span
                            className={`ml-3 ${
                              feature.includes("Everything in")
                                ? "text-gray-500 italic"
                                : "text-gray-700"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    size="lg"
                    className={`w-full mt-8 ${
                      plan.id === "professional"
                        ? "bg-hairsby-orange hover:bg-amber-500"
                        : plan.id === "business"
                          ? "bg-gray-900 hover:bg-gray-800"
                          : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {plan.price === 0 ? "Get Started" : "Choose Plan"}
                    {plan.id === "professional" && (
                      <Zap className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Plan Comparison
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              See how our plans stack up against each other
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="pb-6 text-left font-medium text-gray-900"
                  >
                    Feature
                  </th>
                  {subscriptionPlans.map((plan: any) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className="px-6 pb-6 text-center font-medium text-gray-900"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                    <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {label}
                    </td>
                    {subscriptionPlans.map((plan: any) => (
                      <td
                        key={`${key}-${plan.id}`}
                        className="px-6 py-4 text-center text-sm text-gray-600"
                      >
                        {featureMatrix[key][plan.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-hairsby-dark to-hairsby-dark/90 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <BadgeCheck className="h-12 w-12 text-hairsby-orange mx-auto" />
            {/* <div className="h-12 w-12 text-hairsby-orange mx-auto">
              <HairsbyIcon />
            </div> */}
            <h2 className="mt-6 text-3xl font-bold">
              Still Unsure Which Plan is Right?
            </h2>
            <p className="mt-4 text-gray-300">
              Our beauty business experts can help you choose the perfect plan
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-500"
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
    </div>
  );
}
