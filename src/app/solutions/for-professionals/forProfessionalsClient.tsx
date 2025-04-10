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
  Check,
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

const professionalClientFeatures = [
  {
    icon: Calendar,
    title: "Booking System",
    description:
      "Comprehensive tools to manage your appointments and client schedule.",
    features: [
      "Real-time booking calendar",
      "Automated client reminders",
      "Resource allocation tools",
      "Waitlist management",
    ],
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Tools to build and maintain your client relationships.",
    features: [
      "Client database",
      "Service history tracking",
      "Automated follow-ups",
      "Preference notes",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: ShoppingCart,
    title: "Product Marketplace",
    description: "Sell products directly to your clients through your profile.",
    features: [
      "Product catalog management",
      "Integrated e-commerce",
      "Digital product sales",
      "Inventory synchronization",
    ],
    image:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: BarChart,
    title: "Business Insights",
    description: "Data-driven tools to grow your beauty business.",
    features: [
      "Revenue tracking",
      "Client retention metrics",
      "Service popularity",
      "Performance benchmarks",
    ],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
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
        <section className="py-20 bg-gray-50">
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
        {/* Professional Tools Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                  PROFESSIONAL TOOLS
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Built for beauty professionals
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Powerful features designed to help you succeed
                </p>
              </motion.div>
            </div>

            <div className="space-y-12 md:space-y-16">
              {professionalClientFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-8 items-center"
                >
                  {/* Image on right for odd items, left for even */}
                  <div
                    className={`w-full h-fit md:w-2/5 lg:w-1/3 ${i % 2 === 0 ? "order-1" : "order-1 md:order-2"}`}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-96 object-cover absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                        <div className="backdrop-blur-sm p-4 rounded-lg bg-transparent">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                              <feature.icon className="w-5 h-5 text-hairsby-orange" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-200">
                              {feature.title}
                            </h3>
                          </div>
                          <p className="text-gray-200">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content on left for odd items, right for even */}
                  <div
                    className={`w-full md:w-3/5 lg:w-2/3 ${i % 2 === 0 ? "order-2" : "order-2 md:order-1"}`}
                  >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feature.features.map((item, j) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + j * 0.05 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
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
        <section className="py-20  bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
