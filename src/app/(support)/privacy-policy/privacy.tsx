"use client";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hairsby-dark to-hairsby-darker py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center bg-hairsby-orange/90 px-4 py-2 rounded-full mb-6">
              <Lock className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">PRIVACY</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
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
              title: "1. Introduction",
              content:
                "Hairsby ('we,' 'our,' or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
            },
            {
              title: "2. Information We Collect",
              items: [
                "Personal Information: Name, email, phone number, payment details",
                "Usage Data: How you interact with our platform",
                "Device Information: IP address, browser type, OS",
                "Location Data: Approximate or precise location with permission",
              ],
            },
            {
              title: "3. How We Use Your Information",
              items: [
                "Provide, operate, and maintain our services",
                "Process transactions and send related information",
                "Personalize your experience and improve services",
                "Communicate with you for customer service",
                "Detect and prevent fraud and security issues",
                "Comply with legal obligations",
              ],
            },
            {
              title: "4. Data Sharing and Disclosure",
              items: [
                "Service providers assisting with business operations",
                "Business partners for requested services",
                "Legal authorities when required by law",
                "Successors in business transitions",
              ],
              note: "We do not sell your personal information to third parties.",
            },
            {
              title: "5. Data Security",
              content:
                "We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.",
            },
            {
              title: "6. Your Rights",
              items: [
                "Right to access and receive a copy of your data",
                "Right to rectify inaccurate or incomplete data",
                "Right to request deletion of your data",
                "Right to restrict or object to processing",
                "Right to data portability",
              ],
              note: "To exercise these rights, please contact us at privacy@hairsby.com.",
            },
            {
              title: "7. Changes to This Policy",
              content:
                "We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on our website with an updated effective date.",
            },
            {
              title: "8. Contact Us",
              content:
                "If you have questions about this Privacy Policy, please contact us at:\n\nEmail: privacy@hairsby.com\nAddress: Hairsby Ltd, Registered in England and Wales, 16 Ridley Gardens, Swalwell, Newcastle Upon Tyne, NE16 3HT",
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
                <p className="text-gray-700 whitespace-pre-line">
                  {section.content}
                </p>
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
              {section.note && (
                <p className="mt-4 text-gray-600 font-medium">{section.note}</p>
              )}
            </motion.section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
