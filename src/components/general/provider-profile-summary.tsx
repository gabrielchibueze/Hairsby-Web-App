import { UserProfile } from "@/lib/api/accounts/profile";
import { MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ReviewRatings from "../reviews/review-rating";
import { Skeleton } from "../ui/skeleton";

const MapPreview = dynamic(() => import("@/lib/utils/map"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
});

export default function ProviderProfileSummary({
  provider,
}: {
  provider: UserProfile;
}) {
  return (
    <div
    // className="rounded-lg border p-4"
    >
      <h2 className="font-medium mb-4">Provider Details</h2>
      <div className="flex gap-4 flex-col">
        <div className="flex items-start gap-4">
          {provider?.photo && (
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={provider?.photo}
                alt={
                  provider?.businessName ||
                  `${provider?.firstName} ${provider?.lastName}`
                }
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-3 space-y-2">
            <a href={`/providers/${provider.id}`} className="underline">
              <h3 className="font-medium">
                {provider?.businessName ||
                  `${provider?.firstName} ${provider?.lastName}`}
              </h3>
            </a>
            <ReviewRatings
              rating={provider.rating as number}
              reviews={provider.totalReviews as number}
            />
            {provider?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{provider?.phone}</span>
              </div>
            )}
            {provider?.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span>{provider?.address}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          {provider?.address && (
            <MapPreview
              showDirection={true}
              latitude={provider?.latitude}
              longitude={provider?.longitude}
              markerText={
                provider?.businessName ||
                `${provider?.firstName} ${provider?.lastName}`
              }
              location={{
                address: provider?.address,
                city: provider?.city,
                country: provider?.country,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
