// import Image from "next/image";

// interface BlogContentRendererProps {
//   sections: Array<{
//     title?: string;
//     content: string;
//     files?: { url: string; type: string }[];
//   }>;
// }

// export function BlogContentRenderer({ sections }: BlogContentRendererProps) {
//   return (
//     <div className="prose prose-lg max-w-none dark:prose-invert">
//       {sections.map((section, index) => (
//         <div key={index} className="mb-8 last:mb-0">
//           {section.title && (
//             <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
//           )}

//           {section.files?.map((file, fileIndex) => (
//             <div key={fileIndex} className="my-4">
//               {file.type.startsWith("image/") ? (
//                 <div className="relative aspect-video rounded-lg overflow-hidden">
//                   <Image
//                     src={file.url}
//                     alt={`Section ${index + 1} image ${fileIndex + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="p-4 border rounded-lg">
//                   <a href={file.url} target="_blank" rel="noopener noreferrer">
//                     Download attached file
//                   </a>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div
//             className="text-muted-foreground"
//             dangerouslySetInnerHTML={{ __html: section.content }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogContentRendererProps {
  sections: Array<{
    title?: string;
    content: string;
    files?: { url: string; type: string }[];
  }>;
  className?: string;
}

export function BlogContentRenderer({
  sections,
  className,
}: BlogContentRendererProps) {
  return (
    <div
      className={cn("prose prose-lg max-w-none dark:prose-invert", className)}
    >
      {sections.map((section, index) => (
        <section key={index} className="mb-12 last:mb-0 group">
          {section.title && (
            <h2 className="text-2xl font-bold mb-6 relative before:content-[''] before:absolute before:left-[-1rem] before:top-0 before:h-full before:w-1 before:bg-hairsby-orange">
              {section.title}
            </h2>
          )}

          {section.files?.map((file, fileIndex) => (
            <div
              key={fileIndex}
              className={cn(
                "my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800",
                file?.type?.startsWith("image/")
                  ? "relative aspect-video"
                  : "p-4"
              )}
            >
              {file?.type?.startsWith("image/") ? (
                <Image
                  src={file.url}
                  alt={`Section ${index + 1} image ${fileIndex + 1}`}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="bg-hairsby-orange/10 p-2 rounded-lg">
                    <FileIcon className="w-5 h-5 text-hairsby-orange" />
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hairsby-orange hover:underline cursor-pointer"
                  >
                    Download attached file
                  </a>
                </div>
              )}
            </div>
          ))}

          <div
            className="text-muted-foreground [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>a]:text-hairsby-orange [&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-hairsby-orange [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:my-4 [&>blockquote]:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </section>
      ))}
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
