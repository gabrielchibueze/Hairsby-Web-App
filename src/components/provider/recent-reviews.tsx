"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface RecentReviewsProps {
  reviews: Array<{
    id: string;
    customer: {
      name: string;
      photo: string;
    };
    rating: number;
    comment: string;
    date: string;
    service: string;
  }>;
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (!reviews?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="rounded-lg border p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={review.customer.photo}
                  alt={review.customer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{review.customer.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {review.service}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {format(new Date(review.date), "PP")}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
