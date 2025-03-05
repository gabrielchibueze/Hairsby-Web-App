"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Users,
  Calendar,
  Shield,
  CreditCard,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import PricingPage from "../../pricing/page";
import Link from "next/link";

// const features = [
//   {
//     icon: BarChart,
//     title: "Business Analytics",
//     description: "Track your salon's performance with detailed analytics",
//     image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
//   },
//   {
//     icon: Users,
//     title: "Staff Management",
//     description: "Efficiently manage your team and schedules",
//     image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800",
//   },
//   {
//     icon: Calendar,
//     title: "Smart Scheduling",
//     description: "Automated booking system for your salon",
//     image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800",
//   },
//   {
//     icon: Shield,
//     title: "Secure Platform",
//     description: "Protected payments and data security",
//     image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800",
//   },
//   {
//     icon: CreditCard,
//     title: "Payment Solutions",
//     description: "Integrated payment processing system",
//     image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800",
//   },
//   {
//     icon: Zap,
//     title: "Marketing Tools",
//     description: "Grow your customer base effectively",
//     image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800",
//   },
// ];

const features = [
  {
    icon: BarChart,
    title: "Business Analytics",
    description:
      "Gain deep insights into your salon's performance with our advanced analytics tools. Track key metrics like revenue, customer retention, and staff productivity. Make data-driven decisions to optimize your operations and grow your business.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Efficiently manage your team with our intuitive staff management tools. Assign roles, track attendance, and monitor performance. Simplify scheduling and ensure your salon runs smoothly with real-time updates and notifications.",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Streamline your booking process with our automated scheduling system. Allow customers to book appointments online 24/7, and receive instant confirmations. Reduce no-shows with automated reminders and optimize your calendar for maximum efficiency.",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Protect your salon's sensitive data with our secure platform. We use industry-leading encryption and security protocols to safeguard payments and customer information. Focus on growing your business while we handle the security.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800",
  },
  {
    icon: CreditCard,
    title: "Payment Solutions",
    description:
      "Offer your customers a seamless payment experience with our integrated payment processing system. Accept credit cards, digital wallets, and split payments. Simplify transactions and improve cash flow with fast, secure payments.",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800",
  },
  {
    icon: Zap,
    title: "Marketing Tools",
    description:
      "Grow your customer base with our powerful marketing tools. Create targeted campaigns, send personalized promotions, and track results in real-time. Attract new clients and retain loyal customers with ease.",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800",
  },
];
const testimonials = [
  {
    name: "Luxe Hair Studio",
    location: "New York",
    quote:
      "Our bookings increased by 200% within the first three months of using Hairsby.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    revenue: "+150%",
    clients: "500+",
  },
  {
    name: "Elite Cuts",
    location: "Los Angeles",
    quote:
      "The platform's comprehensive tools have streamlined our entire operation.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
    revenue: "+180%",
    clients: "800+",
  },
];

export default function ForSalonAndBusinessPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section className="relative py-32 bg-gradient-to-r from-yellow-600 to-indigo-600">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Transform Your Salon Business
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Streamline operations, increase bookings, and grow your salon with
              our all-in-one platform designed for success.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className=" border-white text-black bg-white/10"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="space-y-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="w-full md:w-1/2">
                    <div className="flex flex-col items-start">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-purple-100">
                        <feature.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {feature.description}
                      </p>
                      <Link href="/pricing">
                        <Button
                          variant="outline"
                          className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{story.name}</h3>
                      <p className="text-gray-600 mb-2">{story.location}</p>
                      <div className="flex gap-4 mb-2">
                        <span className="text-purple-600 font-semibold">
                          Revenue {story.revenue}
                        </span>
                        <span className="text-yellow-600 font-semibold">
                          {story.clients} Clients
                        </span>
                      </div>
                      <p className="text-gray-600">{story.quote}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <PricingPage />
      </section>

      {/* CTA Section */}
    </div>
  );
}
