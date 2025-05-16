"use client";

import { Order } from "@/lib/api/products/order";
import { cn, safeFormatDate } from "@/lib/utils";
import { format } from "date-fns";

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const statusHistory = order.metadata?.statusHistory || [];
  const paymentHistory = order.metadata?.payment
    ? [
        {
          status: order.metadata.payment.status,
          changedAt: order.metadata.payment.processedAt,
          changedBy: order.metadata.payment.processedBy,
        },
      ]
    : [];

  const allEvents = [...statusHistory, ...paymentHistory].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  console.log("Order:", order);
  console.log("All Events:", allEvents);

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {allEvents.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== allEvents.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-muted/80"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                      event.status === "cancelled" ||
                        event.status === "refunded"
                        ? "bg-red-500 text-primary-foreground"
                        : event.status === "partial"
                          ? "bg-orange-500"
                          : event.status === "paid" ||
                              event.status === "delivered" ||
                              event.status === "pickedup"
                            ? "bg-green-500 text-primary-foreground"
                            : "bg-blue-500 text-primary-foreground"
                    )}
                  >
                    {event.status === "paid" ? (
                      <span className="text-xs">$</span>
                    ) : (
                      <span className="text-xs">
                        {event.status.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-foreground/90 capitalize">
                      {event.status === "partial"
                        ? "Partial payment"
                        : event.status}
                      {event.reason && (
                        <span className="text-muted-foreground/100">
                          {" "}
                          - {event.reason}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-muted-foreground/100">
                    <time dateTime={event.changedAt}>
                      {safeFormatDate(
                        new Date(event.changedAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
