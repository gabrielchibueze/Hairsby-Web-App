import { HairsbyLogo } from "@/components/general/logo";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hairsby Solutions",
  description:
    "Discover Hairsby solutions for clients, professionals, salons, and businesses",
};

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/solutions/for-customers", label: "For Customers" },
  { href: "/solutions/for-professionals", label: "For Professionals" },
  { href: "/solutions/for-salons", label: "For Salons" },
  { href: "/solutions/businesses", label: "For Businesses" },
];

const FOOTER_LINKS = {
  clients: [
    { href: "/services", label: "Book Services" },
    { href: "/products", label: "Find Products" },
    { href: "/help", label: "FAQ" },
  ],
  professionals: [
    { href: "/signup?account=specialist", label: "Join as Pro" },
    { href: "/pricing", label: "Pricing" },
    { href: "/solutions", label: "Resources" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-hairsby-dark text-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            <HairsbyLogo type="white" className="h-8" />

            <nav className="hidden md:flex gap-6 lg:gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-hairsby-orange transition-colors duration-200 text-sm lg:text-base"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex gap-2 sm:gap-4">
              <a href="/login">
                <Button
                  variant="outline"
                  className="border-white text-gray-700 hover:text-white hover:bg-white/10 text-sm sm:text-base"
                  size="sm"
                >
                  Login
                </Button>
              </a>
              <a href="/signup">
                <Button
                  className="bg-hairsby-orange hover:bg-amber-600 text-sm sm:text-base"
                  size="sm"
                >
                  Sign Up
                </Button>
              </a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-hairsby-dark text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <HairsbyLogo type="white" width={120} height={35} />
              <p className="text-gray-400 mt-4">
                Connecting service professionals with clients worldwide
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">For Clients</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.clients.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">
                For Professionals
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.professionals.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {currentYear} Hairsby. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
