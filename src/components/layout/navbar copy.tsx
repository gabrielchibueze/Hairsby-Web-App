"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Phone,
  Menu,
  X,
  Search,
  ChevronDown,
  User,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth.context";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorite } from "@/components/favorite/favorite-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { favoriteCount } = useFavorite();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      setIsScrolled(lastScrollY > 50);
      ticking = false;
    };

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const isActive = (path: string) => pathname === path;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/solutions")
  ) {
    return;
  }
  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* Top Bar (Collapsable) */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isScrolled
              ? "h-0 overflow-hidden opacity-0"
              : "h-auto opacity-100 bg-white py-2 mt-3"
          }`}
        >
          <div className="container mx-auto px-4 mb-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img
                  src="hairsby-logo.svg"
                  alt="Hairsby Logo"
                  className="h-10 md:h-12 transition-all duration-200"
                />
              </Link>

              {/* Desktop Search */}
              <div className="hidden md:flex mx-6 flex-1 max-w-2xl">
                <div className="relative flex w-full">
                  <select className="appearance-none bg-gray-50 border border-r-0 border-gray-200 rounded-l-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-hairsby-orange text-sm transition-all duration-200">
                    <option>All Categories</option>
                    <option>Salons</option>
                    <option>Barbers</option>
                    <option>Products</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />

                  <input
                    type="text"
                    placeholder="Search for salons, products..."
                    className="flex-grow border-t border-b border-gray-200 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-hairsby-orange text-sm transition-all duration-200"
                  />
                  <button className="bg-hairsby-orange text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors duration-200">
                    <Search size={18} />
                  </button>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-4 md:space-x-6">
                <button className="hidden md:flex items-center text-gray-600 hover:text-hairsby-orange transition-colors duration-200">
                  <Phone size={18} className="mr-2" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Customer Service</p>
                    <Link href="tel:+447789779444">
                      <p className="text-sm font-medium">+44 7789 779444</p>
                    </Link>
                  </div>
                </button>

                <Link
                  href="/favorites"
                  className="p-2 text-gray-600 hover:text-hairsby-orange transition-colors duration-200 relative"
                >
                  <Heart size={20} />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center text-gray-600 hover:text-hairsby-orange transition-colors duration-200"
                >
                  <div className="relative p-2">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block ml-1 text-left">
                    <p className="text-xs text-gray-500">Your Cart</p>
                    <p className="text-sm font-medium">$0.00</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar (Always visible) */}
        <div className={`w-full bg-hairsby-dark`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Main Navigation */}
              <nav className="hidden md:flex space-x-6">
                {[
                  { path: "/", label: "Home" },
                  { path: "/services", label: "Services" },
                  { path: "/products", label: "Products" },
                  { path: "/about", label: "About Us" },
                  { path: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`font-medium text-sm uppercase tracking-wider py-2 border-b-2 transition-colors duration-200 ${
                      isActive(item.path)
                        ? "border-hairsby-orange text-hairsby-orange"
                        : "border-transparent text-gray-50 hover:text-hairsby-orange"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right side elements (Auth, Notification, etc.) */}
              <div className="flex items-center space-x-4">
                {!isScrolled && (
                  <div className="hidden md:flex items-center bg-amber-50 px-3 py-1 rounded-md transition-all duration-200">
                    <span className="text-amber-700 text-sm font-medium mr-2">
                      30% OFF
                    </span>
                    <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded transition-all duration-200">
                      SALE
                    </span>
                  </div>
                )}

                <div className="hidden md:flex items-center space-x-3">
                  {/* Notification Bell */}
                  {user?.firstName && user?.role && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-50 hover:text-hairsby-orange"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hairsby-orange"></span>
                    </Button>
                  )}

                  {/* Theme Toggle */}
                  {/* <ModeToggle /> */}

                  {/* Auth Links */}
                  {user?.firstName && user?.role ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full bg-gray-600  text-gray-50 hover:text-hairsby-orange"
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
                  ) : (
                    <div className="hidden md:flex space-x-3">
                      <Link
                        href="/login"
                        className="flex items-center text-gray-50 hover:text-hairsby-orange transition-colors duration-200 text-sm font-medium"
                      >
                        <User size={16} className="mr-1" />
                        Login
                      </Link>
                      <span className="text-gray-50">|</span>
                      <Link
                        href="/signup"
                        className="text-gray-50 hover:text-hairsby-orange transition-colors duration-200 text-sm font-medium"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button - Moved outside the right-side elements container */}
              </div>

              {/* Mobile Menu Button - Now properly aligned to the right */}
              <div
                onClick={toggleMobileMenu}
                className="md:hidden cursor-pointer text-gray-50 hover:text-hairsby-orange transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  ""
                ) : (
                  <h1>
                    <Menu size={24} />
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isScrolled && (
          <div className="container mx-auto px-4 py-2 md:hidden transition-all duration-300 ease-in-out">
            <button
              onClick={toggleSearch}
              className="flex items-center w-full bg-gray-800 rounded-md px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
            >
              <Search size={18} className="mr-2" />
              <span className="text-sm">Search for services, products...</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-hairsby-dark z-50 p-4 md:hidden transition-opacity duration-300 ease-in-out">
          <div className="flex items-center mb-4">
            <button
              onClick={toggleSearch}
              className="mr-4 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-white">Search</h2>
          </div>

          <div className="relative flex w-full mb-4">
            <input
              type="text"
              placeholder="Search for salons, products..."
              className="flex-grow border border-gray-700 bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-hairsby-orange transition-all duration-200"
              autoFocus
            />
            <button className="absolute right-2 top-2.5 text-gray-400 hover:text-white transition-colors duration-200">
              <Search size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {["Hair Salons", "Nail Salons", "Hair Products", "Stylists"].map(
              (item) => (
                <button
                  key={item}
                  className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors duration-200"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ease-in-out">
          <div
            className="absolute top-0 right-0 h-full w-4/5 bg-gray-900 text-gray-300 shadow-lg p-6 overflow-y-auto transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 ">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img
                  src="hairsby-icon.svg"
                  alt="Hairsby Logo"
                  className="h-10 md:h-12 transition-all duration-200"
                />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="text-gray-50 hover:text-hairsby-orange transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mb-8">
              {[
                { path: "/", label: "Home" },
                { path: "/services", label: "Salons" },
                { path: "/products", label: "Products" },
                { path: "/about", label: "About Us" },
                { path: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-3 border-b border-gray-700 text-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-hairsby-orange font-medium"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mb-8">
              <div className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-md mb-4 transition-colors duration-200 hover:bg-gray-700">
                <span className="font-medium">30% Discount</span>
                <span className="bg-hairsby-orange text-white text-xs px-2 py-0.5 rounded transition-colors duration-200">
                  SALE
                </span>
              </div>

              {user?.firstName && user?.role ? (
                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="block text-center bg-gray-800 text-white font-medium py-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full text-center bg-hairsby-orange text-white font-medium py-3 rounded-md hover:bg-orange-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block text-center bg-gray-800 text-white font-medium py-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block text-center bg-hairsby-orange text-white font-medium py-3 rounded-md hover:bg-orange-600 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-700">
              <div className="flex items-center mb-4">
                <Phone
                  size={18}
                  className="mr-3 text-gray-400 hover:text-white transition-colors duration-200"
                />
                <div>
                  <p className="text-xs text-gray-500">Customer Service</p>
                  <Link href="tel:+447789779444">
                    <p className="font-medium text-white">+44 7789 779444</p>
                  </Link>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link
                  href="/favorites"
                  className="p-3 border border-gray-700 rounded-md text-gray-400 hover:text-white transition-colors duration-200 relative"
                  onClick={closeMobileMenu}
                >
                  <Heart size={20} />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200">
                      {favoriteCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="p-3 border border-gray-700 rounded-md text-gray-400 hover:text-white relative transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
