"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedServices } from "@/lib/api/services/service";

export function FeaturedServices() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["featuredServices"],
    queryFn: getFeaturedServices,
  });

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Premium Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Book these top-rated beauty services trusted by our community
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {service.discountPrice && (
                  <div className="absolute top-3 left-3 bg-hairsby-orange text-white text-xs font-bold px-2 py-1 rounded">
                    Special Offer
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {service.category}
                    </p>
                  </div>
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="ml-1 text-sm font-medium">
                      {service.provider?.rating?.toFixed(1) || "New"}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                    {service.provider?.city && (
                      <>
                        <span className="text-gray-300">•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{service.provider.city}</span>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    {service.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          £{service.discountPrice}
                        </span>
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          £{service.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        £{service.price}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  className="mt-4 w-full bg-hairsby-orange hover:bg-amber-500"
                  size="sm"
                  asChild
                >
                  <a href={`/services/${service.id}`}>Book Now</a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Star, Clock, MapPin, Heart, Zap } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { getFeaturedServices } from "@/lib/api/services/service";
// import { cn } from "@/lib/utils";

// export function FeaturedServices() {
//   const {
//     data: services = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["featuredServices"],
//     queryFn: getFeaturedServices,
//   });

//   if (error) {
//     return (
//       <section className="py-20 bg-white">
//         <div className="container">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
//               Featured Services
//             </h2>
//             <p className="mt-4 text-lg text-destructive">
//               Error loading services. Please try again later.
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-white">
//       <div className="container">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
//             <span className="text-gradient">Premium</span> Beauty Services
//           </h2>
//           <p className="mt-4 text-lg text-muted-foreground">
//             Discover our most sought-after beauty treatments
//           </p>
//         </div>

//         {isLoading ? (
//           <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {[...Array(4)].map((_, i) => (
//               <ServiceCardSkeleton key={i} />
//             ))}
//           </div>
//         ) : (
//           <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {services.map((service, index) => (
//               <motion.div
//                 key={service.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//               >
//                 <ServiceCard service={service} />
//               </motion.div>
//             ))}
//           </div>
//         )}

//         <div className="mt-12 text-center">
//           <Button
//             size="lg"
//             className="bg-hairsby-orange hover:bg-hairsby-orange/90"
//             asChild
//           >
//             <a href="/services">Explore All Services</a>
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }

// function ServiceCard({ service }: { service: any }) {
//   const hasDiscount =
//     service.discountPrice && service.discountPrice < service.price;

//   return (
//     <div className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
//       {/* Favorite button */}
//       <button className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all hover:bg-white">
//         <Heart className="h-5 w-5 text-gray-400 group-hover:text-rose-400" />
//       </button>

//       {/* Discount badge */}
//       {hasDiscount && (
//         <div className="absolute left-3 top-3 z-10 rounded-full bg-rose-500 px-2 py-1 text-xs font-bold text-white">
//           {Math.round(
//             ((service.price - service.discountPrice) / service.price) * 100
//           )}
//           % OFF
//         </div>
//       )}

//       {/* Service image */}
//       <div className="relative h-48 overflow-hidden">
//         <Image
//           src={service.images[0] || "/placeholder-service.jpg"}
//           alt={service.name}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//       </div>

//       {/* Service details */}
//       <div className="p-5">
//         {/* Provider info */}
//         <div className="flex items-center gap-3">
//           {service.provider?.photo && (
//             <div className="relative h-8 w-8 overflow-hidden rounded-full">
//               <Image
//                 src={service.provider.photo}
//                 alt={service.provider.businessName || "Provider"}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           )}
//           <div className="flex-1 overflow-hidden">
//             <h4 className="truncate text-sm font-medium text-gray-600">
//               {service.provider?.businessName || "Professional"}
//             </h4>
//             <div className="flex items-center gap-1">
//               <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
//               <span className="text-xs text-gray-500">
//                 {service.provider?.rating?.toFixed(1) || "New"}
//                 {service.provider?.totalReviews && (
//                   <span className="text-gray-400">
//                     {" "}
//                     ({service.provider.totalReviews})
//                   </span>
//                 )}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Service title and description */}
//         <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-2">
//           {service.name}
//         </h3>
//         <p className="mt-1 text-sm text-gray-500 line-clamp-2">
//           {service.description}
//         </p>

//         {/* Service meta */}
//         <div className="mt-4 flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <Clock className="h-4 w-4" />
//             <span>{service.duration} mins</span>
//             {service.provider?.city && (
//               <>
//                 <span className="text-gray-300">•</span>
//                 <MapPin className="h-4 w-4" />
//                 <span>{service.provider.city}</span>
//               </>
//             )}
//           </div>

//           {/* Quick book button */}
//           <button className="rounded-full bg-hairsby-orange/10 p-2 text-hairsby-orange transition-all hover:bg-hairsby-orange/20">
//             <Zap className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Price and action */}
//         <div className="mt-4 flex items-center justify-between">
//           <div>
//             {hasDiscount ? (
//               <>
//                 <span className="text-lg font-bold text-gray-900">
//                   £{service.discountPrice}
//                 </span>
//                 <span className="ml-2 text-sm text-gray-400 line-through">
//                   £{service.price}
//                 </span>
//               </>
//             ) : (
//               <span className="text-lg font-bold text-gray-900">
//                 £{service.price}
//               </span>
//             )}
//           </div>
//           <Button
//             size="sm"
//             className="bg-hairsby-orange hover:bg-hairsby-orange/90"
//             asChild
//           >
//             <a href={`/services/${service.id}`}>Book Now</a>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ServiceCardSkeleton() {
//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <Skeleton className="h-48 w-full" />
//       <div className="p-5">
//         <div className="flex items-center gap-3">
//           <Skeleton className="h-8 w-8 rounded-full" />
//           <div className="flex-1 space-y-2">
//             <Skeleton className="h-3 w-3/4" />
//             <Skeleton className="h-3 w-1/2" />
//           </div>
//         </div>
//         <div className="mt-3 space-y-2">
//           <Skeleton className="h-5 w-full" />
//           <Skeleton className="h-4 w-full" />
//           <Skeleton className="h-4 w-3/4" />
//         </div>
//         <div className="mt-4 flex items-center justify-between">
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-4 w-4 rounded-full" />
//         </div>
//         <div className="mt-4 flex items-center justify-between">
//           <Skeleton className="h-6 w-16" />
//           <Skeleton className="h-9 w-24 rounded-md" />
//         </div>
//       </div>
//     </div>
//   );
// }
