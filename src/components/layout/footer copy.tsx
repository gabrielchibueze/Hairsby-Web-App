"use client";
import React from "react";
// import { Link } from "react-router-dom";
import { ChevronUp, Phone } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-white">
      {/* Services Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free shipping on orders over $65</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Free Returns</h3>
            <p className="text-gray-600">30-days free return policy</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secured Payments</h3>
            <p className="text-gray-600">We accept all major credit cards</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Customer Service</h3>
            <p className="text-gray-600">Top notch customer service</p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">About Store</h4>
            <div className="mb-4">
              <p className="text-gray-600 mb-1">Have Question? Call Us 24/7</p>
              <p className="text-hairsby-orange text-xl font-bold">
                +44 7789 779444
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">Monday - Friday:</span> 8:00am -
                6:00pm
              </p>
              <p className="mb-2">
                <span className="font-semibold">Saturday:</span> 8:00am - 6:00pm
              </p>
              <p className="mb-2">
                <span className="font-semibold">Sunday:</span> Service Close
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Our Stores</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Newcastle United Kingdom
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Shop Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Best Selling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Discount Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Free Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Reward Products
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Useful Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Latest News
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-hairsby-orange">
                  Our Sitemaps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h5 className="font-semibold mb-2">Payment System:</h5>
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
              <p className="text-sm text-gray-600 mb-2">
                Copyright & Design 2024{" "}
                <a href="#" className="text-hairsby-orange">
                  ©Hairsby
                </a>
                . All Right Reserved
              </p>
              <button
                onClick={() => scrollToTop()}
                className="inline-flex items-center justify-center w-10 h-10 bg-hairsby-orange text-white rounded-full"
              >
                <ChevronUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
