import Link from "next/link";
import Image from "next/image";
import { Clock, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogData } from "@/lib/api/contents/blog";

interface BlogPostCardProps {
  post: BlogData;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md dark:border-gray-800">
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.files?.[0]?.url && (
          <Image
            src={post.files[0].url}
            alt={post.title}
            fill
            className="object-cover transition-all group-hover:scale-105"
          />
        )}
        {post.category && (
          <Badge className="absolute top-2 left-2 z-10 bg-hairsby-orange hover:bg-hairsby-orange/90">
            {post.category}
          </Badge>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>
                {post.author.firstName} {post.author.lastName}
              </span>
            </div>
          )}
          {post.createdAt && (
            <>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </>
          )}
          {post.readTime && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-3 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-hairsby-orange transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.content.substring(0, 200)}...
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-muted-foreground/30 hover:bg-hairsby-orange/10 hover:text-hairsby-orange"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="link"
          className="mt-4 p-0 self-start text-hairsby-orange hover:text-hairsby-orange/80"
          asChild
        >
          <Link href={`/blog/${post.slug}`}>
            Read more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </Button>
      </div>
    </article>
  );
}
