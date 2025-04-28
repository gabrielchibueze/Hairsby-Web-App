"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Product,
  createProduct,
  updateProduct,
} from "@/lib/api/products/product";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Define the schema with proper types
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.number().min(0, "Stock must be positive"),
  images: z.instanceof(File).array().min(1, "At least one image is required"),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  hasVariants: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Variant name is required"),
        price: z.number().min(0, "Price must be positive"),
        stock: z.number().min(0, "Stock must be positive"),
        images: z.instanceof(File).array().optional(),
      })
    )
    .optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product: Product | null;
  providerId: string;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({
  product,
  providerId,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [mainPreviewUrls, setMainPreviewUrls] = useState<string[]>([]);
  const [variantPreviewUrls, setVariantPreviewUrls] = useState<
    Record<string, string[]>
  >({});
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      discountPrice: product?.discountPrice || undefined,
      category: product?.category || "",
      brand: product?.brand || "",
      stock: product?.stock || 0,
      images: [],
      status: product?.status || "active",
      hasVariants: product?.hasVariants || false,
      variants:
        product?.variants?.map((v) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          stock: v.stock,
          images: [],
        })) || [],
    },
  });

  const hasVariants = form.watch("hasVariants");
  const variants = form.watch("variants") || [];

  // Initialize previews for existing product
  useEffect(() => {
    if (product) {
      // Set main product image previews
      if (product.images && product.images?.length > 0) {
        setMainPreviewUrls(product.images);
      }

      // Set variant image previews
      const initialVariantPreviews: Record<string, string[]> = {};
      product.variants?.forEach((variant) => {
        if (variant.images && variant.images?.length > 0) {
          initialVariantPreviews[variant.id] = variant.images;
        }
      });
      setVariantPreviewUrls(initialVariantPreviews);
    }
  }, [product]);

  // Handle main product file selection
  const handleMainFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        // Create preview URLs
        const newPreviewUrls = files?.map((file) => URL.createObjectURL(file));
        setMainPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

        // Set form value
        const currentImages = form.getValues("images") || [];
        form.setValue("images", [...currentImages, ...files]);
      }
    },
    [form]
  );

  // Handle variant file selection
  const handleVariantFileChange = useCallback(
    (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        // Create preview URLs
        const newPreviewUrls = files?.map((file) => URL.createObjectURL(file));
        setVariantPreviewUrls((prev) => ({
          ...prev,
          [variantId]: [...(prev[variantId] || []), ...newPreviewUrls],
        }));

        // Update form value
        const updatedVariants = variants?.map((v) => {
          if (v.id === variantId) {
            const currentImages = v.images || [];
            return {
              ...v,
              images: [...currentImages, ...files],
            };
          }
          return v;
        });
        form.setValue("variants", updatedVariants);
      }
    },
    [form, variants]
  );

  // Remove a main product file
  const handleRemoveMainFile = useCallback(
    (index: number) => {
      const currentImages = form.getValues("images") || [];
      const updatedImages = [...currentImages];
      updatedImages.splice(index, 1);

      // Update preview URLs
      const updatedPreviewUrls = [...mainPreviewUrls];
      URL.revokeObjectURL(updatedPreviewUrls[index]);
      updatedPreviewUrls.splice(index, 1);
      setMainPreviewUrls(updatedPreviewUrls);

      // Update form value
      form.setValue("images", updatedImages);

      // If this was an existing image, add to files to remove
      if (product?.images?.[index]) {
        setFilesToRemove((prev) => [...prev, product.images[index]]);
      }
    },
    [form, mainPreviewUrls, product?.images]
  );

  // Remove a variant file
  const handleRemoveVariantFile = useCallback(
    (variantId: string, index: number) => {
      const updatedVariants = variants?.map((v) => {
        if (v.id === variantId) {
          const currentImages = v.images || [];
          const updatedImages = [...currentImages];
          updatedImages.splice(index, 1);

          // Update preview URLs
          const updatedPreviewUrls = [...(variantPreviewUrls[variantId] || [])];
          URL.revokeObjectURL(updatedPreviewUrls[index]);
          updatedPreviewUrls.splice(index, 1);
          setVariantPreviewUrls((prev) => ({
            ...prev,
            [variantId]: updatedPreviewUrls,
          }));

          return {
            ...v,
            images: updatedImages,
          };
        }
        return v;
      });

      form.setValue("variants", updatedVariants);
    },
    [form, variants, variantPreviewUrls]
  );

  const addVariant = () => {
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: "",
      price: 0,
      stock: 0,
      images: [],
    };
    form.setValue("variants", [...variants, newVariant]);
    form.setValue("hasVariants", true);
  };

  const removeVariant = (index: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    form.setValue("variants", updatedVariants);
    form.setValue("hasVariants", updatedVariants?.length > 0);
  };

  // Handle form submission
  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "images" && value) {
          // Handle main product images
          (value as File[]).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });
        } else if (key === "variants" && value) {
          // Handle variants
          (value as any[]).forEach((variant, variantIndex) => {
            formData.append(`variants[${variantIndex}][name]`, variant.name);
            formData.append(
              `variants[${variantIndex}][price]`,
              variant.price.toString()
            );
            formData.append(
              `variants[${variantIndex}][stock]`,
              variant.stock.toString()
            );

            if (variant.images) {
              variant.images.forEach((file: File, fileIndex: number) => {
                formData.append(
                  `variants[${variantIndex}][images][${fileIndex}]`,
                  file
                );
              });
            }
          });
        } else if (value !== undefined && value !== null) {
          // Handle other fields
          formData.append(key, value.toString());
        }
      });

      // Include provider ID
      formData.append("providerId", providerId);

      // Include files to remove for updates
      if (product && filesToRemove?.length > 0) {
        formData.append("removedImages", JSON.stringify(filesToRemove));
      }

      if (product) {
        await updateProduct(product.id, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProduct(formData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-medium text-lg">Basic Information</h3>
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
                      placeholder="Enter product description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Pricing</h3>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Price (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Set a discounted price for sales and promotions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Inventory</h3>
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
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
                    value={field.value}
                    disabled={field.value === "out_of_stock"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem
                        value="out_of_stock"
                        disabled
                        className="text-gray-400"
                      >
                        Out of Stock (auto)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Organization</h3>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Hair Care" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g. Hairsby" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-medium text-lg">Images</h3>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="product-images">
                      Upload Images (Max 6)
                    </Label>
                    <Input
                      id="product-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMainFileChange}
                      className="cursor-pointer"
                    />
                    <FormDescription>
                      Upload high-quality images of your product (JPG, PNG)
                    </FormDescription>
                  </div>

                  {/* Image Previews */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {mainPreviewUrls?.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-md overflow-hidden">
                          <img
                            src={url}
                            alt={`Product preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMainFile(index)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="text-white text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Variants */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Variants</h3>
              <FormField
                control={form.control}
                name="hasVariants"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) {
                            form.setValue("variants", []);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>This product has variants</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {hasVariants && (
              <div className="space-y-4">
                {variants?.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Variant #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Size, Color"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`variants.${index}.images`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant Images (optional)</FormLabel>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor={`variant-${variant.id}-images`}>
                              Upload Images (Max 3)
                            </Label>
                            <Input
                              id={`variant-${variant.id}-images`}
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) =>
                                handleVariantFileChange(
                                  variant?.id as string,
                                  e
                                )
                              }
                              className="cursor-pointer"
                            />
                            <FormDescription>
                              Upload images specific to this variant
                            </FormDescription>
                          </div>

                          {/* Variant Image Previews */}
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {(
                              (variant.id && variantPreviewUrls[variant.id]) ||
                              []
                            )?.map((url: string, imgIndex: number) => (
                              <div key={imgIndex} className="relative group">
                                <div className="aspect-square relative rounded-md overflow-hidden">
                                  <img
                                    src={url}
                                    alt={`Variant ${index + 1} preview ${imgIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveVariantFile(
                                        variant.id as string,
                                        imgIndex
                                      )
                                    }
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <span className="text-white text-sm">
                                      Remove
                                    </span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full"
                >
                  Add Variant
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-hairsby-orange hover:bg-hairsby-orange/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? "Updating..." : "Creating..."}
              </>
            ) : product ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
