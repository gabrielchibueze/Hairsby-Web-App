"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Clock, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogCategories } from "@/components/blog/blog-categories";
import { Pagination } from "@/components/ui/pagination";
import { getBlogCategories, getBlogs } from "@/lib/api/contents/blog";

type SortOption = "newest" | "oldest" | "popular";

export default function BlogComponent() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [category, setSelectedCategory] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [query, setSearchQuery] = useState("");

  // Fetch all posts without sorting
  const { data: allPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["blogPosts", query, category],
    queryFn: () => getBlogs(page, limit, category, undefined, query, "blog"), // Fetch more posts at once
  });

  // Client-side sorting
  const sortedPosts = useMemo(() => {
    if (!allPosts?.data) return [];

    const posts = [...allPosts.data];

    switch (sort) {
      case "newest":
        return posts.sort(
          (a: any, b: any) =>
            new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
        );
      case "oldest":
        return posts.sort(
          (a: any, b: any) =>
            new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime()
        );
      case "popular":
        return posts.sort(
          (a: any, b: any) =>
            (b.metadata?.views || 0) - (a.metadata?.views || 0)
        );
      default:
        return posts;
    }
  }, [allPosts, sort]);
  console.log(sortedPosts);
  // Paginate the sorted results
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedPosts.slice(start, end);
  }, [sortedPosts, page, limit]);

  const { data: categories = [] } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-b from-hairsby-orange/5 to-background overflow-hidden">
        {/* <section className="relative py-28 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden"> */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-[length:100px_100px]"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1 bg-hairsby-orange/20 text-hairsby-orange rounded-full text-sm font-medium mb-4">
                SERVICE INSIGHTS
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                The <span className="text-hairsby-orange">Hairsby</span> Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Expert tips, trend reports, and service innovations from our
                community
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b 2 pb-12 pt-0">
        <div className="container">
          <BlogCategories
            categories={categories}
            selectedCategory={category}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
          />
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container">
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={query}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9 focus-visible:ring-hairsby-orange/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Sort by:</span>
              </div>
              <Select
                value={sort}
                onValueChange={(value: SortOption) => {
                  setSort(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] focus:ring-hairsby-orange">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isPostsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] bg-muted rounded-lg" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : paginatedPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSort("newest");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              paginatedPosts.map((post, index) => (
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

          {/* Pagination */}
          {sortedPosts.length > limit && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, sortedPosts.length)} of{" "}
                {sortedPosts.length} posts
              </div>
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(sortedPosts.length / limit)}
                onPageChange={setPage}
                className="justify-center sm:justify-end"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
