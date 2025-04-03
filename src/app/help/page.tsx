"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/navbar cop";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I book a service?",
    answer:
      "Booking a service is easy! Simply browse through our available services, select your preferred service and provider, choose a convenient time slot, and complete the booking process. You can pay securely through our platform.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Our cancellation policy varies by provider. Generally, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges. Please check the specific provider's policy during booking.",
  },
  {
    question: "How do I become a service provider?",
    answer:
      "To become a service provider, click on the 'For Professionals' link and complete the registration process. You'll need to provide your professional details, certifications, and complete our verification process.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Yes, all payments are processed securely through our platform using industry-standard encryption. We support various payment methods including credit cards and digital wallets.",
  },
];

const categories = [
  {
    title: "Getting Started",
    icon: "🚀",
    description: "Everything you need to know about using Hairsby",
  },
  {
    title: "Booking & Appointments",
    icon: "📅",
    description: "Learn about booking services and managing appointments",
  },
  {
    title: "Payments & Refunds",
    icon: "💳",
    description: "Information about payments, pricing, and refund policies",
  },
  {
    title: "For Professionals",
    icon: "💼",
    description: "Resources for service providers and businesses",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">
                How can we help?
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Search our help center or browse categories below
              </p>
              <div className="mt-8 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-lg border bg-card p-6 text-card-foreground">
                  <div className="text-3xl">{category.icon}</div>
                  <h3 className="mt-4 font-semibold">{category.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="mt-8">
              <Accordion type="single" collapsible>
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Still need help?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our support team is here to assist you
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/chat">Live Chat</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
