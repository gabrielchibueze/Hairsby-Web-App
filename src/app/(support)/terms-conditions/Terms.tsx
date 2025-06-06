// src/app/terms-conditions/page.tsx
"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Check } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hairsby-dark to-gray-500 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center bg-hairsby-orange/90  px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">LEGAL</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {[
            {
              title: "1. Acceptance of Terms",
              content:
                "By accessing or using the Hairsby platform ('Service'), you agree to be bound by these Terms & Conditions ('Terms'). If you disagree with any part of these Terms, you may not access the Service.",
            },
            {
              title: "2. Service Description",
              content:
                "Hairsby provides an online platform that connects customers with professional service providers. We facilitate bookings but are not a party to the actual service provision between customers and providers.",
            },
            {
              title: "3. User Accounts",
              items: [
                "Provide accurate and complete information",
                "Maintain the security of your account credentials",
                "Be responsible for all activities under your account",
                "Notify us immediately of any unauthorized use",
              ],
            },
            {
              title: "4. Booking and Payments",
              items: [
                "Bookings are subject to provider availability",
                "Prices are set by providers and may change without notice",
                "We accept various payment methods as indicated at checkout",
                "Cancellation policies vary by provider",
                "Refunds are processed according to provider policies",
              ],
            },
            {
              title: "5. User Conduct",
              items: [
                "Use the Service for any unlawful purpose",
                "Post false, misleading, or harmful content",
                "Harass or harm other users or providers",
                "Attempt to gain unauthorized access to our systems",
                "Interfere with the proper working of the Service",
              ],
            },
            {
              title: "6. Intellectual Property",
              content:
                "All content on the Hairsby platform, including text, graphics, logos, and software, is our property or the property of our licensors and is protected by intellectual property laws.",
            },
            {
              title: "7. Limitation of Liability",
              content:
                "Hairsby shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.",
            },
            {
              title: "8. Modifications to Terms",
              content:
                "We reserve the right to modify these Terms at any time. Continued use after changes constitutes acceptance of the modified Terms.",
            },
            {
              title: "9. Governing Law",
              content:
                "These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
            },
          ].map((section, index) => (
            <motion.section
              key={index}
              variants={fadeIn}
              className="mb-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-4 text-hairsby-dark">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-gray-700">{section.content}</p>
              )}
              {section.items && (
                <ul className="space-y-3 mt-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
