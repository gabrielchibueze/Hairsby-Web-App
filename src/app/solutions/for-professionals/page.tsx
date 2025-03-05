"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, Star, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const benefits = [
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description:
      "Take control of your work-life balance with our flexible scheduling tools. Set your availability, manage appointments, and work when it suits you best. Whether you're a full-time professional or a part-time stylist, our platform adapts to your needs.",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
  },
  {
    icon: DollarSign,
    title: "Earn More",
    description:
      "Maximize your earnings with our competitive rates and transparent pricing. Keep more of what you earn by reducing overhead costs and streamlining your operations. Our platform helps you attract high-paying clients and grow your income.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800",
  },
  {
    icon: Users,
    title: "Grow Your Client Base",
    description:
      "Expand your reach and connect with a large pool of potential clients. Our platform provides tools to showcase your work, attract new customers, and build lasting relationships. Grow your client base and take your business to new heights.",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800",
  },
  {
    icon: Star,
    title: "Build Your Brand",
    description:
      "Create a professional profile that highlights your skills, experience, and portfolio. Showcase your unique style and attract clients who appreciate your work. Build a strong personal brand and stand out in the competitive beauty industry.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
  },
  {
    icon: Shield,
    title: "Professional Support",
    description:
      "Get access to expert support for licensing, insurance, and business growth. Our team is here to help you navigate the challenges of running a beauty business. Focus on what you do best while we handle the rest.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
  },
  {
    icon: Zap,
    title: "Smart Tools",
    description:
      "Simplify your workflow with our smart tools for booking, payments, and client management. Automate repetitive tasks, track your earnings, and stay organized. Spend less time on admin and more time doing what you love.",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800",
  },
];

const services = [
  "Hair Styling",
  "Barbering",
  "Nail Care",
  "Skincare",
  "Makeup",
  "Massage",
  "Spa Services",
  "Tattoo & Wellness",
];

const successStories = [
  {
    name: "Sarah Thompson",
    location: "New York",
    quote:
      "My client base has grown by 200% since joining Hairsby. The platform's tools make managing my business effortless.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    earnings: "+300%",
    clients: "150+",
  },
  {
    name: "Marcus Rodriguez",
    location: "Miami",
    quote:
      "The flexibility and professional tools have transformed my career. I'm now earning more while working less.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    earnings: "+250%",
    clients: "200+",
  },
];

export default function ForProfessionalsAndStylistsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-purple-600 to-indigo-600">
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
              Take Your Beauty Career to the Next Level
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of successful beauty professionals and grow
              your business with Hairsby. Streamline your operations, increase
              bookings, and achieve your goals with our all-in-one platform.
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

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Hairsby?
            </h2>
            <div className="space-y-16">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
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
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="w-full md:w-1/2">
                    <div className="flex flex-col items-start">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-purple-100">
                        <benefit.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {benefit.description}
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

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Services You Can Offer
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <span className="font-medium">{service}</span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-bg">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{story.name}</h3>
                        <p className="text-gray-600 mb-2">{story.location}</p>
                        <div className="flex gap-4 mb-2">
                          <span className="text-purple-600 font-semibold">
                            Earnings {story.earnings}
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
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              Join thousands of successful beauty professionals on Hairsby
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-foreground"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
