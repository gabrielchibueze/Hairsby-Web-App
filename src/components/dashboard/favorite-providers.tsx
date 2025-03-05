"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProvidersProps {
  providers: Array<{
    id: string
    businessName: string
    photo: string
    rating: number
    services: Array<{
      name: string
      price: number
    }>
  }>
}

export function FavoriteProviders({ providers }: ProvidersProps) {
  if (!providers?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No favorite providers yet</p>
        <Button className="mt-4" asChild>
          <a href="/services">Discover Providers</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider, index) => (
        <motion.div
          key={provider.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="rounded-lg border p-4"
        >
          <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg">
            <Image
              src={provider.photo}
              alt={provider.businessName}
              fill
              className="object-cover"
            />
          </div>
          <h4 className="font-medium">{provider.businessName}</h4>
          <div className="mt-1 flex items-center">
            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
            <span className="text-sm">{provider.rating}</span>
          </div>
          <div className="mt-2 space-y-1">
            {provider.services.map(service => (
              <p key={service.name} className="text-sm text-muted-foreground">
                {service.name} - £{service.price}
              </p>
            ))}
          </div>
          <Button className="mt-4 w-full" asChild>
            <a href={`/services/provider/${provider.id}`}>Book Now</a>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}