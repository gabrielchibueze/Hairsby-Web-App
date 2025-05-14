"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImagePreview({
  src,
  alt,
  className,
  width = 300,
  height = 200,
}: ImagePreviewProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
      />
    </div>
  );
}