"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  CreditCard,
  BarChart,
  Settings,
  Clipboard,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Easily manage schedules, commissions, and performance for your team",
    stat: "30% more efficient scheduling",
    image: "/images/salon-staff.jpg",
  },
  {
    icon: Calendar,
    title: "Smart Booking",
    description: "Automated online booking that syncs with your salon calendar",
    stat: "40% fewer no-shows",
    image: "/images/salon-booking.jpg",
  },
  {
    icon: CreditCard,
    title: "Integrated Payments",
    description:
      "Secure payment processing with automatic payouts and reporting",
    stat: "Faster payments",
    image: "/images/salon-payments.jpg",
  },
  {
    icon: BarChart,
    title: "Business Analytics",
    description:
      "Real-time insights to help you optimize your salon operations",
    stat: "Data-driven decisions",
    image: "/images/salon-analytics.jpg",
  },
];

const testimonials = [
  {
    name: "Luxe Beauty Lounge",
    location: "New York",
    quote:
      "Our revenue increased by 65% in the first 6 months using Hairsby's salon platform.",
    image: "/images/salon-testimonial-1.jpg",
    growth: "65% revenue increase",
  },
  {
    name: "Chic Cuts Studio",
    location: "Austin",
    quote:
      "The staff management tools cut our administrative work in half. Highly recommend!",
    image: "/images/salon-testimonial-2.jpg",
    growth: "50% less admin time",
  },
  {
    name: "Glamour Nails & Spa",
    location: "Miami",
    quote:
      "Our clients love the seamless booking experience and we love the business insights.",
    image: "/images/salon-testimonial-3.jpg",
    growth: "4.9/5 client rating",
  },
];

export default function ForSalonsClient() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                  The complete{" "}
                  <span className="text-hairsby-orange">salon management</span>{" "}
                  solution
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Everything you need to streamline operations and grow your
                  salon business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                    asChild
                  >
                    <Link href="/signup/salon">Get Started</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/demo/salon">Book a Demo</Link>
                  </Button>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={`/images/salon-avatar-${i + 1}.jpg`}
                        alt="Salon"
                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                      />
                    ))}
                  </div>
                  <div className="text-gray-300">
                    <p className="font-medium">2,000+ salons</p>
                    <div className="flex items-center gap-1">
                      <Clipboard className="w-4 h-4 text-blue-400" />
                      <span>Trusted by top salons</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="/images/hero-salon.jpg"
                  alt="Salon team"
                  className="rounded-xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <BarChart className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">
                      $100M+ processed for salons
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                  SALON FEATURES
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Designed for salon success
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Powerful tools to help your salon thrive
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <div className="w-full md:w-1/3 aspect-square overflow-hidden rounded-xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                        <feature.icon className="w-5 h-5 text-hairsby-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <p className="text-sm font-medium text-hairsby-orange">
                      {feature.stat}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                SALON SUCCESS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Salons growing with Hairsby
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {testimonial.growth}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-500">5.0</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-hairsby-dark text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your salon?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the platform helping salons streamline operations and
              increase revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                asChild
              >
                <Link href="/signup/salon">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                asChild
              >
                <Link href="/pricing/salon">See Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
