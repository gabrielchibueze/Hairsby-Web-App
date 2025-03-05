"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, DollarSign, ImagePlus, Trash } from "lucide-react";
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
  FormDescription,
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
import { getServiceById, updateService } from "@/lib/api/accounts/provider";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Duration must be a positive number",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  isAvailable: z.boolean().default(true),
  requiresAdvancePayment: z.boolean().default(false),
  advancePaymentAmount: z.string().optional(),
  advancePaymentType: z.enum(["fixed", "percentage"]).optional(),
  cancellationPolicy: z
    .enum(["flexible", "moderate", "strict"])
    .default("moderate"),
});

export default function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();

  const { data: service } = useQuery({
    queryKey: ["service", params.id],
    queryFn: () => getServiceById(params.id),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      price: service?.price.toString() || "",
      duration: service?.duration.toString() || "",
      category: service?.category || "",
      isAvailable: service?.isAvailable || true,
      requiresAdvancePayment: service?.requiresAdvancePayment || false,
      advancePaymentAmount: service?.advancePaymentAmount?.toString() || "",
      advancePaymentType: service?.advancePaymentType || undefined,
      cancellationPolicy: service?.cancellationPolicy || "moderate",
    },
  });

  const requiresAdvancePayment = form.watch("requiresAdvancePayment");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append form values
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      await updateService(params.id, formData);

      toast({
        title: "Success",
        description: "Service updated successfully",
      });

      // Redirect to services list
      window.location.href = "/provider/services";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!service) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/provider/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </a>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Service</CardTitle>
          <CardDescription>Update your service details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Service Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Images</label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {service.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image}
                        alt={`Service image ${index + 1}`}
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
                  {images.map((image, index) => (
                    <motion.div
                      key={`new-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New service image ${index + 1}`}
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
                  {service.images.length + images.length < 5 && (
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

              {/* Basic Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hair Styling" {...field} />
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
                          placeholder="Describe your service..."
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
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="pl-9"
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              min="0"
                              placeholder="Duration in minutes"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          <SelectItem value="nails">Nails</SelectItem>
                          <SelectItem value="skincare">Skincare</SelectItem>
                          <SelectItem value="spa">Spa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Available for Booking</FormLabel>
                        <FormDescription>
                          Customers can book this service
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

                <FormField
                  control={form.control}
                  name="requiresAdvancePayment"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Require Advance Payment</FormLabel>
                        <FormDescription>
                          Customers must pay in advance to book
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="advancePaymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">
                                Fixed Amount
                              </SelectItem>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
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
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              {field.value &&
                              form.getValues("advancePaymentType") ===
                                "percentage" ? (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  %
                                </span>
                              ) : (
                                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              )}
                              <Input
                                type="number"
                                min="0"
                                placeholder={
                                  form.getValues("advancePaymentType") ===
                                  "percentage"
                                    ? "Enter percentage"
                                    : "Enter amount"
                                }
                                className={
                                  form.getValues("advancePaymentType") ===
                                  "percentage"
                                    ? "pr-8"
                                    : "pl-9"
                                }
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Policy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a policy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flexible">
                            Flexible (Full refund up to 24 hours before)
                          </SelectItem>
                          <SelectItem value="moderate">
                            Moderate (Full refund up to 48 hours before)
                          </SelectItem>
                          <SelectItem value="strict">
                            Strict (Full refund up to 7 days before)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
