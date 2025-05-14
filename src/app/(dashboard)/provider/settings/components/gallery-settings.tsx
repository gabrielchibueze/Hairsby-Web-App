// app/(provider)/settings/components/gallery-settings.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getGallery, addToGallery, removeFromGallery, updateGalleryPhoto, GalleryImage } from "@/lib/api/accounts/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploadDialog } from "./image-upload-dialog";
import { ImageEditDialog } from "./image-edit-dialog";
import { ImageGrid } from "./image-grid";

export function GallerySettings() {
  const [loading, setLoading] = useState(true);
  // const [gallery, setGallery] = useState<any[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<any>(null);
  
const [gallery, setGallery] = useState<GalleryImage[]>([]);
const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        setGallery(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load gallery",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [toast]);

  // const handleAddImage = async (file: File, caption: string) => {
  //   try {
  //     setLoading(true);
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("caption", caption);
  //     const newImage = await addToGallery(formData);
  //     setGallery([...gallery, newImage]);
  //     toast({
  //       title: "Success",
  //       description: "Image added to gallery",
  //     });
  //     setUploadDialogOpen(false);
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Failed to add image to gallery",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddImage = async (file: File, caption: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      const newImage = await addToGallery(formData);
      setGallery([...gallery, newImage]);
      toast({
        title: "Success",
        description: "Image added to gallery",
      });
      setUploadDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to add image to gallery",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateImage = async (id: string, caption: string) => {
    try {
      setLoading(true);
      const updatedImage = await updateGalleryPhoto(id, { caption });
      setGallery(
        gallery.map((img) => (img.id === id ? updatedImage : img))
      );
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update image",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (id: string) => {
    try {
      setLoading(true);
      await removeFromGallery(id);
      setGallery(gallery.filter((img) => img.id !== id));
      toast({
        title: "Success",
        description: "Image removed from gallery",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove image",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>
                Showcase your work with up to 5 photos
              </CardDescription>
            </div>
            <ImageUploadDialog
              open={uploadDialogOpen}
              onOpenChange={setUploadDialogOpen}
              onSubmit={handleAddImage}
              disabled={gallery.length >= 5}
            >
              <Button
                className="bg-hairsby-orange hover:bg-hairsby-orange/90"
                disabled={gallery.length >= 5}
              >
                Add Photo
              </Button>
            </ImageUploadDialog>
          </div>
        </CardHeader>
        <CardContent>
          {gallery.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Your gallery is empty
              </p>
              <Button
                className="bg-hairsby-orange hover:bg-hairsby-orange/90"
                onClick={() => setUploadDialogOpen(true)}
              >
                Add Your First Photo
              </Button>
            </div>
          ) : (
            <ImageGrid
              images={gallery}
              onEdit={(image) => {
                setSelectedImage(image);
                setEditDialogOpen(true);
              }}
              onRemove={handleRemoveImage}
            />
          )}
        </CardContent>
      </Card>

      {selectedImage && (
        <ImageEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          image={selectedImage as GalleryImage}
          onSubmit={(caption) => handleUpdateImage(selectedImage.id as string, caption)}
        />
      )}
    </div>
  );
}