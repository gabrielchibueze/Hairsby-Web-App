"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  Target,
  Users,
  Globe,
  Award,
  Clock,
  Building2,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {} from "lucide-react";
const stats = [
  { value: "10,000+", label: "Service Professionals" },
  { value: "500K+", label: "Happy Clients" },
  { value: "200+", label: "Cities Served" },
  { value: "98%", label: "Satisfaction Rate" },
];

const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We set the highest standards in professional service delivery",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building connections between professionals and clients",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Driven by our love for the service industry",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Company Founded",
    description:
      "Launched in the UK with a vision to transform professional services",
  },
  {
    year: "2024",
    title: "Platform Launch",
    description: "Released our booking and e-commerce platform",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanded operations to multiple countries",
  },
];

export default function AboutComponent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hairsby-dark text-white overflow-hidden">
        <div className="container relative z-10 py-28">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Redefining Service Experiences
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-gray-300"
            >
              Hairsby connects clients with top service professionals, making
              premium services accessible to everyone.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:200px_200px] opacity-10"></div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-hairsby-orange sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2070&auto=format&fit=crop"
              alt="Our story"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-6 text-gray-600">
              Founded in 2024, Hairsby emerged from a simple idea: service
              services should be accessible, reliable, and exceptional. We
              noticed the challenges both clients and professionals faced in
              connecting and delivering quality experiences.
            </p>
            <p className="mt-4 text-gray-600">
              Today, we're proud to be the UK's fastest-growing service
              platform, serving thousands of clients and empowering service
              professionals to thrive in their craft.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="mt-4 text-gray-600">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-hairsby-orange/10 text-hairsby-orange">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Milestones */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Journey
          </h2>
          <div className="mt-16 relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 md:left-1/2 md:-ml-1"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative mb-12 flex flex-col md:flex-row items-start ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hairsby-orange text-white font-bold text-xl">
                    {milestone.year}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900 ml-12 sm:ml-0">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-gray-600 ml-12 sm:ml-0">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Trust & Compliance
            </motion.h2>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {/* Company Registration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  Registered Company
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Hairsby Ltd, registered in England and Wales
                </p>
                <p className="mt-1 text-sm font-mono text-gray-900">
                  Company No. 16063522
                </p>
              </motion.div>

              {/* Data Protection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mx-auto">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  Data Protection
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  GDPR compliant with strict privacy policies to protect your
                  information
                </p>
              </motion.div>

              {/* Verified Professionals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mx-auto">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  Verified Professionals
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  All professionals undergo strict verification and
                  qualification checks
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      {/* <section className="py-20 bg-hairsby-dark text-white"> */}
      <section className="py-20 bg-gradient-to-br from-hairsby-dark to-hairsby-dark/90 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">Join the Service Revolution</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Whether you're a service professional or seeking services, we have
            the perfect solution for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="brand" asChild>
              <a href="/signup">Get Started</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-gray-900 border-white hover:bg-white/10 hover:text-gray-50"
              asChild
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
