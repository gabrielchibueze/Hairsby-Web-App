"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getServiceById } from "@/lib/api/services";
import { getServiceAvailability } from "@/lib/api/bookings";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ServicePage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: service, isLoading: isServiceLoading } = useQuery({
    queryKey: ["service", params.id],
    queryFn: () => getServiceById(params.id),
  });

  const { data: availability = [], isLoading: isAvailabilityLoading } =
    useQuery({
      queryKey: ["availability", params.id, selectedDate],
      queryFn: () => getServiceAvailability(params.id, selectedDate),
      enabled: !!selectedDate,
    });

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book a service",
      });
      window.location.href = `/login?redirect=/services/${params.id}`;
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and time",
      });
      return;
    }

    // Redirect to checkout
    window.location.href = `/services/${params.id}/checkout`;
  };

  if (isServiceLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-10">
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-8" asChild>
        <a href="/services">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Services
        </a>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Service Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={service.images[selectedImage]}
              alt={service.name}
              fill
              className="object-cover"
            />
            {service.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? service.images.length - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === service.images.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {service.images.map((image, index) => (
              <button
                key={index}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2",
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent"
                )}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${service.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Service Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="ml-1 font-medium">
                  {service.provider.rating}
                </span>
                <span className="ml-1 text-muted-foreground">
                  ({service.provider.totalReviews} reviews)
                </span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {service.duration} min
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4" />£{service.price.toFixed(2)}
            </div>
          </div>

          <p className="text-muted-foreground">{service.description}</p>

          <div className="rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={service.provider.photo}
                  alt={service.provider.businessName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{service.provider.businessName}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  {service.provider.address}
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>
                Select your preferred date and time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              {selectedDate && (
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Select onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {isAvailabilityLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : availability.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No available slots
                        </SelectItem>
                      ) : (
                        availability.map((time) => (
                          <SelectItem key={time} value={time}>
                            {format(new Date(`2000-01-01T${time}`), "p")}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                className="w-full"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Reviews and Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Additional Info</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {service.provider.totalReviews} reviews with an average rating
                  of {service.provider.rating}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={review.customer.photo}
                            alt={review.customer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{review.customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.date), "PP")}
                          </p>
                        </div>
                        <div className="ml-auto flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Cancellation Policy</h3>
                    <p className="text-muted-foreground">
                      Free cancellation up to 24 hours before your appointment.
                      Late cancellations may incur a fee.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">What to Expect</h3>
                    <p className="text-muted-foreground">
                      Please arrive 5-10 minutes before your appointment time.
                      Your service provider will discuss your preferences and
                      requirements before beginning the service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
