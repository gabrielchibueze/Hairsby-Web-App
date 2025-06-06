"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import {
  BasicReviewPayload,
  getReviews,
  Review,
} from "@/lib/api/accounts/reviews";

export function ReviewList({ id, type }: BasicReviewPayload) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const payload = {
        id,
        type,
      };
      console.log(payload);
      try {
        let currentReview = await getReviews(payload);
        setReviews(currentReview);
        console.log(currentReview);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews?.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {reviews?.map((review) => (
        <div key={review.id} className="space-y-2">
          <div className="flex items-start space-x-4">
            <Avatar
              src={review.customer.photo}
              alt={`${review.customer.firstName} ${review.customer.lastName}`}
              fallback={
                <>
                  {review.customer.firstName?.charAt(0)}
                  {review.customer.lastName?.charAt(0)}
                </>
              }
            />
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium">
                  {review.customer.firstName} {review.customer.lastName}
                </p>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-500">
                  {review.createdAt &&
                    format(new Date(review?.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          {review.comment && (
            <p className="text-gray-700 pl-14">{review.comment}</p>
          )}
          {review.images && review.images?.length > 0 && (
            <div className="flex space-x-2 pl-14">
              {review.images?.map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-md overflow-hidden border"
                >
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          {/* {review.reply && (
            <div className="ml-14 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">Business Response</p>
                <span className="text-gray-400">•</span>
                <p className="text-xs text-gray-500">
                  {format(new Date(review.updatedAt), "MMMM d, yyyy")}
                </p>
              </div>
              <p className="text-gray-700 text-sm mt-1">{review.reply}</p>
            </div>
          )} */}
          <Separator className="my-0" />
        </div>
      ))}
    </div>
  );
}
