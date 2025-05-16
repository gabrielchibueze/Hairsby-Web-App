"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/api/services/service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getServiceById } from "@/lib/api/services/service";
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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ReviewList } from "@/components/general/reviews/review-list";
import { AddReviewForm } from "@/components/general/reviews/add-review-form";
import Link from "next/link";
import { getProviderServiceById } from "@/lib/api/accounts/provider";
import { Booking } from "@/lib/api/services/booking";
import { ImageCarousel } from "@/components/general/image-carousel";
import { BookingList } from "@/components/booking/components/booking-list";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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
        router.push("/dashboard/services");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, router]);

  const handleEditService = () => {
    router.push(`/provider/services/${id}/edit`);
  };

  const handleBack = () => {
    router.push("/provider/services");
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground/100">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-0">
          <CardHeader className="border-b">
            <div>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  {service.name}
                  {service.isPackage && (
                    <Badge className="bg-hairsby-orange text-primary-foreground hover:bg-hairsby-orange/80">
                      Package
                    </Badge>
                  )}
                </CardTitle>

                <Link href={`/provider/services/${service.id}/edit`}>
                  <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
                    Edit Service
                  </Button>
                </Link>
              </div>
              <div className="flex items-center mt-2 gap-2 flex-wrap">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">
                  {(Number(service?.averageRating) || 0)?.toFixed(1) ||
                    "No ratings yet"}
                </span>
                <span className="mx-2 text-muted-FOREGROUND/60">•</span>
                <span className="text-sm text-muted-foreground/100">
                  {service.serviceReviews?.length || 0} reviews
                </span>
                <span className="mx-2 text-muted-FOREGROUND/60">•</span>
                <span className="text-sm text-muted-foreground/100">
                  {bookings && bookings?.length} bookings
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              //   className="w-full"
            >
              <TabsList className="rounded-none border-b px-12 flex gap-0">
                <TabsTrigger value="details" className="p-2 ">
                  Service Details
                </TabsTrigger>
                <TabsTrigger value="bookings" className="p-2 ">
                  Bookings ({bookings?.length})
                </TabsTrigger>
                <TabsTrigger value="reviews" className="p-2 ">
                  Reviews ({service.serviceReviews?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-4">
                <div className="space-y-6">
                  {/* Service Images */}
                  <ImageCarousel
                    images={service.images}
                    name={service.name}
                    price={service.price}
                    discountPrice={service?.discountPrice}
                    flex={true}
                  />

                  {/* Service Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-hairsby-orange" />
                      Service Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-muted-foreground/100">
                          Name
                        </p>
                        <p className="font-medium">{service.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground/100">
                          Category
                        </p>
                        <p className="capitalize">{service.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground/100">
                          Price
                        </p>
                        <p className="font-medium">
                          £{Number(service.price).toFixed(2)}
                          {service.discountPrice && (
                            <span className="ml-2 text-sm text-muted-foreground/100 line-through">
                              £{Number(service.discountPrice).toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground/100">
                          Duration
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground/100" />
                          <p>
                            {Math.floor(service.duration / 60)}h{" "}
                            {service.duration % 60}m
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground/100">
                          Description
                        </p>
                        <p className="whitespace-pre-line">
                          {service.description}
                        </p>
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
                        <p className="text-sm text-muted-foreground/100">
                          Status
                        </p>
                        <div className="flex items-center gap-2">
                          {service.isAvailable ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <p>
                            {service.isAvailable ? "Available" : "Unavailable"}
                          </p>
                        </div>
                      </div>
                      {service?.requiresAdvancePayment && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground/100">
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
                            <p className="text-sm text-muted-foreground/100">
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
                          <p className="text-sm text-muted-foreground/100">
                            This package includes the following services:
                          </p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {service.packageServices.map((serviceId, index) => (
                              <li key={index} className="text-sm">
                                Service {index + 1} (ID: {serviceId})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="p-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Service Bookings</h3>
                      <p className="text-sm text-muted-foreground/100 mt-1">
                        All bookings for this service
                      </p>
                    </div>
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
                      {/* {bookings?.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                Booking #{booking.bookingCode}
                              </h4>
                              <p className="text-sm text-muted-foreground/100">
                                {booking?.createdAt &&
                                  formatDate(booking?.createdAt)}
                              </p>
                            </div>
                            <Badge
                              variant={
                                booking.status === "completed"
                                  ? "default"
                                  : booking.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground/100">Customer</p>
                              <p>
                                {booking.customer?.firstName}{" "}
                                {booking.customer?.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground/100">
                                Booking Date
                              </p>
                              <p>{formatDate(booking.date)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground/100">Amount</p>
                              <p>
                                {formatCurrency(Number(booking?.totalAmount))}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground/100">
                              Service Details
                            </p>
                            <div className="flex items-center justify-between mt-2 p-2 bg-background rounded">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-muted/80 rounded flex items-center justify-center">
                                  <ShoppingCart className="h-5 w-5 text-muted-FOREGROUND/60" />
                                </div>
                                <div>
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-sm text-muted-foreground/100">
                                    Duration:{" "}
                                    {Math.floor(service.duration / 60)}h{" "}
                                    {service.duration % 60}m
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(service.price)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/provider/bookings/${booking.id}`)
                              }
                            >
                              View Booking
                            </Button>
                          </div>
                        </div>
                      ))} */}
                      <BookingList bookings={bookings} inDetails={true} />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-FOREGROUND/60" />
                      <p className="mt-2 text-muted-foreground/100">
                        No bookings found for this service
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Customer Reviews</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-lg font-bold">
                          {Number(service.averageRating)?.toFixed(1) || "0.0"}
                        </span>
                        <span className="mx-2 text-muted-FOREGROUND/60">•</span>
                        <span className="text-muted-foreground/100">
                          {service.serviceReviews?.length || 0} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Add Review Form (only for customers) */}
                  {!user?.id ? (
                    <p className="spacy-y-8 m-auto">
                      Sign in to make a review for this service
                    </p>
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
