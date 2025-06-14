"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Calendar, Newspaper, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Pagination } from "@/components/ui/pagination";
import { getBlogs } from "@/lib/api/contents/blog";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export default function PressPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [query, setSearchQuery] = useState("");

  // Fetch only press articles
  const { data: allPress, isLoading } = useQuery({
    queryKey: ["pressArticles", query],
    queryFn: () => getBlogs(1, 100, undefined, undefined, query, "press"),
    // keepPreviousData: true,
  });

  // Filter and sort press releases
  const filteredPress = useMemo(() => {
    if (!allPress?.data) return [];
    return [...allPress?.data].sort(
      (a: any, b: any) =>
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
    );
  }, [allPress]);
  // Paginate results
  const paginatedPress = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPress.slice(start, start + limit);
  }, [filteredPress, page, limit]);

  return (
    <main>
      {/* Hero Section - Press Style */}
      <section className="relative py-28 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <Newspaper className="w-12 h-12 text-hairsby-orange" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Hairsby <span className="text-hairsby-orange">Press</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Official announcements, media coverage, and company news
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 bg-hairsby-orange hover:bg-amber-600"
              >
                <a href="#media-kit" className="flex items-center gap-2">
                  Download Media Kit <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          {/* Search */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search press releases..."
                value={query}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9 focus-visible:ring-hairsby-orange/50"
              />
            </div>
          </div>

          {/* Press Grid - More formal layout */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] bg-muted rounded-lg" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : paginatedPress.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No press releases found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              paginatedPress.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <article className="h-full flex flex-col">
                    {article.files?.[0]?.url && (
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                        <Image
                          src={article.files[0].url}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {article.createdAt && formatDate(article.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        <a
                          href={`/press/${article.slug}`}
                          className="hover:text-hairsby-orange transition-colors"
                        >
                          {article.title}
                        </a>
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.content.substring(0, 200)}...
                      </p>
                      <Button
                        variant="brand"
                        className="mt-auto w-full"
                        asChild
                      >
                        <a href={`/press/${article.slug}`}>Read Release</a>
                      </Button>
                    </div>
                  </article>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredPress.length > limit && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(filteredPress.length / limit)}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </section>

      {/* Media Kit Section */}
      <section id="media-kit" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Media Resources</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Download official Hairsby brand assets, logos, and press materials
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Brand Guidelines",
                  description: "Complete visual identity standards",
                  buttonText: "Download PDF",
                },
                {
                  title: "Press Photos",
                  description: "High-resolution company images",
                  buttonText: "Download ZIP",
                },
                {
                  title: "Company Fact Sheet",
                  description: "Key facts and executive bios",
                  buttonText: "Download PDF",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <Button variant="brandline">{item.buttonText}</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
