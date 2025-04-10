import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs, BlogData } from "@/lib/api/contents/blog";
import Image from "next/image";
import { CalendarDays, Clock, Tag, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailsComponent({
  params,
}: BlogPostPageProps) {
  const post = await getBlogBySlug(params.slug);
  if (!post) return notFound();

  // Fetch suggested and recent posts
  const suggestedPosts = await getBlogs(1, 5, post.category).then(
    (res) => res.data
  );
  const recentPosts = await getBlogs(1, 5).then((res) => res.data);

  return (
    <main className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <BlogSidebar
              suggestedPosts={suggestedPosts}
              recentPosts={recentPosts}
              currentPostSlug={post.slug}
            />
          </div>

          {/* Main Content */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            {/* Post Header */}
            <header className="mb-8">
              {post.category && (
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-hairsby-orange/10 text-hairsby-orange mb-4">
                  {post.category}
                </span>
              )}

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.photo && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={post.author.photo}
                          alt={`${post.author.firstName} ${post.author.lastName}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span>
                      {post.author.firstName} {post.author.lastName}
                    </span>
                  </div>
                )}

                {post.createdAt && (
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                )}

                {post.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                )}
              </div>

              {post.files?.[0]?.url && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
                  <Image
                    src={post.files[0].url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </header>
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-hairsby-orange prose-a:text-hairsby-orange py-6">
              {post.content && (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              )}
            </div>
            {/* Post Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-hairsby-orange prose-a:text-hairsby-orange">
              {post.sections && post.sections.length > 0 && (
                <BlogContentRenderer sections={post.sections} />
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <footer className="mt-12 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-hairsby-orange" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-hairsby-orange/10 text-hairsby-orange hover:bg-hairsby-orange/20 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </footer>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}
