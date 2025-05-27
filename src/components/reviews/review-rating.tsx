import { Star } from "lucide-react";

export default function ReviewRatings({reviews, rating}: {reviews: number, rating: number}){
    return   (<div className="mt-2 flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((r) => (
        <Star
            key={r}
            className={`h-5 w-5 ${
            r <= Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
        />
        ))}
        <span className="ml-2 text-sm text-gray-600">
        {Number(rating).toFixed(1)} ({reviews || 0}{" "}
        reviews)
        </span>
    </div>)
}