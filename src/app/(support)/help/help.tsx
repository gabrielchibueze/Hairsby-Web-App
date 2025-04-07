// src/app/help/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MessageSquare,
  Calendar,
  CreditCard,
  User,
  Check,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function HelpComponent() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      icon: <MessageSquare className="w-6 h-6 text-hairsby-orange" />,
      description: "Everything you need to know about using Hairsby",
      color: "bg-blue-50",
    },
    {
      title: "Booking & Appointments",
      icon: <Calendar className="w-6 h-6 text-hairsby-orange" />,
      description: "Learn about booking services and managing appointments",
      color: "bg-purple-50",
    },
    {
      title: "Payments & Refunds",
      icon: <CreditCard className="w-6 h-6 text-hairsby-orange" />,
      description: "Information about payments, pricing, and refund policies",
      color: "bg-green-50",
    },
    {
      title: "For Professionals",
      icon: <User className="w-6 h-6 text-hairsby-orange" />,
      description: "Resources for service providers and businesses",
      color: "bg-amber-50",
    },
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click 'Sign Up' in the top navigation and follow the registration process. You'll need to provide your name, email address, and create a password.",
      category: "Getting Started",
    },
    {
      question: "How do I book an appointment?",
      answer:
        "Navigate to the salon or service provider you want to book with, select your preferred service, choose an available time slot, and complete the booking process.",
      category: "Booking & Appointments",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Our cancellation policy varies by provider. Generally, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges.",
      category: "Booking & Appointments",
    },
    {
      question: "How do I become a service provider?",
      answer:
        "To become a service provider, click on the 'For Professionals' link and complete the registration process. You'll need to provide your professional details, certifications, and complete our verification process.",
      category: "For Professionals",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, all payments are processed securely through our platform using industry-standard encryption. We support various payment methods including credit cards and digital wallets.",
      category: "Payments & Refunds",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, PayPal, and select mobile payment options depending on your region.",
      category: "Payments & Refunds",
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq: any) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hairsby-dark to-hairsby-darker py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help?
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Search our help center or browse categories below
            </p>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-900" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-gray-900 focus:ring-hairsby-orange flex-grow border-t border-b border-gray-200   focus:outline-none focus:ring-1 transition-all duration-200"
              />
              <Link href="#faq">
                <ArrowRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-900 cursor-pointer hover:text-hairsby-orange" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Browse by Category
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`#${category.title.split(" ").join("-")}`}>
                    <div
                      className={`${category.color} cursor-pointer p-6 rounded-xl border border-gray-100 h-full hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm mb-4">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50" id="faq">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="mb-4 bg-white rounded-lg border border-gray-200 px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-hairsby-orange/10 flex items-center justify-center mr-4">
                          <Check className="w-4 h-4 text-hairsby-orange" />
                        </div>
                        <span
                          className="text-left font-medium"
                          id={`${faq.category.split(" ").join("-")}`}
                        >
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-14 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Still need help?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Our support team is here to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support/chat">
                <Button
                  size="lg"
                  className="bg-hairsby-orange hover:bg-amber-600 gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Live Chat
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
