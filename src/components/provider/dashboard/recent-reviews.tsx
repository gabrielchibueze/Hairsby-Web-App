// components/provider/dashboard/recent-reviews.tsx
import { Star, StarHalf, StarIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  customer: {
    name: string;
    photo: string;
  };
  rating: number;
  comment: string;
  date: string;
  service: string;
}

interface RecentReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  loading: boolean;
}

export function RecentReviews({
  reviews,
  averageRating,
  totalReviews,
  loading = false,
}: RecentReviewsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-12" />
          <div className="space-y-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-3 w-3" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-hairsby-orange text-hairsby-orange"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-hairsby-orange text-hairsby-orange"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold">
          {Number(averageRating).toFixed(1)}
        </div>
        <div className="space-y-1">
          <div className="flex items-center">{renderStars(averageRating)}</div>
          <div className="text-sm text-muted-foreground">
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8"
              src={review.customer.photo}
              alt={review.customer.name.charAt(0)}
              fallback={
                <>
                  {review.customer.name.charAt(0)}
                </>
              }
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {review.customer.name}
                </span>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-sm">{review.comment}</p>
              <div className="text-xs text-muted-foreground">
                {review.service} • {new Date(review.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
