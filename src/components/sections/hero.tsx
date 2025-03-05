"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Your Beauty Journey Starts Here
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Connect with top beauty professionals, book appointments, and discover your perfect style. 
              Join thousands of satisfied customers who trust Hairsby for their beauty needs.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" asChild>
                <a href="/services">Book Now</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/about">Learn More</a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[600px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop"
              alt="Professional hair styling"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
    </section>
  )
}