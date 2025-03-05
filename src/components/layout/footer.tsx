"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Hair Styling", href: "/services/hair" },
    { name: "Makeup", href: "/services/makeup" },
    { name: "Nails", href: "/services/nails" },
    { name: "Skincare", href: "/services/skincare" },
    { name: "Spa", href: "/services/spa" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Safety", href: "/safety" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  business: [
    { name: "For Businesses", href: "/for-business" },
    { name: "For Professionals", href: "/for-professionals" },
    { name: "For Salons", href: "/for-salons" },
    { name: "Partner Program", href: "/partners" },
    { name: "Business Blog", href: "/business/blog" },
    // { name: "Success Stories", href: "/success-stories" }
    { name: "Pricing", href: "/pricing" },
  ],
};

export function Footer() {
  const path = usePathname();
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/provider")
  ) {
    return (
      <div className="mt-8 mb-8 border-t pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hairsby. All rights reserved.
        </p>
      </div>
    );
  }
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="text-2xl font-bold">
              Hairsby
            </Link>
            <p className="mt-4 text-muted-foreground">
              Connecting beauty professionals with customers. Book appointments,
              discover new styles, and transform your look with Hairsby.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
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
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hairsby. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
