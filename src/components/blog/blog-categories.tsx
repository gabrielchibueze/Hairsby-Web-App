"use client";

import { motion } from "framer-motion";
import type { BlogCategory } from "@/lib/api/contents/blog";

interface BlogCategoriesProps {
  categories: BlogCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogCategories({
  categories,
  selectedCategory,
  onCategoryChange,
}: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategory === ""
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        }`}
        onClick={() => onCategoryChange("")}
      >
        All Posts
      </motion.button>
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
}
