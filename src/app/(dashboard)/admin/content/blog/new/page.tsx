"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createBlogPost } from "@/lib/api/accounts/admin";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  status: z.enum(["draft", "published"]),
  tags: z.string().optional(),
});

export default function NewBlogPostPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      excerpt: "",
      status: "draft",
      tags: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append form values
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      await createBlogPost(formData);

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      // Redirect to blog posts list
      window.location.href = "/admin/content";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/admin/content">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </a>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Blog Post</CardTitle>
          <CardDescription>Create a new blog post</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Blog Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Blog Images</label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-video overflow-hidden rounded-lg border"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Blog image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1"
                        onClick={() => removeImage(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  {images.length < 5 && (
                    <motion.label
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed"
                    >
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-xs text-muted-foreground">
                          Add Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </motion.label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images. First image will be the cover image.
                </p>
              </div>

              {/* Blog Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the blog post"
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog post content"
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hair">Hair</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="nails">Nails</SelectItem>
                            <SelectItem value="wellness">Wellness</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" asChild>
                  <a href="/admin/content">Cancel</a>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
