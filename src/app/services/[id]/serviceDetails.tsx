"use client";

import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import {
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServiceById } from "@/lib/api/services/service";
import { getServiceAvailability } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createBooking } from "@/lib/api/services/booking";
import {
  ScheduleData,
  userGetProviderSchedule,
} from "@/lib/api/accounts/provider";
import {
  addDays,
  format,
  isSameDay,
  isBefore,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { areaCurrencyFormat, cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth.context";
import { useFavorite } from "@/components/favorite/favorite-provider";
import Breadcrumb from "@/components/general/breadcrumb";
import ProviderProfileSummary from "@/components/general/provider-profile-summary";
import { UserProfile } from "@/lib/api/accounts/profile";
import { ReviewList } from "@/components/reviews/review-list";
import { AddReviewForm } from "@/components/reviews/add-review-form";
import { ImageCarousel } from "@/components/general/image-carousel";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import formatDuration from "@/lib/utils/minute-to-hour";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ServiceDetailsComponent({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorite();
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", params.id],
    queryFn: () => getServiceById(params.id),
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("details");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;
  const source = searchParams.get("s") as string;

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("details");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };

  const { data: providerSchedule, isLoading: isScheduleLoading } = useQuery({
    queryKey: ["provider-schedule", service?.provider?.id, currentMonth],
    queryFn: () => {
      if (!service?.provider?.id) return Promise.resolve(null);
      const startDate = format(currentMonth, "yyyy-MM-01");
      const endDate = format(addDays(currentMonth, 30), "yyyy-MM-dd");
      return userGetProviderSchedule(service.provider.id, startDate, endDate);
    },
    enabled: !!service?.provider?.id,
  });

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const hasDiscount =
    service?.discountPrice &&
    Number(service.discountPrice) < Number(service.price);
  const averageRating = service?.provider?.rating || 0;
  const reviewCount = service?.provider?.totalReviews || 0;

  // Generate days for the current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Calculate available dates based on provider schedule

  useEffect(() => {
    if (!providerSchedule) return;

    const { workingHours, unavailableDates } = providerSchedule;
    const availableDays: Date[] = [];

    const unavailableDatesList =
      unavailableDates?.map((date: string) => new Date(date)) || [];

    daysInMonth.forEach((day) => {
      const dayOfWeek = format(
        day,
        "EEEE"
      ).toLowerCase() as keyof ScheduleData["workingHours"]; // ✅ cast it

      const isUnavailable = unavailableDatesList.some((unavailableDate: any) =>
        isSameDay(unavailableDate, day)
      );

      if (workingHours && workingHours[dayOfWeek]?.start && !isUnavailable) {
        availableDays.push(new Date(day));
      }
    });

    setAvailableDates(availableDays);
  }, [providerSchedule, currentMonth]);

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (!selectedDate || !service) return;

    const fetchAvailability = async () => {
      setIsFetchingAvailability(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const availability = await getServiceAvailability(
          service.id,
          formattedDate
        );

        setAvailableTimeSlots(availability.availableSlots || []);
      } catch (error: any) {
        const message = await ErrorToastResponse(error.response);
        toast({
          title: "Error",
          description: message || "Could not fetch available time slots",
          variant: "destructive",
        });
      } finally {
        setIsFetchingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, service]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedTime || !service || !user) return;

    setIsBooking(true);
    try {
      const bookingDate = format(selectedDate, "yyyy-MM-dd");
      const bookingPayload = {
        services: [service.id],
        date: bookingDate,
        time: selectedTime,
      };

      const booking = await createBooking(bookingPayload);
      console.log(booking);
      toast({
        title: "Booking Successful",
        description: `Your booking for ${service.name} on ${bookingDate} at ${selectedTime} has been confirmed.`,
      });

      router.push(`/dashboard/bookings/${booking.id}`);
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);

      toast({
        title: "Booking Failed",
        description:
          message ||
          "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getDayClassName = (day: Date) => {
    const baseClasses =
      "h-10 rounded-md flex items-center justify-center text-sm";

    if (!availableDates.some((date) => isSameDay(date, day))) {
      return cn(baseClasses, "text-gray-300 cursor-not-allowed");
    }

    if (selectedDate && isSameDay(selectedDate, day)) {
      return cn(baseClasses, "bg-hairsby-orange text-white");
    }

    if (isToday(day)) {
      return cn(baseClasses, "border border-hairsby-orange");
    }

    return cn(baseClasses, "hover:bg-gray-100");
  };

  if (isLoading || !service) {
    return (
      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-32 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}

      <Breadcrumb
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Services", link: "/services" },
          {
            name:
              service.category.charAt(0).toUpperCase() +
              service.category.slice(1),
            link: `/services?category=${service.category.split(" ").join("-")}`,
          },
          { name: `${service?.name}` },
        ]}
      />

      {/* Service Detail */}
      <section className="py-12">
        <div className="container px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Service Images */}
            <ImageCarousel
              images={service.images}
              name={service.name}
              price={service.price}
              discountPrice={service?.discountPrice}
            />

            {/* Service Info */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {service?.name}
                  </h1>
                  <p className="mt-2 text-gray-600 capitalize">
                    {service.category}
                  </p>
                </div>
                <button onClick={() => toggleFavorite("service", service.id)}>
                  <Heart
                    className={`h-6 w-6 ${isFavorite("service", service.id) ? "fill-current text-rose-500 hover:text-rose-500" : ""}`}
                  />
                </button>
              </div>

              {/* Provider Info */}
              <div className="mt-4 flex items-center gap-4">
                {service.provider?.photo && (
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={service.provider?.photo}
                      alt={service.provider.businessName || "Provider"}
                      width={48}
                      height={48}
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}
                <div>
                  <Link href={`/providers/${service.provider?.id}`}>
                    <h4 className="font-medium underline">
                      {service.provider?.businessName ||
                        service.provider?.firstName ||
                        "Professional"}
                    </h4>
                  </Link>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-4 w-4 ${
                          rating <= averageRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {hasDiscount ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(
                        Number(service.discountPrice)?.toFixed(2)
                      )}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {formatCurrency(Number(service.price).toFixed(2))}
                    </span>
                    <span className="text-sm font-medium text-hairsby-orange">
                      Save
                      {formatCurrency(
                        (
                          Number(service.price) - Number(service.discountPrice)
                        ).toFixed(2)
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(Number(service.price).toFixed(2))}
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 text-gray-700">
                  <Clock className="h-5 w-5 text-hairsby-orange" />
                  <span>{formatDuration(service?.duration)}</span>
                </div>
                {service.provider?.address && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <MapPin className="h-5 w-5 text-hairsby-orange" />
                    <span>
                      {service.provider.address}, {service.provider.city}
                    </span>
                  </div>
                )}
                <p className="text-gray-700">{service.description}</p>
              </div>

              {/* Booking Form */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Book Appointment</h3>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                    disabled={isBefore(
                      subMonths(currentMonth, 1),
                      startOfMonth(new Date())
                    )}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h4 className="text-lg font-medium">
                    {format(currentMonth, "MMMM yyyy")}
                  </h4>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {Array.from({
                    length: getDay(startOfMonth(currentMonth)),
                  }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-10" />
                  ))}
                  {daysInMonth.map((day) => (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      disabled={
                        !availableDates.some((date) => isSameDay(date, day))
                      }
                      className={getDayClassName(day)}
                    >
                      {format(day, "d")}
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Time Slots
                    </label>
                    {isFetchingAvailability ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                          <Skeleton key={i} className="h-9 rounded-md" />
                        ))}
                      </div>
                    ) : availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-md border text-sm ${
                              selectedTime === time
                                ? "border-hairsby-orange bg-hairsby-orange/10"
                                : "border-gray-300 hover:border-hairsby-orange"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-2">
                        No available time slots for this date.
                      </p>
                    )}
                  </div>
                )}

                {/* Book Now Button */}
                <Button
                  size="lg"
                  className="w-full bg-hairsby-orange hover:bg-hairsby-orange/80 mt-4"
                  disabled={
                    !selectedDate || !selectedTime || isBooking || !user
                  }
                  onClick={handleBookNow}
                >
                  {!user
                    ? "Login to Book"
                    : isBooking
                      ? "Booking..."
                      : "Book Now"}
                </Button>

                {!user && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    You need to{" "}
                    <Link
                      href={`/login?redirect=${encodeURIComponent(pathname)}`}
                      className="text-hairsby-orange hover:underline"
                    >
                      sign in
                    </Link>{" "}
                    to book this service
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Service Tabs */}
          <div className="mt-16 w-full max-w-[600px]">
            <Tabs defaultValue={activeTab} onValueChange={setPathActiveTab}>
              <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="provider">Provider</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({service.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-8">
                <div className="prose max-w-none">
                  {service.description || "No detailed description available."}
                </div>
              </TabsContent>

              <TabsContent value="provider" className="mt-8">
                <ProviderProfileSummary
                  provider={service.provider as UserProfile}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="flex gap-8 flex-col">
                  {user?.id !== service.provider?.id && (
                    <AddReviewForm
                      id={service?.id}
                      authenticated={user?.id ? true : false}
                      type="service"
                    />
                  )}
                  {/* Reviews List */}
                  <ReviewList id={service.provider?.id} type="provider" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
