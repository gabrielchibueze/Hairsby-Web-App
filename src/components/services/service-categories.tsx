"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { getServiceCategories } from "@/lib/api/services"

export function ServiceCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: getServiceCategories
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, index) => (
        <motion.a
          key={category.id}
          href={`/services/category/${category.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
            {category.icon}
          </div>
          <div>
            <h3 className="font-medium group-hover:text-accent-foreground">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  )
}