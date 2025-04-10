import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/api/contents/blog";
import Image from "next/image";
import { Calendar, Newspaper, Download, ArrowLeft } from "lucide-react";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function PressDetailsComponent({
  params,
}: {
  params: { slug: string };
}) {
  const release = await getBlogBySlug(params.slug);
  if (!release || release.type !== "press") return notFound();

  // Fetch related press releases
  const relatedReleases = await getBlogs(
    1,
    3,
    undefined,
    undefined,
    undefined,
    "press"
  ).then((res) => res.data.filter((item) => item.slug !== release.slug));

  return (
    <main className="bg-white dark:bg-gray-950">
      {/* Back Button */}
      <div className="container py-6">
        <Button asChild variant="ghost" className="text-hairsby-orange">
          <Link href="/press" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Press
          </Link>
        </Button>
      </div>

      {/* Press Header */}
      <section className="container max-w-4xl py-12">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="w-6 h-6 text-hairsby-orange" />
          <span className="text-sm font-medium text-hairsby-orange">
            PRESS RELEASE
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          {release.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{`${
              release.createdAt && formatDate(release.createdAt)
            }`}</span>
          </div>
          {release.readTime && <span>• {release.readTime} read</span>}
        </div>

        {release.files?.[0]?.url && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-12 border border-gray-200 dark:border-gray-800">
            <Image
              src={release.files[0].url}
              alt={release.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </section>
      <section className="container max-w-2xl pb-16">
        <p>{release.content && release.content}</p>
      </section>
      {/* <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-hairsby-orange prose-a:text-hairsby-orange pb-6">
        {release.content && (
          <div dangerouslySetInnerHTML={{ __html: release.content }} />
        )}
      </div> */}
      {/* Press Content */}
      <section className="container max-w-2xl pb-16">
        <BlogContentRenderer
          sections={release.sections || [{ content: release.content }]}
        />

        {/* Downloads */}
        {release.files && release.files.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-hairsby-orange" />
              Press Assets
            </h3>
            <div className="space-y-2">
              {release.files.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  download
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                    <Download className="h-5 w-5 text-hairsby-orange" />
                  </div>
                  <div>
                    <p className="font-medium">Attachment {index + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.type} •{/* {file.url.split("/").pop()} */}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Related Press */}
      {relatedReleases.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Related Press Releases</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedReleases.map((item) => (
                <article
                  key={item.slug}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/press/${item.slug}`} className="block h-full">
                    {item.files?.[0]?.url && (
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                        <Image
                          src={item.files[0].url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {`${item.createdAt && new Date(item?.createdAt).toLocaleDateString()}`}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 hover:text-hairsby-orange transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {item.content.substring(0, 120)}...
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
