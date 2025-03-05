"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Code, Handshake, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import PricingPage from "@/app/pricing/page";

const features = [
  {
    icon: Settings,
    title: "Custom Solutions & Integrations",
    description:
      "Tailored beauty and wellness solutions designed to meet the unique needs of your business. Seamlessly integrate our platform with your existing systems for a unified experience.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
  },
  {
    icon: Code,
    title: "API Access & White Labeling",
    description:
      "Access our powerful APIs to build custom applications or white-label our platform under your brand. Empower your business with flexible and scalable technology.",
    image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800",
  },
  {
    icon: Handshake,
    title: "Corporate Partnerships",
    description:
      "Collaborate with us to create exclusive beauty and wellness programs for your employees or customers. Enhance your corporate offerings with our trusted platform.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics & Insights",
    description:
      "Gain deep insights into your business performance with our advanced analytics tools. Track key metrics, optimize operations, and make data-driven decisions to grow your enterprise.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800",
  },
];

const successStories = [
  {
    name: "BeautyCorp",
    location: "New York",
    quote:
      "Hairsby's custom solutions transformed our franchise operations. The platform's scalability and integrations have been a game-changer for our business.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    revenue: "+200%",
    clients: "10,000+",
  },
  {
    name: "Wellness Enterprises",
    location: "San Francisco",
    quote:
      "The API access and white-labeling options allowed us to create a seamless experience for our customers. Hairsby is now a core part of our business strategy.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400",
    revenue: "+150%",
    clients: "5,000+",
  },
];

export default function EnterprisePage() {
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
              Scalable Beauty & Wellness Solutions for Enterprises
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Empower your business with customizable, scalable, and
              enterprise-grade solutions. From custom integrations to advanced
              analytics, we’ve got you covered.
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
              Why Choose Hairsby for Your Enterprise?
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
      <PricingPage />

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
                            Revenue: {story.revenue}
                          </span>
                          <span className="text-yellow-600 font-semibold">
                            Clients: {story.clients}
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
              Ready to Scale Your Business?
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              Join leading enterprises using Hairsby to transform their beauty
              and wellness operations.
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
