"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar cop";
import { Footer } from "@/components/layout/footer";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogCategories } from "@/components/blog/blog-categories";
import { getBlogPosts, getBlogCategories } from "@/lib/api/contents/blog";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["blogPosts", searchQuery, selectedCategory],
    queryFn: () =>
      getBlogPosts({
        search: searchQuery,
        category: selectedCategory,
      }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">Beauty Blog</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Tips, trends, and insights from beauty experts
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b py-12">
        <div className="container">
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isPostsLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] bg-muted rounded-lg" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : posts.posts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              posts.posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlogPostCard post={post} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
