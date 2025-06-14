// import Link from "next/link";
// import Image from "next/image";
// import { BlogData } from "@/lib/api/contents/blog";
// import { Button } from "@/components/ui/button";

// interface BlogSidebarProps {
//   suggestedPosts: BlogData[];
//   recentPosts: BlogData[];
//   currentPostSlug?: string;
// }

// export function BlogSidebar({
//   suggestedPosts,
//   recentPosts,
//   currentPostSlug,
// }: BlogSidebarProps) {
//   return (
//     <aside className="space-y-8">
//       {/* Suggested Posts */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Suggested Articles</h3>
//         <div className="space-y-4">
//           {suggestedPosts
//             .filter((post) => post.slug !== currentPostSlug)
//             .slice(0, 3)
//             .map((post) => (
//               <Link
//                 key={post.slug}
//                 href={`/blog/${post.slug}`}
//                 className="group block"
//               >
//                 <div className="flex gap-3">
//                   {post.files?.[0]?.url && (
//                     <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
//                       <Image
//                         src={post.files[0].url}
//                         alt={post.title}
//                         fill
//                         className="object-cover transition-all group-hover:scale-105"
//                       />
//                     </div>
//                   )}
//                   <div>
//                     <h4 className="font-medium group-hover:underline line-clamp-2">
//                       {post.title}
//                     </h4>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(post.createdAt || "").toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//         </div>
//       </div>

//       {/* Recent Posts */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Recent Articles</h3>
//         <div className="space-y-2">
//           {recentPosts
//             .filter((post) => post.slug !== currentPostSlug)
//             .slice(0, 5)
//             .map((post) => (
//               <Link
//                 key={post.slug}
//                 href={`/blog/${post.slug}`}
//                 className="block text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 {post.title}
//               </Link>
//             ))}
//         </div>
//       </div>

//       {/* Categories */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Categories</h3>
//         <div className="flex flex-wrap gap-2">
//           {Array.from(
//             new Set(
//               [
//                 ...suggestedPosts.map((p) => p.category),
//                 ...recentPosts.map((p) => p.category),
//               ].filter(Boolean)
//             )
//           ).map((category) => (
//             <Button
//               key={category}
//               variant="outline"
//               size="sm"
//               className="rounded-full capitalize"
//               asChild
//             >
//               <Link href={`/blog?category=${category}`}>{category}</Link>
//             </Button>
//           ))}
//         </div>
//       </div>
//     </aside>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import { BlogData } from "@/lib/api/contents/blog";
import { Button } from "@/components/ui/button";
import { Clock, Tag } from "lucide-react";
import { Input } from "../ui/input";

interface BlogSidebarProps {
  suggestedPosts: BlogData[];
  recentPosts: BlogData[];
  currentPostSlug?: string;
  className?: string;
}

export function BlogSidebar({
  suggestedPosts,
  recentPosts,
  currentPostSlug,
  className = "",
}: BlogSidebarProps) {
  // Extract unique categories from both post lists
  const allCategories = Array.from(
    new Set([
      ...suggestedPosts.map((p) => p.category).filter(Boolean),
      ...recentPosts.map((p) => p.category).filter(Boolean),
    ])
  );

  return (
    <aside className={`space-y-8 ${className}`}>
      {/* About Section */}
      <div className="bg-hairsby-orange/5 p-6 rounded-lg border border-hairsby-orange/20">
        <h3 className="text-lg font-semibold mb-3 text-hairsby-orange">
          About Hairsby
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Discover service tips, trends, and expert advice from the Hairsby
          community.
        </p>
        <Button
          asChild
          variant="outline"
          className="w-full border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
        >
          <Link href="/about">Learn More</Link>
        </Button>
      </div>

      {/* Suggested Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hairsby-orange"></span>
          Suggested Articles
        </h3>
        <div className="space-y-4">
          {suggestedPosts
            .filter((post) => post.slug !== currentPostSlug)
            .slice(0, 3)
            .map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block transition-colors hover:text-hairsby-orange"
              >
                <div className="flex gap-3">
                  {post.files?.[0]?.url && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                      <Image
                        src={post.files[0].url}
                        alt={post.title}
                        fill
                        className="object-cover transition-all group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium group-hover:underline line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      )}
                      {post.category && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-hairsby-orange/10 text-hairsby-orange">
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hairsby-orange"></span>
          Recent Articles
        </h3>
        <div className="space-y-3">
          {recentPosts
            .filter((post) => post.slug !== currentPostSlug)
            .slice(0, 5)
            .map((post) => (
              <div key={post.slug} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-hairsby-orange flex-shrink-0"></span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm hover:underline text-muted-foreground hover:text-hairsby-orange transition-colors"
                >
                  {post.title}
                </Link>
              </div>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hairsby-orange"></span>
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="rounded-full capitalize border-muted-foreground/30 hover:border-hairsby-orange hover:text-hairsby-orange"
              asChild
            >
              <Link href={`/blog?category=${category}`}>{category}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-hairsby-orange/5 p-6 rounded-lg border border-hairsby-orange/20">
        <h3 className="text-lg font-semibold mb-2 text-hairsby-orange">
          Stay Updated
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest service tips and trends delivered to your inbox.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Your email"
            className="flex-1 focus-visible:ring-hairsby-orange/50"
          />
          <Button variant="brand">Subscribe</Button>
        </div>
      </div>
    </aside>
  );
}
