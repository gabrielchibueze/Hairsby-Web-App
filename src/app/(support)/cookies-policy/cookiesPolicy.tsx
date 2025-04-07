"use client";
import { motion } from "framer-motion";
import { Cookie, Check } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CookiesPolicy() {
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
              <Cookie className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">COOKIES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cookies Policy
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
              title: "1. What Are Cookies",
              content:
                "Cookies are small text files stored on your device when you visit websites. They help the website remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.",
            },
            {
              title: "2. How We Use Cookies",
              items: [
                "Essential Cookies: Necessary for the website to function properly",
                "Performance Cookies: Help us understand how visitors use our site",
                "Functionality Cookies: Remember your preferences and settings",
                "Targeting/Advertising Cookies: Used to deliver relevant ads",
              ],
            },
            {
              title: "3. Types of Cookies We Use",
              table: [
                {
                  name: "session_id",
                  purpose: "Maintain user session",
                  duration: "Session",
                },
                {
                  name: "preferences",
                  purpose: "Store user preferences",
                  duration: "1 year",
                },
                {
                  name: "_ga",
                  purpose: "Google Analytics",
                  duration: "2 years",
                },
              ],
            },
            {
              title: "4. Managing Cookies",
              content:
                "You can control and/or delete cookies as you wish. You can delete all cookies already on your computer and set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.\n\nTo manage cookies in your browser, consult your browser's help documentation.",
            },
            {
              title: "5. Third-Party Cookies",
              items: [
                "Google Analytics for website analytics",
                "Advertising networks for targeted ads",
                "Social media platforms for integration features",
              ],
              note: "We do not control these third-party cookies. Please refer to the respective privacy policies of these providers for more information.",
            },
            {
              title: "6. Changes to This Policy",
              content:
                "We may update this Cookies Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.",
            },
            {
              title: "Contact Us",
              content:
                "If you have questions about our use of cookies, please contact us at privacy@hairsby.com.",
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
              {section.table && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium">
                          Cookie Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Purpose
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{row.name}</td>
                          <td className="py-3 px-4">{row.purpose}</td>
                          <td className="py-3 px-4">{row.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
