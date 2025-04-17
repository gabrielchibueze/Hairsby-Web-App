"use client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Lock,
  AlertCircle,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SafetyGuidelines() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hairsby-dark to-gray-500 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center bg-hairsby-orange/90 px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">SAFETY</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Safety is Our Priority
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              At Hairsby, we're committed to creating a secure environment for
              both clients and service providers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <BadgeCheck className="w-10 h-10 text-green-500" />,
                title: "Verified Professionals",
                content:
                  "Every stylist and salon on our platform undergoes a rigorous verification process including license checks and portfolio review.",
              },
              {
                icon: <Lock className="w-10 h-10 text-blue-500" />,
                title: "Secure Payments",
                content:
                  "All transactions are encrypted with bank-level security. Your payment information is never stored on our servers.",
              },
              {
                icon: <AlertCircle className="w-10 h-10 text-amber-500" />,
                title: "24/7 Support",
                content:
                  "Our safety team is available around the clock to address any concerns or incidents.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Safety Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-hairsby-orange text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    1
                  </span>
                  For Clients
                </h3>
                <ul className="space-y-3">
                  {[
                    "Always verify your professional's credentials on their profile",
                    "Meet in professional salon spaces when possible",
                    "Report any inappropriate behavior immediately",
                    "Use our in-app messaging for all communications",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-hairsby-orange text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    2
                  </span>
                  For Professionals
                </h3>
                <ul className="space-y-3">
                  {[
                    "Keep your certifications and licenses up to date",
                    "Maintain a clean, professional workspace",
                    "Use proper sanitation protocols for all tools",
                    "Report any client safety concerns immediately",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hygiene Standards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Hygiene Standards
            </h2>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Tool Sanitation",
                    content:
                      "All tools must be sterilized between clients using hospital-grade disinfectants or autoclaves.",
                  },
                  {
                    title: "Clean Workspaces",
                    content:
                      "Work areas must be cleaned with EPA-approved disinfectants before and after each appointment.",
                  },
                  {
                    title: "Personal Protection",
                    content:
                      "Gloves and masks must be available and used when appropriate for the service.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Incident Reporting */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Report a Safety Concern
            </h2>
            <div className="bg-red-50 border border-red-100 rounded-xl p-8">
              <div className="max-w-2xl mx-auto text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Your Safety Matters
                </h3>
                <p className="text-gray-600 mb-6">
                  If you experience or witness any behavior that violates our
                  safety policies, please report it immediately. All reports are
                  confidential.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="tel:+447789779444">
                    <Button variant="destructive" className="gap-2">
                      <Phone className="w-4 h-4" />
                      Emergency Hotline
                    </Button>
                  </Link>
                  <Link href="mailto:support@hairsby.com">
                    <Button variant="outline" className="gap-2">
                      <Mail className="w-4 h-4" />
                      Email Safety Team
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Verification Process
            </h2>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="relative">
                <div className="space-y-8">
                  {[
                    {
                      title: "License Verification",
                      content:
                        "We validate all professional licenses with state boards",
                    },
                    {
                      title: "Background Check",
                      content:
                        "Comprehensive screening including criminal records",
                    },
                    {
                      title: "Portfolio Review",
                      content:
                        "Assessment of professional work quality and hygiene standards",
                    },
                    {
                      title: "Ongoing Monitoring",
                      content: "Regular review of ratings and client feedback",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-hairsby-orange text-white flex items-center justify-center">
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <div className="w-0.5 h-full bg-gray-300 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h3 className="font-semibold text-lg mb-1">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
