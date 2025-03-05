"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/contexts/auth.context";

// Data arrays remain the same
const productCategories = [
  {
    name: "Hair Care",
    href: "/products?category=hair-care",
    description: "Shampoos, conditioners, and treatments for healthy hair",
  },
  {
    name: "Styling Tools",
    href: "/products?category=styling-tools",
    description:
      "Professional tools like hair dryers, straighteners, and curling irons",
  },
  {
    name: "Hair Extensions & Wigs",
    href: "/products?category=extensions-wigs",
    description: "High-quality wigs, extensions, and clip-ins",
  },
  {
    name: "Men's Grooming",
    href: "/products?category=mens-grooming",
    description: "Beard oils, clippers, and grooming essentials for men",
  },
  {
    name: "Salon Equipment",
    href: "/products?category=salon-equipment",
    description: "Chairs, washbasins, and professional salon gear",
  },
  {
    name: "Beauty & Skincare",
    href: "/products?category=beauty-skincare",
    description: "Makeup, skincare products, and beauty accessories",
  },
  {
    name: "Nail Care",
    href: "/products?category=nail-care",
    description: "Polishes, nail tools, and manicure/pedicure essentials",
  },
  {
    name: "Barber Supplies",
    href: "/products?category=barber-supplies",
    description: "Clippers, razors, and barbering tools",
  },
];

const serviceCategories = [
  {
    name: "Hair Salon",
    href: "/services?category=hair-salon",
    description: "Professional haircuts, styling, coloring, and treatments",
    subcategories: [
      {
        name: "Haircuts & Styling",
        href: "/services?category=haircuts-styling",
      },
      {
        name: "Braiding & Weaving",
        href: "/services?category=braiding-weaving",
      },
      { name: "Hair Coloring", href: "/services?category=hair-coloring" },
    ],
  },
  {
    name: "Barbershop",
    href: "/services?category=barbershop",
    description: "Men's grooming services, including haircuts and beard trims",
    subcategories: [
      { name: "Men's Haircuts", href: "/services?category=mens-haircuts" },
      {
        name: "Beard Grooming & Shaving",
        href: "/services?category=beard-grooming",
      },
    ],
  },
  {
    name: "Nail Salon",
    href: "/services?category=nail-salon",
    description: "Manicures, pedicures, and nail enhancements",
    subcategories: [
      { name: "Manicures", href: "/services?category=manicures" },
      { name: "Pedicures", href: "/services?category=pedicures" },
      { name: "Nail Art & Acrylics", href: "/services?category=nail-art" },
    ],
  },
  {
    name: "Skin Care",
    href: "/services?category=skin-care",
    description: "Facials, skin treatments, and rejuvenation services",
    subcategories: [
      { name: "Facials", href: "/services?category=facials" },
      {
        name: "Acne & Anti-Aging Treatments",
        href: "/services?category=skin-treatments",
      },
    ],
  },
  {
    name: "Brows & Lashes",
    href: "/services?category=brows-lashes",
    description: "Eyelash extensions, brow shaping, and tinting",
    subcategories: [
      {
        name: "Eyelash Extensions",
        href: "/services?category=lash-extensions",
      },
      {
        name: "Brow Shaping & Tinting",
        href: "/services?category=brow-tinting",
      },
    ],
  },
  {
    name: "Massage",
    href: "/services?category=massage",
    description: "Relaxing massages and body therapies",
    subcategories: [
      { name: "Swedish Massage", href: "/services?category=swedish-massage" },
      {
        name: "Deep Tissue Massage",
        href: "/services?category=deep-tissue-massage",
      },
    ],
  },
  {
    name: "Makeup",
    href: "/services?category=makeup",
    description: "Professional makeup application for all occasions",
    subcategories: [
      { name: "Bridal Makeup", href: "/services?category=bridal-makeup" },
      { name: "Special Event Makeup", href: "/services?category=event-makeup" },
    ],
  },
  {
    name: "Day Spa",
    href: "/services?category=day-spa",
    description: "Luxury spa treatments for relaxation and wellness",
    subcategories: [
      { name: "Body Scrubs", href: "/services?category=body-scrubs" },
      { name: "Sauna & Steam Therapy", href: "/services?category=sauna-steam" },
    ],
  },
  {
    name: "Wellness & Tattoo",
    href: "/services?category=wellness-tattoo",
    description: "Holistic wellness services and artistic tattoos",
    subcategories: [
      { name: "Yoga & Meditation", href: "/services?category=yoga-meditation" },
      { name: "Tattoo & Piercing", href: "/services?category=tattoo-piercing" },
    ],
  },
];

