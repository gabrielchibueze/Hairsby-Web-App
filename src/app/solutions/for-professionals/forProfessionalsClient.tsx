"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  Users,
  BarChart,
  Zap,
  BadgeCheck,
  Star,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const benefits = [
  {
    icon: DollarSign,
    title: "Higher Earnings",
    description:
      "Keep up to 90% of your service revenue with our low commission structure",
    stat: "30% avg. income increase",
    image: "/images/pro-earnings.jpg",
  },
  {
    icon: Users,
    title: "Client Growth",
    description:
      "Get discovered by thousands of potential clients in your area",
    stat: "5x more client leads",
    image: "/images/pro-clients.jpg",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Automated booking system that works 24/7 even when you're busy",
    stat: "40% less admin time",
    image: "/images/pro-scheduling.jpg",
  },
  {
    icon: BarChart,
    title: "Business Insights",
    description:
      "Real-time analytics to help you optimize your services and pricing",
    stat: "Data-driven decisions",
    image: "/images/pro-analytics.jpg",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Miami",
    quote:
      "My client base tripled within 3 months of joining Hairsby. The quality of clients is exceptional.",
    image: "/images/pro-testimonial-1.jpg",
    earnings: "$12K+/mo",
  },
  {
    name: "Marcus Chen",
    location: "San Francisco",
    quote:
      "The booking automation saves me 10+ hours weekly. I can focus on my craft instead of admin work.",
    image: "/images/pro-testimonial-2.jpg",
    earnings: "$8K+/mo",
  },
  {
    name: "Elena Rodriguez",
    location: "Chicago",
    quote:
      "As a new stylist, Hairsby gave me instant credibility and a steady stream of clients.",
    image: "/images/pro-testimonial-3.jpg",
    earnings: "$6K+/mo",
  },
];

export default function ForProfessionalsClient() {
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
                  Grow your beauty business{" "}
                  <span className="text-hairsby-orange">on your terms</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Join the platform helping thousands of beauty professionals
                  earn more with less hassle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                    asChild
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/contact">Request a Demo</Link>
                  </Button>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={`/images/pro-avatar-${i + 1}.jpg`}
                        alt="Professional"
                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                      />
                    ))}
                  </div>
                  <div className="text-gray-300">
                    <p className="font-medium">10,000+ professionals</p>
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4 text-blue-400" />
                      <span>Verified professionals only</span>
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
                  src="/images/hero-professional.jpg"
                  alt="Professional at work"
                  className="rounded-xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">
                      $50M+ earned by professionals
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                  PROFESSIONAL BENEFITS
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Built to help you succeed
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need to grow your beauty business
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <div className="w-full md:w-1/3 aspect-square overflow-hidden rounded-xl">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                        <benefit.icon className="w-5 h-5 text-hairsby-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <p className="text-sm font-medium text-hairsby-orange">
                      {benefit.stat}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Add to src/app/(solutions)/for-professionals/page.tsx */}

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                SUCCESS STORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Professionals thriving with Hairsby
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
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {testimonial.earnings}
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
              Ready to grow your beauty business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals earning more with Hairsby.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                asChild
              >
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
