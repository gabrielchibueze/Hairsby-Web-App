"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  {
    name: "L'Oréal Professionnel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/L%27Or%C3%A9al_Professionnel_logo.svg/2560px-L%27Or%C3%A9al_Professionnel_logo.svg.png",
  },
  {
    name: "Wella Professionals",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Wella_logo.svg/2560px-Wella_logo.svg.png",
  },
  {
    name: "OPI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/OPI_Products_logo.svg/2560px-OPI_Products_logo.svg.png",
  },
  {
    name: "Dermalogica",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dermalogica_logo.svg/2560px-Dermalogica_logo.svg.png",
  },
  {
    name: "GHD",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ghd_logo.svg/2560px-Ghd_logo.svg.png",
  },
  {
    name: "CND",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/CND_logo.svg/2560px-CND_logo.svg.png",
  },
];

export function TrustedBy() {
  return (
    <section className="py-16 bg-hairsby-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-hairsby-orange">
            Trusted by industry leaders
          </h2>
          <p className="mt-2 text-xl font-medium text-white">
            Partnered with the best in service
          </p>
        </motion.div>
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-12 w-32 opacity-80 hover:opacity-100 transition-opacity"
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
      </div>
    </section>
  );
}
