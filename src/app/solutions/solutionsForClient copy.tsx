// src/app/(solutions)/page.tsx
"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Scissors,
  Building2,
  Briefcase,
  ArrowRight,
  Check,
  BarChart,
  Shield,
  Zap,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const solutions = [
  {
    icon: Users,
    title: "Client Experience",
    description:
      "Premium booking platform with verified professionals, transparent pricing, and seamless scheduling.",
    href: "/solutions/for-customers",
    features: [
      "Verified professional profiles",
      "Real-time availability",
      "Secure payments",
      "Loyalty rewards",
    ],
    stats: "98% satisfaction rate",
    cta: "Explore Client Platform",
  },
  {
    icon: Scissors,
    title: "Professional Suite",
    description:
      "End-to-end business management tools for independent beauty professionals.",
    href: "/solutions/for-professionals",
    features: [
      "Client management",
      "Smart scheduling",
      "Payment processing",
      "Marketing tools",
    ],
    stats: "30% avg. income increase",
    cta: "View Professional Tools",
  },
  {
    icon: Building2,
    title: "Salon System",
    description:
      "Complete salon management platform for multi-staff locations.",
    href: "/solutions/for-salons",
    features: [
      "Staff scheduling",
      "Inventory management",
      "Business analytics",
      "Multi-location support",
    ],
    stats: "65% revenue growth",
    cta: "Discover Salon Solutions",
  },
  {
    icon: Briefcase,
    title: "Enterprise Solutions",
    description:
      "Custom integrations and white-label platforms for large-scale operations.",
    href: "/solutions/for-businesses",
    features: [
      "API access",
      "White labeling",
      "Custom workflows",
      "Enterprise analytics",
    ],
    stats: "99.9% platform uptime",
    cta: "Contact Enterprise Sales",
  },
];

const platformFeatures = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "End-to-end encryption for all transactions and data",
  },
  {
    icon: BarChart,
    title: "Real-Time Analytics",
    description: "Comprehensive business insights across all platforms",
  },
  {
    icon: Zap,
    title: "Seamless Integrations",
    description: "Connect with existing tools and systems",
  },
  {
    icon: Calendar,
    title: "Unified Scheduling",
    description: "Sync across all user types and locations",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/solutions-bg.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/20 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                HAIRSBY ECOSYSTEM
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Enterprise-Grade Beauty{" "}
                <span className="text-hairsby-orange">Technology</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Comprehensive solutions powering the modern beauty industry from
                individual clients to global enterprises.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600"
              >
                <Link href="#solutions">
                  Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="solutions" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                TAILORED SOLUTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Platform Solutions for Every Need
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized tools designed for each segment of the beauty
                industry
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-gray-200 hover:border-hairsby-orange/30 transition-colors overflow-hidden group">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="bg-hairsby-orange/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-hairsby-orange/20 transition-colors">
                        <solution.icon className="w-8 h-8 text-hairsby-orange" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {solution.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {solution.description}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {solution.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-gray-700"
                            >
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-hairsby-orange">
                            {solution.stats}
                          </span>
                          <Button
                            asChild
                            variant="link"
                            className="text-gray-900 hover:text-hairsby-orange p-0 h-auto"
                          >
                            <Link href={solution.href}>
                              {solution.cta}{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                  CORE PLATFORM
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Unified Technology Infrastructure
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Enterprise-grade foundation powering all Hairsby solutions
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {platformFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white p-8 rounded-xl shadow-sm h-full">
                    <div className="flex items-start gap-4">
                      <div className="bg-hairsby-orange/10 p-2 rounded-lg flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-hairsby-orange" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hairsby-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your beauty business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our solutions team will help you identify the perfect platform
              configuration for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600"
              >
                <Link href="/contact">Contact Solutions Team</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/demo">Request Platform Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
