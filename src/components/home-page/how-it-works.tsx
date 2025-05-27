"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Smartphone, Smile } from "lucide-react";

const steps = [
  {
    icon: <CalendarCheck className="h-8 w-8 text-hairsby-orange" />,
    title: "Browse & Book",
    description: "Find your perfect service professional and book instantly",
  },
  {
    icon: <Smartphone className="h-8 w-8 text-hairsby-orange" />,
    title: "Get Confirmed",
    description: "Receive instant booking confirmation and reminders",
  },
  {
    icon: <Smile className="h-8 w-8 text-hairsby-orange" />,
    title: "Enjoy Your Service",
    description: "Relax while our professionals work their magic",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Simple steps to your perfect service experience
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-gray-600">{step.description}</p>
              <div className="mt-6 text-sm font-medium text-hairsby-orange">
                Step {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import { CalendarCheck, Smartphone, Smile } from "lucide-react";

// const steps = [
//   {
//     icon: <CalendarCheck className="h-8 w-8 text-hairsby-orange" />,
//     title: "Browse & Book",
//     description:
//       "Explore our wide range of professional services and skilled professionals. Filter by location, availability, and specialties.",
//     image:
//       "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1974&auto=format&fit=crop",
//   },
//   {
//     icon: <Smartphone className="h-8 w-8 text-hairsby-orange" />,
//     title: "Confirm Instantly",
//     description:
//       "Select your preferred time and book with just a few clicks. Receive instant confirmation and reminders.",
//     image:
//       "https://images.unsplash.com/photo-1642543492481-44e81e3914a6?q=80&w=1974&auto=format&fit=crop",
//   },
//   {
//     icon: <Smile className="h-8 w-8 text-hairsby-orange" />,
//     title: "Enjoy Your Service",
//     description:
//       "Relax and enjoy professional professional services from verified experts. Leave reviews to help our community.",
//     image:
//       "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1974&auto=format&fit=crop",
//   },
// ];

// export function HowItWorks() {
//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="container">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
//             How <span className="text-gradient">Hairsby</span> Works
//           </h2>
//           <p className="mt-4 text-lg text-muted-foreground">
//             Get beautiful in just three simple steps
//           </p>
//         </div>
//         <div className="mt-16 grid gap-12 md:grid-cols-3">
//           {steps.map((step, index) => (
//             <motion.div
//               key={step.title}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//               viewport={{ once: true }}
//               className="flex flex-col items-center text-center"
//             >
//               <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-hairsby-orange/10">
//                 {step.icon}
//                 <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-hairsby-dark text-xs font-bold text-white">
//                   {index + 1}
//                 </span>
//               </div>
//               <h3 className="mt-6 text-xl font-bold text-hairsby-dark">
//                 {step.title}
//               </h3>
//               <p className="mt-3 text-muted-foreground">{step.description}</p>
//               <div className="mt-6 relative h-48 w-full rounded-xl overflow-hidden">
//                 <Image
//                   src={step.image}
//                   alt={step.title}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
