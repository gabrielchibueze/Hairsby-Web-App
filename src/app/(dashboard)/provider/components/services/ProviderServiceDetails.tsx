"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/api/services/service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  Package,
  Clock,
  Tag,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  ShoppingCart,
  Star,
  DollarSign,
  Scissors,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewList } from "@/components/reviews/review-list";
import { AddReviewForm } from "@/components/reviews/add-review-form";
import Link from "next/link";
import { getProviderServiceById } from "@/lib/api/accounts/provider";
import { Booking } from "@/lib/api/services/booking";
import { ImageCarousel } from "@/components/general/image-carousel";
import { BookingList } from "@/components/booking/components/booking-list";
import formatDuration from "@/lib/utils/minute-to-hour";
import { formatCurrency } from "@/lib/utils";

export default function ProviderServiceDetails({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [canEdit, setCanEdit] = useState(false);
  const [editQueryString, setEditQueryString] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getProviderServiceById(id as string);
        setService(data);
        setBookings(data?.bookings);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load service",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, router]);

  useEffect(() => {
    const employeeId = searchParams.get("employeeId");
    const businessId = searchParams.get("businessId");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const businessName = searchParams.get("businessName");
    const role = searchParams.get("role");
    const canManage = searchParams.get("canManage") === "true";
    const whoCanEdit = businessId && employeeId && !canManage ? false : true;

    setCanEdit(whoCanEdit);
    if (employeeId && businessId) {
      setEditQueryString(searchParams.toString());
    }
  }, [searchParams]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded" />
              ))}
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Service not found</p>
          <Button variant="outline" onClick={handleBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/10">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    {service.name}
                    {service.isPackage && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                      >
                        <Package className="h-3.5 w-3.5 mr-1.5" />
                        Package
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {service.category}
                  </CardDescription>
                </div>

                {canEdit && (
                  <Link
                    href={`/provider/services/${service.id}/edit${editQueryString ? `?${editQueryString}` : ""}`}
                  >
                    <Button variant="brand">Edit Service</Button>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {(Number(service?.averageRating) || 0)?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({service.serviceReviews?.length || 0} reviews)
                </span>
                <span className="text-sm text-muted-foreground">
                  • {bookings?.length || 0} bookings
                </span>

                <Badge
                  variant={service.isAvailable ? "default" : "destructive"}
                  className={
                    service.isAvailable
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {service.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="details">
                  <Info className="h-4 w-4 mr-2" />
                  Service Details
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  Bookings ({bookings?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="h-4 w-4 mr-2" />
                  Reviews ({service.serviceReviews?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Service Images */}
                  <div>
                    <ImageCarousel
                      images={service.images}
                      name={service.name}
                      price={service.price}
                      discountPrice={service?.discountPrice}
                    />
                  </div>

                  <section className="space-y-6">
                    {/* Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Overview</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {service.description}
                      </p>
                    </div>
                    <Separator />
                    {/* Service Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5 text-hairsby-orange" />
                        Service Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{service.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Category
                          </p>
                          <p className="capitalize">{service.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">
                            {formatCurrency(
                              Number(service.price).toFixed(2),
                              service?.currency!
                            )}
                            {service.discountPrice && (
                              <span className="ml-2 text-sm text-muted-foreground line-through">
                                {formatCurrency(
                                  Number(service.discountPrice).toFixed(2),
                                  service?.currency!
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Duration
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p>{formatDuration(service?.duration)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Availability & Policies */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-hairsby-orange" />
                        Availability & Policies
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
                          <div className="flex items-center gap-2">
                            {service.isAvailable ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <p>
                              {service.isAvailable
                                ? "Available"
                                : "Unavailable"}
                            </p>
                          </div>
                        </div>
                        {service?.requiresAdvancePayment && (
                          <>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Advance Payment
                              </p>
                              <p className="font-medium">
                                {service.advancePaymentType === "fixed"
                                  ? `£${Number(
                                      service?.advancePaymentAmount
                                    )?.toFixed(2)}`
                                  : `${service.advancePaymentAmount}%`}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Cancellation Policy
                              </p>
                              <p className="capitalize">
                                {service.cancellationPolicy}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Package Services */}
                    {service.isPackage && service.packageServices && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-medium flex items-center gap-2 text-lg">
                            <Tag className="h-5 w-5 text-hairsby-orange" />
                            Included Services
                          </h3>
                          <div className="pl-7">
                            <p className="text-sm text-muted-foreground">
                              This package includes the following services:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {service.packageServices.map(
                                (serviceId, index) => (
                                  <li key={index} className="text-sm">
                                    Service {index + 1} (ID: {serviceId})
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Service Bookings</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      All bookings for this service
                    </p>
                  </div>

                  <Separator />

                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                          <Skeleton className="h-6 w-48" />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : bookings?.length > 0 ? (
                    <div className="space-y-4">
                      <BookingList bookings={bookings} inDetails={true} />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        No bookings found for this service
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-lg font-bold">
                        {Number(service.averageRating)?.toFixed(1) || "0.0"}
                      </span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {service.serviceReviews?.length || 0} reviews
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Add Review Form (only for customers) */}
                  {!user?.id ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Sign in to make a review for this service
                      </p>
                    </div>
                  ) : (
                    user?.id != service.provider?.id && (
                      <AddReviewForm id={service.id} type="service" />
                    )
                  )}

                  {/* Reviews List */}
                  <ReviewList id={service.id} type="service" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
