"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Hair Services",
    description: "From cuts to color, we've got your hair needs covered",
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1974&auto=format&fit=crop",
    slug: "hair",
  },
  {
    name: "Beauty & Spa",
    description: "Pamper yourself with our luxurious treatments",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop",
    slug: "service-spa",
  },
  {
    name: "Nail Care",
    description: "Professional manicures and pedicures",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&auto=format&fit=crop",
    slug: "nails",
  },
  {
    name: "Barbering",
    description: "Precision cuts and traditional barber services",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop",
    slug: "barber",
  },
];

export function ServiceCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Service Categories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover services across all service and personal care specialties
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hairsby-dark/90 via-hairsby-dark/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm text-white/90">
                  {category.description}
                </p>
                <Button
                  variant="link"
                  className="mt-3 px-0 text-hairsby-orange hover:text-hairsby-orange/80"
                  asChild
                >
                  <a href={`/services?category=${category.slug}`}>
                    View Services →
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
