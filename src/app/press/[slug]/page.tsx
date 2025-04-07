import { getBlogBySlug } from "@/lib/api/contents/blog";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pressItem = await getBlogBySlug(params.slug);

  return {
    title: `${pressItem.title} | Hairsby Press`,
    description:
      pressItem.content ||
      `${pressItem.title} - ${pressItem.type} coverage about Hairsby`,
    keywords: [
      `${pressItem.title} press release`,
      `Hairsby ${pressItem.type}`,
      `beauty tech news ${pressItem.createdAt && new Date(pressItem.createdAt).getFullYear()}`,
      `salon platform coverage`,
      `${pressItem.author || "Hairsby"} press`,
      `beauty industry announcements`,
      `${pressItem.tags?.length && pressItem.tags.join(", ")}`,
      `business expansion news`,
      `partnership press coverage`,
    ],
    openGraph: {
      title: `${pressItem.title} | Hairsby Press`,
      description:
        pressItem.content ||
        `Press coverage about Hairsby from ${pressItem.author?.firstName}`,
      images: [
        (pressItem.files?.length && pressItem?.files[0]) ||
          "/og-hairsby-default.png",
      ],
      url: `https://hairsby.com/press/${params.slug}`,
      type: "article",
      publishedTime: pressItem.createdAt,
      authors: pressItem.author
        ? [`${pressItem.author.firstName} ${pressItem.author.lastName}`]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pressItem.title} | Hairsby Press`,
      description: pressItem.content || `Press mention: ${pressItem.title}`,
      images: [
        (pressItem.files?.length && pressItem?.files[0]) ||
          "/og-hairsby-default.png",
      ],
    },
    alternates: {
      canonical: `https://hairsby.com/press/${params.slug}`,
    },
  };
}

export default function PressPage() {
  return;
}
