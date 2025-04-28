"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getBookingDetails,
  completeBooking,
  noShowBooking,
} from "@/lib/api/services/booking";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", params.id],
    queryFn: () => getBookingDetails(params.id),
  });

  const handleComplete = async () => {
    try {
      await completeBooking(params.id);
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete appointment",
      });
    }
  };

  const handleNoShow = async () => {
    try {
      await noShowBooking(params.id);
      toast({
        title: "Success",
        description: "Appointment marked as no-show",
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark appointment as no-show",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/provider/appointments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Appointments
        </a>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>View appointment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Service</h3>
                <p className="text-muted-foreground">
                  {appointment.service.name}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Duration</h3>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {appointment.service.duration} minutes
                </div>
              </div>
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(
                    new Date(`${appointment.date}T${appointment.time}`),
                    "PPp"
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Price</h3>
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />£
                  {appointment.service.price.toFixed(2)}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge
                  variant={
                    appointment.status === "confirmed"
                      ? "success"
                      : appointment.status === "cancelled"
                        ? "destructive"
                        : appointment.status === "completed"
                          ? "default"
                          : appointment.status === "no-show"
                            ? "warning"
                            : "secondary"
                  }
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </Badge>
              </div>
              {appointment.notes && (
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-muted-foreground">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
              <CardDescription>
                Customer information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  {appointment.customer.photo ? (
                    <img
                      src={appointment.customer.photo}
                      alt={appointment.customer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-semibold">
                      {appointment.customer.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{appointment.customer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Customer since{" "}
                    {format(
                      new Date(appointment.customer.joinedDate),
                      "MMMM yyyy"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {appointment.customer.email}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {appointment.customer.phone}
                  </div>
                  {appointment.customer.address && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {appointment.customer.address}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href={`/messages/${appointment.customer.id}`}>
                    Message Customer
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/provider/customers/${appointment.customer.id}`}>
                    View History
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        {appointment.status === "confirmed" && (
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage this appointment</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={handleComplete}>Mark as Completed</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Mark as No-Show</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark as No-Show</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to mark this appointment as a
                        no-show? This action cannot be undone and may affect the
                        customer's booking privileges.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleNoShow}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payment Information */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Payment details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Payment Status</h3>
                  <Badge
                    variant={
                      appointment.paymentStatus === "paid"
                        ? "success"
                        : "warning"
                    }
                  >
                    {appointment.paymentStatus.charAt(0).toUpperCase() +
                      appointment.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">
                    £{appointment.service.price.toFixed(2)}
                  </p>
                </div>
              </div>
              {appointment.paymentMethod && (
                <div>
                  <h3 className="font-medium">Payment Method</h3>
                  <p className="text-muted-foreground">
                    {appointment.paymentMethod}
                  </p>
                </div>
              )}
              {appointment.paymentReference && (
                <div>
                  <h3 className="font-medium">Payment Reference</h3>
                  <p className="text-muted-foreground">
                    {appointment.paymentReference}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
