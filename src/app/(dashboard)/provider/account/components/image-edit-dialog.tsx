// app/(provider)/settings/components/image-edit-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/ui/image-preview";
import { GalleryImage } from "@/lib/api/accounts/provider";

const editSchema = z.object({
  caption: z.string().min(3, "Caption must be at least 3 characters"),
});

export function ImageEditDialog({
  open,
  onOpenChange,
  image,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: GalleryImage;
  onSubmit: (caption: string) => void;
}) {
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      caption: image.caption,
    },
  });

  const handleSubmit = (values: z.infer<typeof editSchema>) => {
    onSubmit(values.caption);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ImagePreview
              src={image.url as string}
              alt={image.caption as string}
              className="w-full"
            />

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
