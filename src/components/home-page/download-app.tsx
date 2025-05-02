"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Smartphone, ArrowRight } from "lucide-react";

export function DownloadApp() {
  return (
    <section className="py-20 bg-gradient-to-br from-hairsby-dark to-hairsby-dark/90 text-white">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile App Available
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Beauty On The Go With Our App
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Book appointments, track your beauty journey, and discover new
              styles wherever you are. Download our app for exclusive offers and
              features.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-hairsby-dark hover:bg-white/90"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/app-store.svg"
                    alt="Download on the App Store"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  App Store
                </a>
              </Button>
              <Button
                size="lg"
                className="bg-white text-hairsby-dark hover:bg-white/90"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/play-store.svg"
                    alt="Get it on Google Play"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Google Play
                </a>
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm font-medium text-white/80">
              <a
                href="#"
                className="inline-flex items-center hover:text-white transition-colors"
              >
                Explore app features
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </motion.div>
          <motion.div
            className="relative mx-auto"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-[270px] sm:w-[290px] h-[560px]">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Hairsby mobile app screens"
                fill
                className="object-cover rounded-[40px] shadow-2xl border-8 border-white/10"
              />
              <div className="absolute -z-10 inset-0 rounded-[50px] bg-hairsby-orange/20 blur-2xl" />
            </div>
            <div className="absolute -z-10 -right-12 -bottom-12 w-64 h-64 rounded-full bg-hairsby-orange/20 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
