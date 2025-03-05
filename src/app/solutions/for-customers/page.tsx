"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Star, Gift } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: Search,
    title: "Find & Book Stylists",
    description:
      "Discover top-rated beauty professionals near you. Browse profiles, read reviews, and book appointments with ease. Our platform ensures you find the perfect stylist for your needs.",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
  },
  {
    icon: Calendar,
    title: "Appointment Management",
    description:
      "Manage your bookings effortlessly. Reschedule or cancel appointments with just a few clicks. Receive reminders and updates to stay on top of your beauty schedule.",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description:
      "Read honest reviews and ratings from other clients. Share your own experiences to help others make informed decisions. Our community-driven approach ensures transparency and trust.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
  },
  {
    icon: Gift,
    title: "Loyalty & Rewards",
    description:
      "Earn rewards for every booking you make. Enjoy exclusive discounts, special offers, and personalized recommendations. Our loyalty program is designed to make your beauty journey even better.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  },
];

const successStories = [
  {
    name: "Emily Carter",
    location: "Los Angeles",
    quote:
      "Hairsby made it so easy to find the perfect stylist for my wedding. The reviews and ratings were spot on, and the booking process was seamless.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bookings: "50+",
    savings: "$500+",
  },
  {
    name: "James Wilson",
    location: "Chicago",
    quote:
      "I love the loyalty rewards program! I’ve saved so much on my regular appointments, and the exclusive offers are a great bonus.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bookings: "30+",
    savings: "$300+",
  },
];

export default function ForClientsPage() {
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
              Discover the Best Beauty Professionals
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Seamless booking, verified professionals, and personalized beauty
              services. Find your perfect stylist and enjoy a hassle-free beauty
              experience.
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
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className=" border-white text-black bg-white/10"
                >
                  Explore
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
              Why Choose Hairsby?
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
      <section className="py-20 bg-background">
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
                            Bookings: {story.bookings}
                          </span>
                          <span className="text-yellow-600 font-semibold">
                            Savings: {story.savings}
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
              Ready to Transform Your Beauty Experience?
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              Join thousands of satisfied clients on Hairsby
            </p>
            <Link href="/services">
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
