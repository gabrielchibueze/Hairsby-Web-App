"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function DownloadApp() {
  return (
    <section className="overflow-hidden bg-primary py-20 text-primary-foreground">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get the Hairsby App
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Book appointments, track your beauty journey, and discover new styles on the go. 
              Download our mobile app for the best beauty experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/app-store.svg"
                    alt="Download on the App Store"
                    width={24}
                    height={24}
                  />
                  App Store
                </a>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/play-store.svg"
                    alt="Get it on Google Play"
                    width={24}
                    height={24}
                  />
                  Google Play
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative mx-auto w-full max-w-[320px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1974&auto=format&fit=crop"
              alt="Hairsby mobile app"
              width={320}
              height={640}
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}