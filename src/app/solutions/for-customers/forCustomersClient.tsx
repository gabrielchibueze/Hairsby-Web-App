"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Star,
  Check,
  MapPin,
  Shield,
  Sparkles,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: Search,
    title: "Verified Professionals",
    description:
      "All providers are vetted for credentials and customer satisfaction",
    stat: "98% satisfaction rate",
    image: "/images/verified-professionals.jpg",
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    description:
      "Book instantly or schedule in advance with real-time availability",
    stat: "24/7 booking system",
    image: "/images/flexible-booking.jpg",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Encrypted transactions with multiple payment options",
    stat: "100% payment protection",
    image: "/images/secure-payments.jpg",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description: "From discovery to aftercare, we elevate every touchpoint",
    stat: "4.9/5 average rating",
    image: "/images/premium-experience.jpg",
  },
];

const clientPlatformFeatures = [
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description:
      "Chat directly with your stylist about service details, preferences, and follow-up care.",
    features: [
      "Secure encrypted messages",
      "Share reference images",
      "Service confirmations",
      "After-care instructions",
    ],
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: MapPin,
    title: "Map-Based Booking",
    description:
      "Find and book nearby professionals with our interactive map interface.",
    features: [
      "Real-time availability",
      "Distance filters",
      "Salon/service locations",
      "Mobile-optimized",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Calendar,
    title: "Booking Tools",
    description: "Manage all your beauty appointments in one place.",
    features: [
      "Multi-service bookings",
      "Automated reminders",
      "Easy rescheduling",
      "Calendar sync",
    ],
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: ShoppingCart,
    title: "Beauty Marketplace",
    description: "Purchase professional products recommended by your stylist.",
    features: [
      "Stylist-curated products",
      "Auto-replenishment",
      "Digital gift cards",
      "Loyalty rewards",
    ],
    image:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
];

const testimonials = [
  {
    name: "Sunday Onuoha",
    location: "Hull",
    quote:
      "Finding my perfect stylist was effortless. The before/after portfolio feature helped me choose with confidence.",
    image: "/images/testimonial-1.jpg",
    bookings: 12,
  },
  {
    name: "Gabriel Egwu",
    location: "Newcastle",
    quote:
      "As someone who travels frequently, being able to book quality stylists in any city has been a game-changer.",
    image: "/images/testimonial-2.jpg",
    bookings: 8,
  },
  {
    name: "Ema Miller",
    location: "London",
    quote:
      "The loyalty rewards actually feel valuable - I've saved hundreds on my regular appointments.",
    image: "/images/testimonial-3.jpg",
    bookings: 24,
  },
];

export default function ForCustomersClients() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        {/* <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white"> */}
        <section className="relative py-28 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1
                  className="text-4xl md:text-5xl font-bold leading-tight mb-6 
                "
                >
                  Book trusted beauty professionals{" "}
                  <span className="text-hairsby-orange">on your terms</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Discover, compare, and book certified stylists with
                  transparent pricing and verified reviews.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                    asChild
                  >
                    <Link href="/services">Find Your Stylist</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-900 text-gray-600 hover:bg-gray-500 hover:text-gray-200 text-lg"
                    asChild
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={`/images/avatar-${i + 1}.jpg`}
                        alt="Happy client"
                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                      />
                    ))}
                  </div>
                  <div className="text-gray-300">
                    <p className="font-medium">Trusted by 500K+ clients</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9/5 (12,000+ reviews)</span>
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
                  src="/images/hero-client.jpg"
                  alt="Happy client with stylist"
                  className="rounded-xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-100  text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">
                      1M+ appointments completed
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Trust Badges */}
        {/* <section className="py-8 bg-gray-50 border-y">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-500 mb-6">Featured in</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
              {["vogue", "allure", "elle", "glamour"].map((brand) => (
                <img
                  key={brand}
                  src={`/logos/${brand}.svg`}
                  alt={brand}
                  className="h-8 opacity-60 hover:opacity-100 transition"
                />
              ))}
            </div>
          </div>
        </section> */}
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                  WHY HAIRSBY
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Premium Beauty Experiences, Curated for You
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  We go beyond basic bookings to deliver exceptional service at
                  every touchpoint
                </p>

                <div className="space-y-8">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-12 h-12 rounded-lg bg-hairsby-orange/10 flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-hairsby-orange" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {feature.description}
                        </p>
                        <p className="text-sm text-hairsby-orange font-medium">
                          {feature.stat}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                {/* Interactive feature showcase */}
              </div>
            </div>
          </div>
        </section>

        {/* Client Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                  CLIENT FEATURES
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Everything you need
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover, book, and connect with beauty professionals
                  seamlessly
                </p>
              </motion.div>
            </div>

            <div className="space-y-12 md:space-y-16">
              {clientPlatformFeatures.map((feature, i) => (
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
                    className={`w-full md:w-2/5 lg:w-1/3 ${i % 2 === 0 ? "order-1" : "order-1 md:order-2"}`}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                        <div className="backdrop-blur-sm p-4 rounded-lg">
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
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feature.features.map((item, j) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + j * 0.05 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
                CLIENT STORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Loved by clients worldwide
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
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {testimonial.bookings} bookings
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to experience the difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of clients enjoying premium beauty services on
              their terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                asChild
              >
                <Link href="/services">Find Your Stylist</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-gray-700 hover:text-white hover:bg-white/10 text-lg"
                asChild
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
