import { getBlogBySlug } from "@/lib/api/contents/blog";
import { Metadata } from "next";
import BlogDetailsComponent from "./blogDetails";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);

  return {
    title: `${post.title} | Hairsby Blog`,
    description:
      post.title ||
      `${post.title} - Read this article on Hairsby's service blog`,
    keywords: [
      `${post.title} article`,
      `service blog ${post.category}`,
      `${post.tags?.length && post?.tags.join(", ")}`,
      `hair care tips ${post.createdAt && new Date(post?.createdAt).getFullYear()}`,
      `service industry insights`,
      `${post.author} blog post`,
      `latest service trends`,
      `${post.title.toLowerCase()}`,
      `professional ${post.category} advice`,
      `pro business tips`,
    ],
    openGraph: {
      title: `${post.title} | Hairsby Blog`,
      description:
        post.title || `Read this service blog post about ${post.title}`,
      images: `${post.files?.length && [post?.files[0] || "/og-hairsby-default.png"]}`,
      url: `https://hairsby.com/blog/${params.slug}`,
      type: "article",
      publishedTime: post.createdAt,
      authors: [`${post.author?.firstName} ${post.author?.lastName}`],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Hairsby Blog`,
      description: post.title || `New blog post: ${post.title}`,
      images: `${post.files?.length && [post?.files[0] || "/og-hairsby-default.png"]}`,
    },
    alternates: {
      canonical: `https://hairsby.com/blog/${params.slug}`,
    },
  };
}
export default function BlogPage({ params }: { params: { slug: string } }) {
  return <BlogDetailsComponent params={params} />;
}
