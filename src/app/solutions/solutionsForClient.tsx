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
  MessageSquare,
  MapPin,
  Calendar,
  ShoppingCart,
  Smartphone,
  Shield,
  BarChart,
  Zap,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import a from "next/link";
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
      "End-to-end business management tools for independent service professionals.",
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
    title: "Business System",
    description:
      "Complete business management platform for multi-staff locations.",
    href: "/solutions/for-salons",
    features: [
      "Staff scheduling",
      "Inventory management",
      "Business analytics",
      "Multi-location support",
    ],
    stats: "65% revenue growth",
    cta: "Discover Business Solutions",
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
    cta: "Explore Enterprise Solutions",
  },
];
const platformFeatures = [
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description:
      "Secure real-time communication between clients and professionals",
    benefits: [
      "Instant booking confirmations",
      "Service requirement discussions",
      "After-care follow ups",
      "Encrypted for privacy",
    ],
  },
  {
    icon: MapPin,
    title: "Location-Based Booking",
    description: "Find and book nearby professionals with our interactive map",
    benefits: [
      "Real-time availability",
      "Distance filters",
      "Business/service locations",
      "Mobile-optimized",
    ],
  },
  {
    icon: Calendar,
    title: "Booking Management",
    description: "Complete appointment lifecycle tools",
    benefits: [
      "Automated reminders",
      "Rescheduling options",
      "Multi-service bookings",
      "Calendar sync",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Service Marketplace",
    description: "Integrated e-commerce for professionals and clients",
    benefits: [
      "Product sales",
      "Service packages",
      "Digital gift cards",
      "Inventory management",
    ],
  },
];

const mobileAppFeatures = [
  {
    icon: Smartphone,
    title: "Hairsby Mobile App",
    description: "Full platform functionality on iOS and Android",
    highlights: [
      "On-the-go bookings",
      "Push notifications",
      "Mobile payments",
      "Offline access",
    ],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level protection for all transactions",
    highlights: [
      "End-to-end encryption",
      "Biometric login",
      "PCI compliance",
      "Data backups",
    ],
  },
  {
    icon: BarChart,
    title: "Business Analytics",
    description: "Real-time performance insights",
    highlights: [
      "Revenue tracking",
      "Client retention",
      "Service popularity",
      "Staff performance",
    ],
  },
  {
    icon: Zap,
    title: "Smart Automation",
    description: "Time-saving tools for professionals",
    highlights: [
      "AI scheduling",
      "Automated follow-ups",
      "Smart inventory",
      "Marketing campaigns",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* <Image
            src="/hairsby-handwritten.png"
            alt=""
            fill
            className="object-cover"
          /> */}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/20 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                END-TO-END SERVICE PLATFORM
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                The Complete{" "}
                <span className="text-hairsby-orange">Service Ecosystem</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Integrated solutions connecting clients, professionals, and
                businesses through seamless technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="brand">
                  <a href="#features">
                    Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                >
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                CORE FEATURES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Integrated Platform Capabilities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive tools designed for the modern service industry
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
                <Card className="h-full border-gray-200 hover:border-hairsby-orange/30 transition-colors overflow-hidden group">
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="bg-hairsby-orange/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-hairsby-orange/20 transition-colors">
                        <feature.icon className="w-8 h-8 text-hairsby-orange" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-3 pl-4">
                      {feature.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="solutions" className="py-20 bg-hairsby-dark text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/20 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                TAILORED SOLUTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Platform Solutions for Every Need
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Specialized tools designed for each segment of the service
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
                <Card className="h-full bg-gray-800 border-gray-700 hover:border-hairsby-orange/50 transition-colors overflow-hidden group">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="bg-hairsby-orange/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-hairsby-orange/20 transition-colors">
                        <solution.icon className="w-8 h-8 text-hairsby-orange" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          {solution.title}
                        </h3>
                        <p className="text-gray-300 mb-4">
                          {solution.description}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {solution.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-gray-200"
                            >
                              <Check className="w-4 h-4 text-green-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between ">
                          <span className="text-sm font-medium text-hairsby-orange">
                            {solution.stats}
                          </span>
                          <Button
                            asChild
                            variant="link"
                            className="text-white hover:text-hairsby-orange p-0 h-auto"
                          >
                            <a href={solution.href}>
                              {solution.cta}{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
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
      {/* Mobile App Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                MOBILE EXPERIENCE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hairsby <span className="text-hairsby-orange">Mobile App</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Full platform functionality available on iOS and Android
                devices.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {mobileAppFeatures.map((feature, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                        <feature.icon className="w-5 h-5 text-hairsby-orange" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {feature.description}
                    </p>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, j) => (
                        <li
                          key={j}
                          className="text-xs text-gray-500 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-green-500" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-gray-900 hover:bg-gray-800">
                  <a href="#">
                    <Image
                      src="/images/app-store.svg"
                      alt="App Store"
                      width={120}
                      height={40}
                    />
                  </a>
                </Button>
                <Button asChild className="bg-gray-900 hover:bg-gray-800">
                  <a href="#">
                    <Image
                      src="/images/play-store.svg"
                      alt="Play Store"
                      width={120}
                      height={40}
                    />
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative"
            >
              <div className="relative aspect-[0.6] max-w-md mx-auto">
                <Image
                  src="/images/app-screens.png"
                  alt="Hairsby mobile app screens"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Tools */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/10 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                BUSINESS SOLUTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Professional-Grade Management Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything service professionals need to grow their business
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Booking Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Appointment Management
                  </h3>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Real-time booking calendar
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Automated client reminders
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Resource allocation tools
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Waitlist management</span>
                  </li>
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
                >
                  <a href="/solutions/for-professionals">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            </motion.div>

            {/* Marketplace */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Service Marketplace</h3>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Product catalog management
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Integrated e-commerce</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Digital product sales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Inventory synchronization
                    </span>
                  </li>
                </ul>
                {/* <Button
                  asChild
                  variant="outline"
                  className="border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
                >
                  <a href="/marketplace">
                    Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button> */}
              </Card>
            </motion.div>

            {/* Location Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Location Services</h3>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Geo-targeted service discovery
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Business location management
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Mobile service tracking
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Area-specific promotions
                    </span>
                  </li>
                </ul>
                {/* <Button
                  asChild
                  variant="outline"
                  className="border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
                >
                  <a href="/location-services">
                    View Map Features <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button> */}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hairsby-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Complete Platform?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of service professionals and clients using
              Hairsby's integrated ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-600"
              >
                <a href="/signup">Get Started</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-gray-900 hover:text-white hover:bg-white/10"
              >
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
