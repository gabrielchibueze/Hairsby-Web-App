// "use client";

// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import Image from "next/image";

// export function HeroSection() {
//   return (
//     <section className="relative overflow-hidden bg-hairsby-dark text-white">
//       <div className="container relative z-10 py-28 md:py-36">
//         <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
//           <motion.div
//             className="flex flex-col justify-center"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
//               <span className="text-hairsby-orange">Beauty Services</span> On
//               Demand
//             </h1>
//             <p className="mt-6 text-lg leading-8 text-white/80">
//               Book trusted beauty professionals for haircuts, spa treatments,
//               nails, and more. Our platform connects you with top-rated experts
//               for all your beauty needs.
//             </p>
//             <div className="mt-10 flex flex-wrap gap-4">
//               <Button
//                 size="lg"
//                 className="bg-hairsby-orange hover:bg-hairsby-orange/90 text-white"
//                 asChild
//               >
//                 <a href="/services">Find a Professional</a>
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="text-white border-white hover:bg-white/10"
//                 asChild
//               >
//                 <a href="/become-professional">Become a Pro</a>
//               </Button>
//             </div>
//           </motion.div>
//           <motion.div
//             className="relative h-[400px] lg:h-[550px]"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <Image
//               src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2070&auto=format&fit=crop"
//               alt="Woman getting professional beauty treatment"
//               fill
//               className="object-cover rounded-xl shadow-2xl"
//               priority
//             />
//             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-hairsby-orange rounded-full mix-blend-multiply opacity-30" />
//           </motion.div>
//         </div>
//       </div>
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-hairsby-dark/90 to-hairsby-dark" />
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-hairsby-dark/95 to-hairsby-dark">
      <div className="container relative z-10 py-28 md:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Your <span className="text-hairsby-orange">Beauty Journey</span>{" "}
              Starts Here
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Book trusted beauty professionals for haircuts, spa treatments,
              nails, and more. Our platform connects you with top-rated experts
              in your area.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-hairsby-orange hover:bg-amber-500 text-white shadow-lg"
                asChild
              >
                <a href="/services">Find a Professional</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-gray-900 border-gray-400 hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href="/become-professional">Become a Pro</a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative h-[400px] lg:h-[550px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2070&auto=format&fit=crop"
              alt="Woman getting professional beauty treatment"
              fill
              className="object-cover rounded-xl shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:200px_200px]"></div>
      </div>
    </section>
  );
}
