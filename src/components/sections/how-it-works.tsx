"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const steps = [
  {
    title: "Browse & Choose",
    description: "Explore our wide range of beauty services and skilled professionals",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Book Instantly",
    description: "Select your preferred time and book with just a few clicks",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a6?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Get Beautiful",
    description: "Enjoy professional beauty services from verified experts",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1974&auto=format&fit=crop"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Book your beauty services in three simple steps
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-lg">
                <div className="relative h-64">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}