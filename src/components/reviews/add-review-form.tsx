"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { convertFileToBase64 } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { addReview } from "@/lib/api/accounts/reviews";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import { useRouter } from "next/navigation";

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().optional(),
  images: z.instanceof(File).array().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface AddReviewFormProps {
  id: string;
  type: "product" | "service" | "provider";
  authenticated?: boolean | false;
}

export function AddReviewForm({ id, type, authenticated }: AddReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<string | "button" | "form">(
    "button"
  );
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      images: [],
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviewUrls = await Promise.all(
        files.map(async (file) => {
          return await convertFileToBase64(file);
        })
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      form.setValue("images", [...(form.getValues("images") || []), ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...previewUrls];
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);

    const updatedFiles = [...(form.getValues("images") || [])];
    updatedFiles.splice(index, 1);
    form.setValue("images", updatedFiles);
  };

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const imagesBase64 = await Promise.all(
        (values.images || []).map(async (file) => {
          return await convertFileToBase64(file);
        })
      );
      const payload = {
        id,
        type,
      };
      console.log(payload);

      await addReview(payload, {
        rating: values.rating,
        comment: values.comment,
        images: imagesBase64,
      });
      router.refresh();
      toast({
        title: "Success",
        description: "Your review has been submitted",
      });
      form.reset();
      setPreviewUrls([]);
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);

      toast({
        title: "Error",
        description: message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {viewMode === "button" ? (
        <div className="space-y-4 flex flex-col items-center justify-center">
          {!authenticated && (
            <p className="spacy-y-8 m-auto">
              Sign in to make a review for this {type}
            </p>
          )}
          <Button
            type="button"
            className="bg-hairsby-orange hover:bg-hairsby-orange/80 m-auto"
            onClick={() => setViewMode("form")}
            disabled={!authenticated}
          >
            Add a Review
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-1"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoverRating || field.value)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share details about your experience with this product"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos (optional)</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Upload images of your experience (max 3)
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="border border-hairsby-orange/70"
                onClick={() => setViewMode("button")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
