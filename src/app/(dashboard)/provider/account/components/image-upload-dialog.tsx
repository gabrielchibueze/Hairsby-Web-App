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
    .any()
    .refine((file) => file instanceof File, "Please upload a file")
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
      file: undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof uploadSchema>) => {
    onSubmit(values.file, values.caption);
    form.reset();
    setPreview(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
                        <Input
                          type="file"
                          accept="image/*"
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
                  onClick={() => {
                    onOpenChange(false);
                    form.reset();
                    setPreview(null);
                  }}
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
