"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getFeaturedServices } from "@/lib/api/services"

export function FeaturedServices() {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: getFeaturedServices
  })

  if (isLoading) {
    return (
      <section className="bg-muted py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-muted py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Services</h2>
            <p className="mt-4 text-lg text-destructive">Error loading services. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-muted py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Services</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our most popular beauty and wellness services
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">£{service.price}</span>
                    <a 
                      href={`/services/${service.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Book now →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}