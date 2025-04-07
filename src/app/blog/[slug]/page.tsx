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
      `${post.title} - Read this article on Hairsby's beauty blog`,
    keywords: [
      `${post.title} article`,
      `beauty blog ${post.category}`,
      `${post.tags?.length && post?.tags.join(", ")}`,
      `hair care tips ${post.createdAt && new Date(post?.createdAt).getFullYear()}`,
      `beauty industry insights`,
      `${post.author} blog post`,
      `latest beauty trends`,
      `${post.title.toLowerCase()}`,
      `professional ${post.category} advice`,
      `salon business tips`,
    ],
    openGraph: {
      title: `${post.title} | Hairsby Blog`,
      description:
        post.title || `Read this beauty blog post about ${post.title}`,
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
