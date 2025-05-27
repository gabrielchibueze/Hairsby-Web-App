"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  MapPin,
  Calendar,
  ShoppingCart,
  Users,
  BarChart,
  Package,
  Smile,
  CreditCard,
  Megaphone,
  Code,
  Settings,
  Globe,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSections() {
  return (
    <>
      {/* Client Features */}
      <section className="py-20 bg-gray-50">
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
                Discover, book, and connect with service professionals
                seamlessly
              </p>
            </motion.div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {[
              {
                icon: MessageSquare,
                title: "In-App Messaging",
                description:
                  "Chat directly with your specialist about service details, preferences, and follow-up care.",
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
                  "Business/service locations",
                  "Mobile-optimized",
                ],
                image:
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: Calendar,
                title: "Booking Tools",
                description:
                  "Manage all your service appointments in one place.",
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
                title: "Service Marketplace",
                description:
                  "Purchase professional products recommended by your specialist.",
                features: [
                  "Specialist-curated products",
                  "Auto-replenishment",
                  "Digital gift cards",
                  "Loyalty rewards",
                ],
                image:
                  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
            ].map((feature, i) => (
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

      {/* Professional Tools */}
      <section className="py-20 bg-gray-50">
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
                Built for service professionals
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help you succeed
              </p>
            </motion.div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {[
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
                description:
                  "Tools to build and maintain your client relationships.",
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
                description:
                  "Sell products directly to your clients through your profile.",
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
                description: "Data-driven tools to grow your service business.",
                features: [
                  "Revenue tracking",
                  "Client retention metrics",
                  "Service popularity",
                  "Performance benchmarks",
                ],
                image:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
            ].map((feature, i) => (
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

      {/* Business Management */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                SALON MANAGEMENT
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete business solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to run a successful service business
              </p>
            </motion.div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {[
              {
                icon: Users,
                title: "Team Coordination",
                description:
                  "Tools to manage your business staff and operations.",
                features: [
                  "Staff scheduling",
                  "Commission tracking",
                  "Performance reviews",
                  "Shift swapping",
                ],
                image:
                  "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: Package,
                title: "Product Inventory",
                description:
                  "Complete control over your business's retail products.",
                features: [
                  "Stock tracking",
                  "Auto-reordering",
                  "Vendor management",
                  "Sales analytics",
                ],
                image:
                  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: MapPin,
                title: "Multi-Location",
                description:
                  "Manage multiple business locations from one dashboard.",
                features: [
                  "Centralized control",
                  "Location-specific settings",
                  "Cross-location bookings",
                  "Consolidated reporting",
                ],
                image:
                  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: Smile,
                title: "Client Experience",
                description:
                  "Tools to enhance your clients' business experience.",
                features: [
                  "Digital check-ins",
                  "Service customization",
                  "Feedback collection",
                  "Loyalty programs",
                ],
                image:
                  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: CreditCard,
                title: "Financial Tools",
                description: "Complete financial management for your business.",
                features: [
                  "Integrated payments",
                  "Automated payroll",
                  "Expense tracking",
                  "Tax preparation",
                ],
                image:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: Megaphone,
                title: "Marketing Suite",
                description: "Tools to grow your business's client base.",
                features: [
                  "Email campaigns",
                  "SMS marketing",
                  "Social media integration",
                  "Promotions engine",
                ],
                image:
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
            ].map((feature, i) => (
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

      {/* Enterprise Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                ENTERPRISE SOLUTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Scalable solutions for growing businesses
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Custom tools for large service businesses and franchises
              </p>
            </motion.div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {[
              {
                icon: Code,
                title: "API Integration",
                description:
                  "Connect Hairsby with your existing business systems through our robust API.",
                features: [
                  "Full REST API access",
                  "Webhook notifications",
                  "CRM/ERP integration",
                  "Custom workflow automation",
                  "Dedicated developer support",
                ],
                image:
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: Settings,
                title: "White Label Platform",
                description:
                  "Brand our platform as your own with complete customization options.",
                features: [
                  "Custom branding and themes",
                  "Private app stores",
                  "Domain management",
                  "Custom feature development",
                  "Enterprise SLAs",
                ],
                image:
                  "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: Globe,
                title: "Franchise Solutions",
                description:
                  "Tools to manage and grow your service franchise network.",
                features: [
                  "Centralized franchise control",
                  "Location-specific branding",
                  "Standardized operations",
                  "Royalty tracking",
                  "Franchisee performance dashboards",
                ],
                image:
                  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
              {
                icon: BarChart,
                title: "Enterprise Analytics",
                description:
                  "Advanced business intelligence for multi-location operations.",
                features: [
                  "Cross-location reporting",
                  "Custom KPI tracking",
                  "Data warehouse integration",
                  "Predictive analytics",
                  "Executive dashboards",
                ],
                image:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              },
            ].map((feature, i) => (
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
                          <div className="bg-hairsby-orange/10 p-3 rounded-lg">
                            <feature.icon className="w-6 h-6 text-hairsby-orange" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-200">
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
    </>
  );
}
