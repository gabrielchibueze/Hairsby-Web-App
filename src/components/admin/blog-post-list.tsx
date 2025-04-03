"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dummyPosts = [
  {
    id: "1",
    title: "Top Hair Trends for 2025",
    status: "published",
    author: "Sarah Johnson",
    publishDate: "2025-02-25",
    views: 1250,
  },
  {
    id: "2",
    title: "Essential Skincare Routine",
    status: "draft",
    author: "Emily Chen",
    publishDate: null,
    views: 0,
  },
];

export function BlogPostList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span
                    className={cn(
                      "capitalize",
                      post.status === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    )}
                  >
                    {post.status}
                  </span>
                  {post.publishDate && (
                    <>
                      <span>•</span>
                      <span>{format(new Date(post.publishDate), "PP")}</span>
                    </>
                  )}
                  {post.views > 0 && (
                    <>
                      <span>•</span>
                      <span>{post.views} views</span>
                    </>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
