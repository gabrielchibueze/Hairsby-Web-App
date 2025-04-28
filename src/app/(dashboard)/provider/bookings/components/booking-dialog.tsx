"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingForm } from "./booking-form";
import { Booking } from "@/lib/api/services/booking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetails } from "./booking-details";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  providerId: string;
  onSuccess: () => void;
}

export function BookingDialog({
  open,
  onOpenChange,
  booking,
  providerId,
  onSuccess,
}: BookingDialogProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] sm:mx-0  sm:max-w-[800px] min-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {booking ? (
              <>
                <span>{booking.bookingCode}</span>
                <span className="text-sm font-normal text-gray-500">
                  {booking.customer.firstName} {booking.customer.lastName}
                </span>
              </>
            ) : (
              "Create New Booking"
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {booking ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4 "
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Booking Details</TabsTrigger>
                <TabsTrigger value="edit">Edit Booking</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <BookingDetails
                  booking={booking}
                  embedded
                  onEditBooking={() => setActiveTab("edit")}
                />
              </TabsContent>
              <TabsContent value="edit" className="pt-4">
                <BookingForm
                  booking={booking}
                  providerId={providerId}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  onSuccess={() => {
                    onSuccess();
                    onOpenChange(false);
                  }}
                  onCancel={() => onOpenChange(false)}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <BookingForm
              booking={null}
              providerId={providerId}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onSuccess={() => {
                onSuccess();
                onOpenChange(false);
              }}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
