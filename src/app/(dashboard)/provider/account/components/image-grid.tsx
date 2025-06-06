"use client";

import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/ui/image-preview";
import { GalleryImage } from "@/lib/api/accounts/provider";
import { Pencil, Trash2 } from "lucide-react";

interface ImageGridProps {
  images: GalleryImage[];
  onEdit: (image: any) => void;
  onRemove: (id: string) => void;
}

export function ImageGrid({ images, onEdit, onRemove }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group relative">
          <ImagePreview
            src={image.url as string}
            alt={image.caption as string}
            className="h-48"
          />
          <div className="mt-2 text-sm font-medium line-clamp-1">
            {image.caption}
          </div>
          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-card/20"
              onClick={() => onEdit(image)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-card/20"
              onClick={() => onRemove(image.id as string)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
