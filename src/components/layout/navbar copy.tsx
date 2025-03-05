"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";

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
    description: "Men’s grooming services, including haircuts and beard trims",
    subcategories: [
      { name: "Men’s Haircuts", href: "/services?category=mens-haircuts" },
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
    href: "/for-customers",
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
    href: "/for-stylists",
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
    href: "/for-businesses",
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
    href: "/solutions?category=enterprise",
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
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Hairsby</span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-services-none disabled:opacity-50">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/services" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-services-none disabled:opacity-50">
                      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                    </NavigationMenuLink>
                  </Link>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {serviceCategories.map((category) => (
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
                  <Link href="/products" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-services-none disabled:opacity-50">
                      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    </NavigationMenuLink>
                  </Link>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
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
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
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
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
