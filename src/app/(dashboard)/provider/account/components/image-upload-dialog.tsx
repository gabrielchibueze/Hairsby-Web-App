// app/(provider)/settings/components/image-upload-dialog.tsx
"use client";

import { useState } from "react";
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

const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size < 5 * 1024 * 1024,
      "File size must be less than 5MB"
    ),
  caption: z.string().min(3, "Caption must be at least 3 characters"),
});

export function ImageUploadDialog({
  open,
  onOpenChange,
  onSubmit,
  disabled,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File, caption: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      caption: "",
    },
  });

  const fileRef = form.register("file");

  const handleSubmit = (values: z.infer<typeof uploadSchema>) => {
    onSubmit(values.file, values.caption);
    form.reset();
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue("file", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div onClick={() => !disabled && onOpenChange(true)}>{children}</div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Gallery Image</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
                        <Input
                          type="file"
                          accept="image/*"
                          {...fileRef}
                          onChange={handleFileChange}
                        />
                        {preview && (
                          <ImagePreview
                            src={preview}
                            alt="Preview"
                            className="mt-4 max-h-48"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                  Upload
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
