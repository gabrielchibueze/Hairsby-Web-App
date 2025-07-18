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
import {
  Product,
  createProduct,
  updateProduct,
} from "@/lib/api/products/product";
import { compressImage, compressImages } from "@/lib/utils/image-compresssion";
import { useRouter } from "next/navigation";
// Helper function to generate variant IDs
const generateVariantId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// Custom file schema for Zod
const fileSchema = z.instanceof(File, { message: "Expected a file" });

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z
    .number({
      invalid_type_error: "Price must be a number",
      required_error: "Price is required",
    })
    .min(0, "Price must be positive"),
  discountPrice: z
    .number({
      invalid_type_error: "Discount price must be a number",
    })
    .optional(),
  stock: z
    .number({
      invalid_type_error: "Stock must be a number",
      required_error: "Stock is required",
    })
    .min(0, "Stock must be positive"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  images: fileSchema.array().min(1, "At least one image is required"),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  hasVariants: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Variant name is required"),
        price: z.number().min(0, "Price must be positive"),
        stock: z.number().min(0, "Stock must be positive"),
        images: fileSchema.array().optional(),
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
  businessEmployeeData?: any;
}

export function ProductForm({
  product,
  providerId,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
  onCancel,
  businessEmployeeData,
}: ProductFormProps) {
  const [mainPreviewUrls, setMainPreviewUrls] = useState<string[]>([]);
  const [variantPreviewUrls, setVariantPreviewUrls] = useState<
    Record<string, string[]>
  >({});
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: Number(product?.price) || 0,
      discountPrice: Number(product?.discountPrice) || undefined,
      category: product?.category || "",
      brand: product?.brand || "",
      stock: Number(product?.stock) || 0,
      images: [],
      status: product?.status || "active",
      hasVariants: product?.hasVariants || false,
      variants:
        product?.variants?.map((v) => ({
          id: v.id,
          name: v.name,
          price: Number(v.price),
          stock: Number(v.stock),
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
      if (product.images && product.images.length > 0) {
        setMainPreviewUrls(product.images);
      }

      // Set variant image previews
      const initialVariantPreviews: Record<string, string[]> = {};
      product.variants?.forEach((variant) => {
        if (variant.images && variant.images.length > 0) {
          initialVariantPreviews[variant.id] = variant.images;
        }
      });
      setVariantPreviewUrls(initialVariantPreviews);
    }

    // Cleanup function
    return () => {
      mainPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      Object.values(variantPreviewUrls).forEach((urls) => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      });
    };
  }, [product]);

  // Number input handler
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const value = parseFloat(e.target.value);
    field.onChange(isNaN(value) ? undefined : value);
  };
  // Handle main product file selection with compression
  const handleMainFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        try {
          setIsSubmitting(true);

          // Compress images before processing
          const compressedFiles = await compressImages(files);

          // Create preview URLs
          const newPreviewUrls = compressedFiles.map((file) =>
            URL.createObjectURL(file)
          );
          setMainPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

          // Set form value with compressed files
          const currentImages = form.getValues("images") || [];
          form.setValue("images", [...currentImages, ...compressedFiles]);
        } catch (error) {
          console.error("Error compressing images:", error);
          toast({
            title: "Error",
            description: "Failed to process images",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [form, setIsSubmitting]
  );

  // Handle variant file selection with compression
  // const handleVariantFileChange = async (
  //   variantId: string,
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files);

  //     try {
  //       setIsSubmitting(true);

  //       // Compress images before processing
  //       const compressedFiles = await Promise.all(
  //         files.map((file) => compressImage(file))
  //       );

  //       // Create preview URLs
  //       const newPreviewUrls = compressedFiles.map((file) =>
  //         URL.createObjectURL(file)
  //       );
  //       setVariantPreviewUrls((prev) => ({
  //         ...prev,
  //         [variantId]: [...(prev[variantId] || []), ...newPreviewUrls],
  //       }));

  //       // Update form value with compressed files
  //       const updatedVariants = variants.map((v) => {
  //         if (v.id === variantId) {
  //           const currentImages = v.images || [];
  //           return {
  //             ...v,
  //             images: [...currentImages, ...compressedFiles],
  //           };
  //         }
  //         return v;
  //       });
  //       form.setValue("variants", updatedVariants);
  //     } catch (error) {
  //       console.error("Error compressing variant images:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to process variant images",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   }
  // };

  const handleVariantFileChange = async (
    variantId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const compressedFile = await compressImage(file);
        return {
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
        };
      })
    );

    // Update previews
    setVariantPreviewUrls((prev) => ({
      ...prev,
      [variantId]: [
        ...(prev[variantId] || []),
        ...processedFiles.map((f) => f.preview),
      ],
    }));

    // Update form data
    form.setValue(
      "variants",
      form.getValues("variants")?.map((v) =>
        v.id === variantId
          ? {
              ...v,
              images: [
                ...(v.images || []),
                ...processedFiles.map((f) => f.file),
              ],
            }
          : v
      ) || []
    );
  };

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
      const updatedVariants = variants.map((v) => {
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
      id: generateVariantId(), // Generate ID immediately
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
    form.setValue("hasVariants", updatedVariants.length > 0);
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append basic fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "images" && key !== "variants" && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Append main images
      values.images.forEach((file) => {
        formData.append("images", file);
      });

      // Process variants
      if (values.variants?.length) {
        const variantsWithIds = values.variants.map((v) => ({
          ...v,
          id: v.id || generateVariantId(),
        }));

        // Append variant metadata (without images)
        formData.append(
          "variants",
          JSON.stringify(variantsWithIds.map(({ images, ...rest }) => rest))
        );

        // Append variant images with proper naming
        variantsWithIds.forEach((variant) => {
          variant.images?.forEach((file, index) => {
            const renamedFile = new File(
              [file],
              `variant-${variant.id}-${index}-${file.name.replace(/\s+/g, "-")}`,
              { type: file.type }
            );
            formData.append("variantImages", renamedFile);
          });
        });
      }

      // Include files to remove if updating
      if (product && filesToRemove.length) {
        formData.append("removedFiles", JSON.stringify(filesToRemove));
      }

      // Include provider ID
      formData.append("providerId", providerId);

      let isBusinessEmployeeSource = false;
      let businessEmployeeRedirect;
      if (
        businessEmployeeData?.businessId &&
        businessEmployeeData?.employeeId
      ) {
        isBusinessEmployeeSource = true;
        businessEmployeeRedirect =
          businessEmployeeData?.role === "business"
            ? `/provider/management/specialists/${businessEmployeeData?.employeeId}?t=products`
            : `/provider/management/organisations/${businessEmployeeData?.businessId}?t=products`;
      }

      // Send to API
      if (product) {
        await updateProduct(product.id, formData, businessEmployeeData);
        router.push(
          `${isBusinessEmployeeSource ? businessEmployeeRedirect : `/provider/products/${product.id}`}`
        );
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const newProduct = await createProduct(formData, businessEmployeeData);
        if (newProduct)
          router.push(
            `${isBusinessEmployeeSource ? businessEmployeeRedirect : `/provider/products/${newProduct.id}`}`
          );
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
                      onChange={(e) => handleNumberInput(e, field)}
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
                      onChange={(e) => handleNumberInput(e, field)}
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
                      onChange={(e) => handleNumberInput(e, field)}
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
                        className="text-muted-foreground"
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
            <h3 className="font-medium text-lg">Product Images</h3>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
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
                            className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="text-[red] text-sm">Remove</span>
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
                                onChange={(e) => handleNumberInput(e, field)}
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
                                onChange={(e) => handleNumberInput(e, field)}
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
                                handleVariantFileChange(variant.id as string, e)
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
                                    className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <span className="text-[red] text-sm">
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
          <Button type="submit" variant="brand" disabled={isSubmitting}>
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