const solutionsCategories = [
  {
    name: "For Customers",
    href: "/solutions/for-customers",
    description:
      "Seamless booking, verified professionals, and personalized beauty services",
    subcategories: [
      {
        name: "Find & Book Stylists",
        href: "/solutions?category=find-book-stylists",
      },
      {
        name: "Appointment Management",
        href: "/solutions?category=appointment-management",
      },
      {
        name: "Reviews & Ratings",
        href: "/solutions?category=reviews-ratings",
      },
      {
        name: "Loyalty & Rewards",
        href: "/solutions?category=loyalty-rewards",
      },
    ],
  },
  {
    name: "For Stylists & Professionals",
    href: "/solutions/for-professionals",
    description:
      "Empowering beauty professionals with booking tools, client management, and product sales",
    subcategories: [
      {
        name: "Profile & Portfolio Management",
        href: "/solutions?category=profile-portfolio",
      },
      {
        name: "Online Booking & Scheduling",
        href: "/solutions?category=booking-scheduling",
      },
      {
        name: "Client & Payment Management",
        href: "/solutions?category=client-payment-management",
      },
      {
        name: "Sell Beauty Products & Tools",
        href: "/solutions?category=sell-products-tools",
      },
    ],
  },
  {
    name: "For Salons & Businesses",
    href: "/solutions/for-businesses",
    description:
      "Comprehensive tools to manage teams, bookings, and grow sales",
    subcategories: [
      {
        name: "Team & Staff Management",
        href: "/solutions?category=team-management",
      },
      {
        name: "Multi-Location Booking System",
        href: "/solutions?category=multi-location-booking",
      },
      {
        name: "Marketing & Promotions",
        href: "/solutions?category=marketing-promotions",
      },
      {
        name: "Product Inventory & Sales",
        href: "/solutions?category=product-inventory-sales",
      },
    ],
  },
  {
    name: "Enterprise",
    href: "/solutions/for-enterprises",
    description:
      "Scalable beauty and wellness solutions for large businesses and franchises",
    subcategories: [
      {
        name: "Custom Solutions & Integrations",
        href: "/solutions?category=custom-solutions",
      },
      {
        name: "API Access & White Labeling",
        href: "/solutions?category=api-white-labeling",
      },
      {
        name: "Corporate Partnerships",
        href: "/solutions?category=corporate-partnerships",
      },
      {
        name: "Advanced Analytics & Insights",
        href: "/solutions?category=analytics-insights",
      },
    ],
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const { user, logout } = useAuth();
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/provider")
  ) {
    return;
  }
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100 transition-all duration-200",
        scrolled ? "shadow-sm" : ""
      )}
    >
      <div className="container flex h-20 items-center w-full sm:justify-between">
        {/* Logo and brand */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Hairsby</span>
          </Link>
        </div>
        <div className="flex h-16 md:h-20 items-center justify-between lg:w-full ml-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 lg:w-[600px] lg:grid-cols-2">
                      {serviceCategories.slice(0, 6).map((category) => (
                        <li key={category.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="col-span-2">
                        <div className="flex items-center justify-between px-4 pt-2">
                          <span className="text-sm font-medium">
                            More Services
                          </span>
                          <Link
                            href="/services"
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            View All
                          </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-4 py-2">
                          {serviceCategories.slice(6).map((category) => (
                            <Link
                              key={category.href}
                              href={category.href}
                              className="text-sm hover:underline"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 lg:w-[600px] lg:grid-cols-2">
                      {productCategories.map((category) => (
                        <li key={category.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 lg:w-[600px] lg:grid-cols-2">
                      {solutionsCategories.map((category) => (
                        <li key={category.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.description}
                              </p>
                              {category.subcategories && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {category.subcategories
                                    .slice(0, 2)
                                    .map((sub) => (
                                      <span
                                        key={sub.href}
                                        className="inline-flex items-center rounded-full bg-accent/50 px-2.5 py-0.5 text-xs font-semibold"
                                      >
                                        {sub.name}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 sm:justify-items-end">
            <ModeToggle />
            {user?.firstName && user?.role ? (
              <div className="flex flex-1 items-center justify-end space-x-4">
                <nav className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                          {user?.firstName[0]}
                          {user?.lastName[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => logout()}
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  // size="sm"
                  // className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  asChild
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link
            href="/about"
            className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
          >
            About
          </Link>

          <div className="py-2">
            <div className="flex items-center justify-between px-3 py-1">
              <Link href="/services" className="text-base font-medium">
                Services
              </Link>
              <button
                className="rounded-md p-1 hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault();
                  const submenu = document.getElementById("services-submenu");
                  if (submenu) submenu.classList.toggle("hidden");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            <div id="services-submenu" className="hidden ml-4 space-y-1 mt-1">
              {serviceCategories.slice(0, 4).map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/services"
                className="block rounded-md px-3 py-2 text-sm font-medium text-blue-600"
              >
                View All Services
              </Link>
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between px-3 py-1">
              <Link href="/products" className="text-base font-medium">
                Products
              </Link>
              <button
                className="rounded-md p-1 hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault();
                  const submenu = document.getElementById("products-submenu");
                  if (submenu) submenu.classList.toggle("hidden");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            <div id="products-submenu" className="hidden ml-4 space-y-1 mt-1">
              {productCategories.slice(0, 4).map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/products"
                className="block rounded-md px-3 py-2 text-sm font-medium text-blue-600"
              >
                View All Products
              </Link>
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between px-3 py-1">
              <Link href="/solutions" className="text-base font-medium">
                Solutions
              </Link>
              <button
                className="rounded-md p-1 hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault();
                  const submenu = document.getElementById("solutions-submenu");
                  if (submenu) submenu.classList.toggle("hidden");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            <div id="solutions-submenu" className="hidden ml-4 space-y-1 mt-1">
              {solutionsCategories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {user?.firstName && user.email ? null : (
            <div className="pt-4 pb-3 border-t border-accent/50">
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
