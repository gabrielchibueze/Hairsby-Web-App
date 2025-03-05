"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { BlogPost } from "@/lib/api/contents/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {post.readTime}
            </div>
          </div>
          <h3 className="line-clamp-2 text-xl font-semibold group-hover:text-primary">
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </h3>
          <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={post.author.photo}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm">{post.author.name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {format(new Date(post.publishedAt), "PP")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
