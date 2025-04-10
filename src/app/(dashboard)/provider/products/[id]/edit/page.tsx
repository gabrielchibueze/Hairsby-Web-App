"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getProductById, updateProduct } from "@/lib/api/products/product";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  isAvailable: z.boolean().default(true),
});

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [images, setImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: product } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductById(params.id),
    enabled: !!params.id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price.toString() || "",
      stock: product?.stock.toString() || "",
      category: product?.category || "",
      brand: product?.brand || "",
      isAvailable: product?.isAvailable || true,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (
    index: number,
    isExisting: boolean,
    imageUrl?: string
  ) => {
    if (isExisting && imageUrl) {
      setRemovedImages((prev) => [...prev, imageUrl]);
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        stock: Number(values.stock),
        category: values.category,
        brand: values.brand,
        isAvailable: values.isAvailable,
        images: images,
        removedImages: removedImages,
      };

      await updateProduct(params.id, removedImages, payload);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      window.location.href = "/provider/products";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!product) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/provider/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </a>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update your product details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Images</label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {product.images.map((image: string, index: number) => (
                    <motion.div
                      key={`existing-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1"
                        onClick={() => removeImage(index, true, image)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  {images.map((image, index) => (
                    <motion.div
                      key={`new-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1"
                        onClick={() => removeImage(index, false)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  {product.images.length + images.length < 5 && (
                    <motion.label
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed"
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
              {/* Product Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product"
                          className="min-h-[100px]"
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              £
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Enter stock quantity"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                            <SelectItem value="hair">Hair Care</SelectItem>
                            <SelectItem value="skin">Skin Care</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                            <SelectItem value="tools">
                              Tools & Accessories
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Available for Sale</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Customers can purchase this product
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" asChild>
                  <a href="/provider/products">Cancel</a>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
