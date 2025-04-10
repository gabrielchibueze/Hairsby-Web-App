"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Settings,
  Handshake,
  BarChart,
  Globe,
  Cpu,
  Star,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const solutions = [
  {
    icon: Code,
    title: "API & Integrations",
    description:
      "Connect our platform with your existing systems via our robust API",
    stat: "99.9% API uptime",
    image: "/images/business-api.jpg",
  },
  {
    icon: Settings,
    title: "White Label Solutions",
    description:
      "Brand our platform as your own with custom domains and styling",
    stat: "Full white labeling",
    image: "/images/business-white-label.jpg",
  },
  {
    icon: Handshake,
    title: "Enterprise Partnerships",
    description:
      "Custom solutions for franchises, resorts, and corporate wellness",
    stat: "50+ enterprise clients",
    image: "/images/business-partnerships.jpg",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Enterprise-grade reporting and business intelligence",
    stat: "Real-time insights",
    image: "/images/business-analytics.jpg",
  },
];
const businessClientFeatures = [
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
    description: "Tools to manage and grow your beauty franchise network.",
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
];
const testimonials = [
  {
    name: "BeautyCorp International",
    type: "Franchise",
    quote:
      "Hairsby's enterprise platform allowed us to standardize operations across 120+ locations with custom workflows.",
    image: "/images/business-testimonial-1.jpg",
    locations: "120+ locations",
  },
  {
    name: "Luxury Resorts Group",
    type: "Hospitality",
    quote:
      "The white label solution integrated perfectly with our guest experience platform. Our spa revenue increased by 40%.",
    image: "/images/business-testimonial-2.jpg",
    locations: "25 resorts",
  },
  {
    name: "Urban Wellness Collective",
    type: "Corporate Wellness",
    quote:
      "The API integration with our HR system was seamless. Employee engagement with our beauty benefits doubled.",
    image: "/images/business-testimonial-3.jpg",
    locations: "10,000+ employees",
  },
];

export default function ForBusinessesClient() {
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
                  Enterprise{" "}
                  <span className="text-hairsby-orange">beauty & wellness</span>{" "}
                  solutions
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Scalable platforms and custom integrations for businesses of
                  all sizes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                    asChild
                  >
                    <Link href="/contact">Request a Demo</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-gray-900 hover:text-white hover:bg-white/10"
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
                        src={`/images/business-avatar-${i + 1}.jpg`}
                        alt="Enterprise"
                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                      />
                    ))}
                  </div>
                  <div className="text-gray-300">
                    <p className="font-medium">Trusted by global brands</p>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>20+ countries</span>
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
                  src="/images/hero-business.jpg"
                  alt="Enterprise team"
                  className="rounded-xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Cpu className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">99.9% platform uptime</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 bg-white">
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
                  Built for scale and flexibility
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Custom solutions tailored to your business needs
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {solutions.map((solution, i) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <div className="w-full md:w-1/3 aspect-square overflow-hidden rounded-xl">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                        <solution.icon className="w-5 h-5 text-hairsby-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {solution.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">{solution.description}</p>
                    <p className="text-sm font-medium text-hairsby-orange">
                      {solution.stat}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise and Business Solutions */}
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
                  Custom tools for large beauty businesses and franchises
                </p>
              </motion.div>
            </div>

            <div className="space-y-12 md:space-y-16">
              {businessClientFeatures.map((feature, i) => (
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
        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                ENTERPRISE SUCCESS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Businesses scaling with Hairsby
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
                          {testimonial.type}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {testimonial.locations}
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
              Ready to discuss enterprise solutions?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our team will build a custom solution for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600 text-lg"
                asChild
              >
                <Link href="/contact/enterprise">Contact Sales</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                asChild
              >
                <Link href="/case-studies">View Case Studies</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
