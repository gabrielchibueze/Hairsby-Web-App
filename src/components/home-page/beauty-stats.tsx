"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Beauty Professionals" },
  { value: "500,000+", label: "Happy Clients" },
  { value: "200+", label: "Cities Served" },
  { value: "98%", label: "Satisfaction Rate" },
];

export function BeautyStats() {
  return (
    <section className="py-20 bg-hairsby-dark text-white">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-hairsby-orange sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-3 text-lg text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
