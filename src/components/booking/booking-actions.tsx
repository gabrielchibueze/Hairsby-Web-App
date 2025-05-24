"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Booking } from "@/lib/api/services/booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  rescheduleBooking,
  confirmBooking,
  completeBooking,
  noShowBooking,
  processPayment,
} from "@/lib/api/services/booking";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { BookingRescheduleDialog } from "./booking-reschedule-dialog";
import { BookingPaymentDialog } from "./booking-payment-dialog";
import { useAuth } from "@/lib/contexts/auth.context";
import { Service } from "@/lib/api/services/service";

export function BookingActions({ booking }: { booking: Booking }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { user } = useAuth();
  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelBooking(booking.id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
      router.refresh();
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: (payload: { date: string; time: string }) =>
      rescheduleBooking(booking.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
      setRescheduleOpen(false);
      router.refresh();
      toast({
        title: "Booking rescheduled",
        description: "Your booking has been rescheduled successfully",
      });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
      router.refresh();
      toast({
        title: "Booking confirmed",
        description: "Your booking has been confirmed",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => completeBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
      router.refresh();
      toast({
        title: "Booking completed",
        description: "The booking has been marked as completed",
      });
    },
  });

  const noShowMutation = useMutation({
    mutationFn: () => noShowBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
      router.refresh();
      toast({
        title: "Booking marked as no-show",
        description: "The booking has been marked as no-show",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (payload: {
      paymentMethod: string;
      useWallet?: boolean;
      paymentAmount?: number | null;
    }) => processPayment(booking.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
      setPaymentOpen(false);
      router.refresh();
      toast({
        title: "Payment processed",
        description: "Payment has been processed successfully",
      });
    },
  });

  const handleCancel = () => {
    const reason = prompt("Please enter the reason for cancellation:");
    if (reason) {
      cancelMutation.mutate(reason);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {booking.status === "pending" && (
        <>
          <Button
            className="bg-hairsby-orange hover:bg-amber-500"
            onClick={() => confirmMutation.mutate()}
            disabled={confirmMutation.isPending}
          >
            {confirmMutation.isPending ? "Confirming..." : "Confirm Booking"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setRescheduleOpen(true)}
            disabled={rescheduleMutation.isPending}
          >
            Reschedule
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
          </Button>
        </>
      )}

      {booking.status === "confirmed" && booking.paymentStatus !== "paid" && (
        <Button
          className="bg-hairsby-orange hover:bg-amber-500"
          onClick={() => setPaymentOpen(true)}
          disabled={paymentMutation.isPending}
        >
          {paymentMutation.isPending
            ? "Processing..."
            : `${user?.id === booking.provider?.id ? "Process Payment" : "Make Payment"}`}
        </Button>
      )}

      {(booking.status === "confirmed" || booking.status === "no-show") && (
        <>
          <Button
            variant="outline"
            onClick={() => setRescheduleOpen(true)}
            disabled={rescheduleMutation.isPending}
          >
            Reschedule
          </Button>
          {booking.status === "confirmed" && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </>
      )}

      {booking.status === "completed" || booking.status === "no-show" ? (
        <>
          <Button
            variant="outline"
            onClick={() => router.push(`/providers/${booking.provider.id}`)}
          >
            View Provider
          </Button>
          <Button
            className="bg-hairsby-orange hover:bg-amber-500"
            onClick={() => router.push(`/services/${booking.services[0]?.id}`)}
          >
            Book Again
          </Button>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex gap-2 items-center">
              {/* <span>
              {booking.status === "confirmed" ? "More actions" : "Actions"}
            </span> */}
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {booking.status === "confirmed" && (
              <DropdownMenuItem
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending
                  ? "Completing..."
                  : "Mark as Completed"}
              </DropdownMenuItem>
            )}
            {booking.status === "confirmed" && (
              <DropdownMenuItem
                onClick={() => noShowMutation.mutate()}
                disabled={noShowMutation.isPending}
              >
                {noShowMutation.isPending ? "Updating..." : "Mark as No-Show"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => router.push(`/providers/${booking.provider.id}`)}
            >
              View Provider
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/services/${booking.services[0]?.id}`)
              }
            >
              Book Again
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <BookingRescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onReschedule={({ selectedDate, time }) =>
          rescheduleMutation.mutate({ date: selectedDate, time })
        }
        isLoading={rescheduleMutation.isPending}
        currentDate={booking.date}
        currentTime={booking.time}
        service={booking?.services[0] as Service}
      />

      <BookingPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        onProcessPayment={paymentMutation.mutate}
        isLoading={paymentMutation.isPending}
        amount={Number(booking?.totalAmount) - Number(booking?.paidAmount)}
        booking={booking}
      />
    </div>
  );
}
