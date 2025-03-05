"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  {
    name: "L'Oréal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/L%27Or%C3%A9al_logo.svg/2560px-L%27Or%C3%A9al_logo.svg.png"
  },
  {
    name: "Wella Professionals",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Wella_logo.svg/2560px-Wella_logo.svg.png"
  },
  {
    name: "OPI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/OPI_Products_logo.svg/2560px-OPI_Products_logo.svg.png"
  },
  {
    name: "MAC Cosmetics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/MAC_Cosmetics_logo.svg/2560px-MAC_Cosmetics_logo.svg.png"
  },
  {
    name: "Redken",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Redken_logo.svg/2560px-Redken_logo.svg.png"
  }
]

export function TrustedBy() {
  return (
    <section className="border-y bg-muted/50 py-16">
      <div className="container">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Trusted by leading beauty brands
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 grayscale">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-12 w-32"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}