"use client";
import { motion } from "framer-motion";
import { ChevronUp, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HairsbyLogo } from "../logo";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    // { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Hair Styling", href: "/services/?category=hair" },
    { name: "Makeup", href: "/services/?category=makeup" },
    { name: "Nails", href: "/services/?category=nails" },
    { name: "Skincare", href: "/services/?category=skincare" },
    { name: "Spa", href: "/services/?category=spa" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Safety Guidelines", href: "/safety-guidelines" },
    { name: "Terms of Service", href: "/terms-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Cookie Policy", href: "/cookies-policy" },
  ],
  Solutions: [
    { name: "Features", href: "/solutions" },
    { name: "For Customers", href: "/solutions/for-customers" },
    { name: "For Businesses", href: "/solutions/for-businesses" },
    { name: "For Professionals", href: "/solutions/for-professionals" },
    { name: "For Salons", href: "/solutions/for-salons" },
    // { name: "Partner Program", href: "/partners" },
    // { name: "Business Blog", href: "/business/blog" },
    { name: "Pricing", href: "/pricing" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
    // pathname.startsWith("/provider")
  ) {
    return;
  }
  if (pathname.startsWith("/solutions")) {
    return;
  }

  return (
    <footer className="bg-white">
      {/* Main Footer - Dark background version */}
      <div className="bg-hairsby-dark text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <HairsbyLogo type="white" width={120} height={35} />

              <p className="mt-4 max-w-96">
                Connecting beauty professionals with customers. Book
                appointments, discover new styles, and transform your look with
                Hairsby.
              </p>
              <div className="mt-6 flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61572027778041"
                  target="_blank"
                  className="hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/hairsby_platform"
                  target="_blank"
                  className="hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/hairsby_limited"
                  target="_blank"
                  className="hover:text-white"
                >
                  <FaXTwitter className="h-5 w-5" />
                </a>
                <a
                  href="https://tiktok.com/@hairsby"
                  target="_blank"
                  className="hover:text-white"
                >
                  <FaTiktok className="h-5 w-5" />
                </a>
              </div>
            </motion.div>

            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold mb-3 text-white">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <ul className="space-y-1.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-white text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h5 className="font-semibold mb-2 text-white">
                  Payment System:
                </h5>
                <div className="flex space-x-3">
                  <img
                    src="https://via.placeholder.com/40x25"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="https://via.placeholder.com/40x25"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="https://via.placeholder.com/40x25"
                    alt="Amex"
                    className="h-8"
                  />
                  <img
                    src="https://via.placeholder.com/40x25"
                    alt="PayPal"
                    className="h-8"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end">
                <p className="text-sm mb-2">
                  Copyright & Design {new Date().getFullYear()}{" "}
                  <a href="#" className="text-hairsby-orange">
                    ©Hairsby
                  </a>
                  . All Right Reserved
                </p>
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center w-10 h-10 bg-hairsby-orange text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
              </div>
            </div>
          </div> */}

          <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h5 className="font-semibold mb-2 text-white">
                  Payment System:
                </h5>
                <div className="flex space-x-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    className="h-8 w-auto"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-8 w-auto"
                  />

                  {/* ... other payment methods */}
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end space-y-2">
                <p className="text-sm">
                  Copyright & Design {new Date().getFullYear()}{" "}
                  <a href="#" className="text-hairsby-orange">
                    ©Hairsby
                  </a>
                  . All Rights Reserved
                </p>
                <p className="text-xs text-gray-400">
                  Hairsby Ltd is a registered company in England and Wales (No.
                  16063522)
                </p>
                {/* <p className="text-xs text-gray-400 mt-1">
                  VAT Registration No. [No VAT Applicable at the mommebt]
                </p> */}
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center w-10 h-10 bg-hairsby-orange text-white rounded-full hover:bg-orange-600 transition-colors mt-2"
                >
                  <ChevronUp size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
