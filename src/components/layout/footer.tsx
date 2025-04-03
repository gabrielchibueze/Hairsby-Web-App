// "use client";
// import { motion } from "framer-motion";
// import { ChevronUp, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const footerLinks = {
//   company: [
//     { name: "About Us", href: "/about" },
//     { name: "Careers", href: "/careers" },
//     { name: "Press", href: "/press" },
//     { name: "Blog", href: "/blog" },
//     { name: "Contact", href: "/contact" },
//   ],
//   services: [
//     { name: "Hair Styling", href: "/services/hair" },
//     { name: "Makeup", href: "/services/makeup" },
//     { name: "Nails", href: "/services/nails" },
//     { name: "Skincare", href: "/services/skincare" },
//     { name: "Spa", href: "/services/spa" },
//   ],
//   support: [
//     { name: "Help Center", href: "/help" },
//     { name: "Safety", href: "/safety" },
//     { name: "Terms of Service", href: "/terms" },
//     { name: "Privacy Policy", href: "/privacy" },
//     { name: "Cookie Policy", href: "/cookies" },
//   ],
//   business: [
//     { name: "For Businesses", href: "/solutions/for-businesses" },
//     { name: "For Professionals", href: "/solutions/for-professionals" },
//     { name: "For Salons", href: "/solutions/for-salons" },
//     { name: "Partner Program", href: "/partners" },
//     { name: "Business Blog", href: "/business/blog" },
//     { name: "Pricing", href: "/pricing" },
//   ],
// };

// export default function Footer() {
//   const path = usePathname();
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   if (
//     path.startsWith("/dashboard") ||
//     path.startsWith("/admin") ||
//     path.startsWith("/provider")
//   ) {
//     return (
//       <div className="mt-8 mb-8 border-t pt-8">
//         <p className="text-center text-sm text-muted-foreground">
//           © {new Date().getFullYear()} Hairsby. All rights reserved.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <footer className="bg-white">
//       {/* Services Section */}
//       <div className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="flex flex-col items-center text-center">
//             <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="w-8 h-8"
//               >
//                 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
//             <p className="text-gray-600">Free shipping on orders over $65</p>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="w-8 h-8"
//               >
//                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
//                 <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Free Returns</h3>
//             <p className="text-gray-600">30-days free return policy</p>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="w-8 h-8"
//               >
//                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                 <line x1="16" y1="2" x2="16" y2="6"></line>
//                 <line x1="8" y1="2" x2="8" y2="6"></line>
//                 <line x1="3" y1="10" x2="21" y2="10"></line>
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Secured Payments</h3>
//             <p className="text-gray-600">We accept all major credit cards</p>
//           </div>

//           <div className="flex flex-col items-center text-center">
//             <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="w-8 h-8"
//               >
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="12" y1="8" x2="12" y2="12"></line>
//                 <line x1="12" y1="16" x2="12.01" y2="16"></line>
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Customer Service</h3>
//             <p className="text-gray-600">Top notch customer service</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Footer */}
//       <div className="container mx-auto px-4 py-12">
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"> */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="lg:col-span-2"
//           >
//             <Link href="/" className="text-2xl font-bold">
//               Hairsby
//             </Link>
//             <p className="mt-4 text-gray-600 max-w-96">
//               Connecting beauty professionals with customers. Book appointments,
//               discover new styles, and transform your look with Hairsby.
//             </p>
//             <div className="mt-6 flex space-x-4">
//               <a href="#" className="text-gray-600 hover:text-hairsby-orange">
//                 <Facebook className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-hairsby-orange">
//                 <Instagram className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-hairsby-orange">
//                 <Twitter className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-hairsby-orange">
//                 <Youtube className="h-5 w-5" />
//               </a>
//             </div>
//           </motion.div>

//           {Object.entries(footerLinks).map(([category, links], index) => (
//             <motion.div
//               key={category}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <h3 className="text-lg font-bold mb-4">
//                 {category.charAt(0).toUpperCase() + category.slice(1)}
//               </h3>
//               <ul className="space-y-2">
//                 {links.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-gray-600 hover:text-hairsby-orange"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           ))}
//         </div>

//         <div className="mt-12 border-t pt-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div className="mb-4 md:mb-0">
//               <h5 className="font-semibold mb-2">Payment System:</h5>
//               <div className="flex space-x-3">
//                 <img
//                   src="https://via.placeholder.com/40x25"
//                   alt="Visa"
//                   className="h-8"
//                 />
//                 <img
//                   src="https://via.placeholder.com/40x25"
//                   alt="Mastercard"
//                   className="h-8"
//                 />
//                 <img
//                   src="https://via.placeholder.com/40x25"
//                   alt="Amex"
//                   className="h-8"
//                 />
//                 <img
//                   src="https://via.placeholder.com/40x25"
//                   alt="PayPal"
//                   className="h-8"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col items-center md:items-end">
//               <p className="text-sm text-gray-600 mb-2">
//                 Copyright & Design {new Date().getFullYear()}{" "}
//                 <a href="#" className="text-hairsby-orange">
//                   ©Hairsby
//                 </a>
//                 . All Right Reserved
//               </p>
//               <button
//                 onClick={scrollToTop}
//                 className="inline-flex items-center justify-center w-10 h-10 bg-hairsby-orange text-white rounded-full hover:bg-orange-600 transition-colors"
//               >
//                 <ChevronUp size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

"use client";
import { motion } from "framer-motion";
import { ChevronUp, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
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
    { name: "For Businesses", href: "/solutions/for-businesses" },
    { name: "For Professionals", href: "/solutions/for-professionals" },
    { name: "For Salons", href: "/solutions/for-salons" },
    { name: "Partner Program", href: "/partners" },
    { name: "Business Blog", href: "/business/blog" },
    { name: "Pricing", href: "/pricing" },
  ],
};

export default function Footer() {
  const path = usePathname();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
              <Link href="/" className="text-2xl font-bold text-white">
                Hairsby
              </Link>
              <p className="mt-4 max-w-96">
                Connecting beauty professionals with customers. Book
                appointments, discover new styles, and transform your look with
                Hairsby.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white">
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

          <div className="mt-12 border-t border-gray-700 pt-8">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
