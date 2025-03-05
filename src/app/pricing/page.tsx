"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const plans = [
  {
    name: "Free Plan",
    price: 0,
    description:
      "Perfect for individuals starting their journey with our platform.",
    features: [
      "Basic booking management",
      "Simple calendar view",
      "Email notifications",
      "Single location only",
      "Basic customer profiles",
      "Standard support via email",
    ],
    limits: {
      bookingsPerMonth: 10,
      specialists: 0,
      locations: 1,
    },
  },
  {
    name: "Basic Plan",
    price: 19.99,
    description:
      "Ideal for independent service providers looking to grow their business.",
    features: [
      "Advanced calendar management",
      "SMS notifications",
      "Basic reporting & analytics",
      "Customer management system",
      "Customizable booking forms",
      "Online payment processing",
      "Basic inventory management",
      "Priority email support",
    ],
    limits: {
      bookingsPerMonth: 50,
      specialists: 1,
      locations: 1,
    },
  },
  {
    name: "Professional Plan",
    price: 29.99,
    description: "Perfect for growing businesses with a team of specialists.",
    features: [
      "Everything in Basic plan, plus:",
      "Team scheduling & management",
      "Advanced reporting & analytics",
      "Marketing tools & campaigns",
      "Integration with accounting software",
      "Custom branding options",
      "Resource allocation",
      "Automated reminders",
      "Priority phone & email support",
      "Staff performance tracking",
      "Up to 3 specialist accounts",
    ],
    limits: {
      bookingsPerMonth: 200,
      specialists: 3,
      locations: 2,
    },
  },
  {
    name: "Business Plan",
    price: 99.99,
    description: "Enterprise-grade solution for multi-location businesses.",
    features: [
      "Everything in Professional plan, plus:",
      "Multi-location management",
      "Custom workflows & automation",
      "White-label options",
      "Advanced API access",
      "Data exports & custom reports",
      "SLA guarantees",
      "Dedicated account manager",
      "Custom integration support",
      "Unlimited specialist accounts",
      "Advanced security features",
      "Bulk booking management",
      "Custom analytics dashboard",
      "24/7 priority support",
      "Quarterly business reviews",
    ],
    limits: {
      bookingsPerMonth: "Unlimited",
      specialists: "Unlimited",
      locations: "Unlimited",
    },
  },
];

export default function PricingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">
                Simple, Transparent Pricing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the perfect plan for your beauty business
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">£{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Monthly Bookings:</span>{" "}
                        {plan.limits.bookingsPerMonth}
                      </p>
                      <p>
                        <span className="font-medium">Specialists:</span>{" "}
                        {plan.limits.specialists}
                      </p>
                      <p>
                        <span className="font-medium">Locations:</span>{" "}
                        {plan.limits.locations}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={index === 2 ? "default" : "outline"}
                    >
                      {plan.price === 0 ? "Get Started" : "Subscribe Now"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="mt-12 grid gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg border bg-card p-6 text-left"
              >
                <h3 className="font-semibold">Can I change plans later?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes will be reflected in your next billing cycle.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-lg border bg-card p-6 text-left"
              >
                <h3 className="font-semibold">
                  Is there a contract or commitment?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  No, all our plans are month-to-month with no long-term
                  contracts. You can cancel anytime.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-lg border bg-card p-6 text-left"
              >
                <h3 className="font-semibold">
                  Do you offer custom enterprise plans?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, for larger businesses with specific needs, we offer
                  custom enterprise solutions. Contact our sales team to learn
                  more.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-background">
              Ready to grow your beauty business?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of beauty professionals who trust Hairsby to manage
              and grow their business
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground hover:text-foreground"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-background bg- text-background"
                  size="lg"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
