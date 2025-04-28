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
  Service,
  createService,
  updateService,
  getServiceCategories,
} from "@/lib/api/services/service";
import { Badge } from "@/components/ui/badge";

// Define the schema with proper types
const serviceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  category: z.string().min(1, "Category is required"),
  images: z.instanceof(File).array().optional(),
  isPackage: z.boolean().default(false),
  packageServices: z.array(z.string()).optional(),
  isAvailable: z.boolean().default(true),
  requiresAdvancePayment: z.boolean().default(false),
  advancePaymentAmount: z.number().optional(),
  advancePaymentType: z.enum(["fixed", "percentage"]).optional(),
  cancellationPolicy: z
    .enum(["flexible", "moderate", "strict"])
    .default("moderate"),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service: Service | null;
  providerId: string;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ServiceForm({
  service,
  providerId,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
  onCancel,
}: ServiceFormProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      price: service?.price || 0,
      discountPrice: service?.discountPrice || undefined,
      duration: service?.duration || 60,
      category: service?.category || "",
      images: undefined,
      isPackage: service?.isPackage || false,
      packageServices: service?.packageServices || [],
      isAvailable: service?.isAvailable ?? true,
      requiresAdvancePayment: service?.requiresAdvancePayment || false,
      advancePaymentAmount: service?.advancePaymentAmount || undefined,
      advancePaymentType: service?.advancePaymentType || undefined,
      cancellationPolicy: service?.cancellationPolicy || "moderate",
    },
  });

  const isPackage = form.watch("isPackage");
  const requiresAdvancePayment = form.watch("requiresAdvancePayment");
  const advancePaymentType = form.watch("advancePaymentType");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getServiceCategories();
        setCategories(data.map((cat: any) => cat.name));
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load service categories",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, []);

  // Handle file selection
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        // Create preview URLs
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

        // Set form value
        const currentImages = form.getValues("images") || [];
        form.setValue("images", [...currentImages, ...files]);
      }
    },
    [form]
  );

  // Remove a file from preview and form values
  const handleRemoveFile = useCallback(
    (index: number) => {
      const currentImages = form.getValues("images") || [];
      const updatedImages = [...currentImages];
      updatedImages.splice(index, 1);

      // Update preview URLs
      const updatedPreviewUrls = [...previewUrls];
      URL.revokeObjectURL(updatedPreviewUrls[index]);
      updatedPreviewUrls.splice(index, 1);
      setPreviewUrls(updatedPreviewUrls);

      // Update form value
      form.setValue("images", updatedImages);
    },
    [form, previewUrls]
  );

  // Handle form submission
  const onSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "images" && value) {
          // Handle files array
          (value as File[]).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });
        } else if (value !== undefined && value !== null) {
          // Handle other fields
          formData.append(key, value.toString());
        }
      });

      // Include files to remove for updates
      if (service && filesToRemove.length > 0) {
        formData.append("removedFiles", JSON.stringify(filesToRemove));
      }

      if (service) {
        await updateService(service.id, formData);
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        await createService(formData);
        toast({
          title: "Success",
          description: "Service created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting service:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process service",
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
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
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
                      placeholder="Describe your service in detail"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Pricing & Duration</h3>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (£)</FormLabel>
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
                  <FormLabel>Discount Price (£) - Optional</FormLabel>
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
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="60"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {Math.floor(field.value / 60)} hour(s) {field.value % 60}{" "}
                    minute(s)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Service Images</h3>
            <div className="flex flex-col gap-2">
              <Label htmlFor="service-images">Upload Images (Max 5)</Label>
              <Input
                id="service-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <FormDescription>
                Upload high-quality images of your service (JPG, PNG)
              </FormDescription>
            </div>

            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-md overflow-hidden">
                    <img
                      src={url}
                      alt={`Service preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Service Type</h3>
            <FormField
              control={form.control}
              name="isPackage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>This is a service package</FormLabel>
                    <FormDescription>
                      Packages combine multiple services into one offering
                    </FormDescription>
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
            {isPackage && (
              <FormField
                control={form.control}
                name="packageServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Included Services</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="Search for services to include"
                          // Implement service search and selection here
                        />
                        {field.value && field.value?.length > 0 && (
                          <div className="space-y-2">
                            <Label>Selected Services:</Label>
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((serviceId) => (
                                <Badge key={serviceId} variant="outline">
                                  {serviceId}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Availability</h3>
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Available for booking</FormLabel>
                    <FormDescription>
                      Toggle to make this service available or unavailable
                    </FormDescription>
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

          {/* Payment & Cancellation */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Payment & Cancellation</h3>
            <FormField
              control={form.control}
              name="requiresAdvancePayment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Require advance payment</FormLabel>
                    <FormDescription>
                      Customers must pay a portion upfront
                    </FormDescription>
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
            {requiresAdvancePayment && (
              <>
                <FormField
                  control={form.control}
                  name="advancePaymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Payment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advancePaymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {advancePaymentType === "percentage"
                          ? "Percentage Amount"
                          : "Fixed Amount (£)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step={
                            advancePaymentType === "percentage" ? "1" : "0.01"
                          }
                          placeholder={
                            advancePaymentType === "percentage" ? "50" : "0.00"
                          }
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
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Policy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cancellation policy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="strict">Strict</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value === "flexible" &&
                          "Full refund up to 24 hours before service"}
                        {field.value === "moderate" &&
                          "Full refund up to 12 hours before service"}
                        {field.value === "strict" &&
                          "Full refund up to 6 hours before service"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
                Processing...
              </>
            ) : service ? (
              "Update Service"
            ) : (
              "Create Service"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
