// "use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Booking,
  rescheduleBooking,
  createBooking,
  getServiceAvailability,
  getProviderSchedule,
} from "@/lib/api/services/booking";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/api/services/service";

const bookingFormSchema = z.object({
  services: z.array(z.string()).min(1, "At least one service is required"),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "A time slot is required.",
  }),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
  customerInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address").optional(),
  }),
});

interface BookingFormProps {
  booking: Booking | null;
  providerId: string;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({
  booking,
  providerId,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [services, setServices] = useState<Service[] | []>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      services: booking?.services?.map((s) => s.id) || [],
      date: booking ? new Date(booking.date) : new Date(),
      time: booking?.time || "",
      notes: booking?.notes || "",
      notifyCustomer: true,
      customerInfo: {
        firstName: booking?.customer?.firstName || "",
        lastName: booking?.customer?.lastName || "",
        phone: booking?.customer?.phone || "",
        email: booking?.customer?.email || "",
      },
    },
  });

  const selectedDate = form.watch("date");
  const selectedServices = form.watch("services");

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        // Replace with actual API call
        const mockServices: Service[] = [
          { id: "1", name: "Haircut", duration: 30, price: 25 },
          { id: "2", name: "Coloring", duration: 60, price: 50 },
          { id: "3", name: "Styling", duration: 45, price: 35 },
          { id: "4", name: "Extensions", duration: 90, price: 120 },
          { id: "5", name: "Treatment", duration: 30, price: 40 },
        ];
        setServices(mockServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        });
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, [providerId]);

  useEffect(() => {
    if (selectedDate && selectedServices?.length > 0) {
      const fetchAvailability = async () => {
        try {
          // For simplicity, using the first service's availability
          const serviceId = selectedServices[0];
          if (!serviceId) return;

          const dateStr = format(selectedDate, "yyyy-MM-dd");
          const availability = await getServiceAvailability(serviceId, dateStr);
          setAvailableSlots(availability.availableSlots);

          // Reset time if not available in new slots
          const currentTime = form.getValues("time");
          if (
            currentTime &&
            !availability.availableSlots.includes(currentTime)
          ) {
            form.setValue("time", "");
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
          toast({
            title: "Error",
            description: "Failed to fetch available time slots",
            variant: "destructive",
          });
        }
      };

      fetchAvailability();
    }
  }, [selectedDate, selectedServices, form]);

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    setIsSubmitting(true);
    try {
      const payload = {
        services: values.services,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        notes: values.notes,
        notifyCustomer: values.notifyCustomer,
        customerInfo: values.customerInfo,
      };

      if (booking) {
        await rescheduleBooking(booking.id, payload);
        toast({
          title: "Success",
          description: "Booking updated successfully",
        });
      } else {
        await createBooking(payload);
        toast({
          title: "Success",
          description: "Booking created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Services Section */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label className="block mb-2">Services</Label>
              {isLoadingServices ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {services?.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        const currentServices = form.getValues("services");
                        if (currentServices?.includes(service.id)) {
                          form.setValue(
                            "services",
                            currentServices?.filter((id) => id !== service.id)
                          );
                        } else {
                          form.setValue("services", [
                            ...currentServices,
                            service.id,
                          ]);
                        }
                      }}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-colors",
                        form.getValues("services")?.includes(service.id)
                          ? "border-hairsby-orange bg-amber-50"
                          : "hover:border-gray-300"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-hairsby-orange font-medium">
                          £{service.price}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {service.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {form.formState.errors.services && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.services.message}
                </p>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Slot */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Slot</FormLabel>
                {/* <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedDate || selectedServices?.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedDate
                            ? "Select a date first"
                            : selectedServices?.length === 0
                              ? "Select services first"
                              : "Select a time slot"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSlots?.length > 0 ? (
                      availableSlots?.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No available slots
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select> */}
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedDate || selectedServices.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedDate
                            ? "Select a date first"
                            : selectedServices.length === 0
                              ? "Select services first"
                              : availableSlots.length === 0
                                ? "No available slots"
                                : "Select a time slot"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {" "}
                          {/* Make sure value is not empty */}
                          {slot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>
                        {" "}
                        {/* Added value prop */}
                        No available time slots
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-medium">Customer Information</h3>
            <FormField
              control={form.control}
              name="customerInfo.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerInfo.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h3 className="font-medium">Additional Options</h3>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifyCustomer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Notify Customer</FormLabel>
                    <FormDescription>
                      Send confirmation email/SMS to customer
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-hairsby-orange hover:bg-hairsby-orange/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : booking ? (
              "Update Booking"
            ) : (
              "Create Booking"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
