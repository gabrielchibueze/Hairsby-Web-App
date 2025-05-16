"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Package,
  CreditCard,
  User,
  MapPin,
  Info,
  Mail,
  Phone,
} from "lucide-react";
import { Order } from "@/lib/api/products/order";
import { Separator } from "@/components/ui/separator";
import { OrderTimeline } from "@/components/order/components/order-timeline";
import { safeFormatDate } from "@/lib/utils";
import { OrderActions } from "@/components/order/components/order-actions";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth.context";
import { OrderStatusBadge } from "./order-status-badge";
import ProviderProfileSummary from "@/components/general/provider-profile-summary";
import { UserProfile } from "@/lib/api/accounts/profile";

interface OrderDetailsProps {
  order: Order | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEditOrder?: () => void;
  embedded?: boolean;
}

export function OrderDetails({
  order,
  open = true,
  onOpenChange,
  onEditOrder,
  embedded = false,
}: OrderDetailsProps) {
  if (!order) return null;
  const { user } = useAuth();

  const Wrapper = embedded ? "div" : Dialog;
  const WrapperContent = embedded ? "div" : DialogContent;

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent className={embedded ? "" : "sm:max-w-[800px]"}>
        {!embedded && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Order #{order.orderCode}</span>
              <OrderStatusBadge
                status={order.status}
                paymentStatus={order.paymentStatus}
              />
            </DialogTitle>
          </DialogHeader>
        )}

        <div className="flex justify-end mb-4">
          <OrderActions order={order} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-hairsby-orange" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-7">
                <div>
                  <p className="text-sm text-muted-foreground/100">Name</p>
                  <p className="font-medium">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                </div>
                {order.customer?.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground/100">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground/100" />
                      <Link href={`tel:${order.customer?.phone}`}>
                        <p>{order.customer.phone}</p>
                      </Link>
                    </div>
                  </div>
                )}
                {order.customer?.email && (
                  <div>
                    <p className="text-sm text-muted-foreground/100">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground/100" />
                      <Link href={`mailto:${order.customer?.email}`}>
                        <p>{order.customer.email}</p>
                      </Link>
                    </div>
                  </div>
                )}
                {order.customer?.businessName && (
                  <div>
                    <p className="text-sm text-muted-foreground/100">
                      Business
                    </p>
                    <p className="font-medium">{order.customer.businessName}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-hairsby-orange" />
                Order Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-7">
                <div>
                  <p className="text-sm text-muted-foreground/100">
                    Order Date
                  </p>
                  <p>
                    {safeFormatDate(
                      new Date(order.createdAt || new Date()),
                      "PPP"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground/100">
                    Order Code
                  </p>
                  <p className="font-mono">{order.orderCode}</p>
                </div>
                {order.estimatedDeliveryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground/100">
                      Estimated Delivery
                    </p>
                    <p>{safeFormatDate(order.estimatedDeliveryDate, "PPP")}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground/100">
                    Order Status
                  </p>
                  <OrderStatusBadge status={order?.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground/100">
                    Payment Status
                  </p>
                  <OrderStatusBadge paymentStatus={order?.paymentStatus} />
                </div>
                {order.trackingNumber && (
                  <a href={order?.trackingNumber} target="__blank">
                    <div>
                      <p className="text-sm text-muted-foreground/100">
                        Tracking Number
                      </p>
                      <a
                        href={order?.trackingNumber}
                        className="underline text-hairsby-orange/80"
                      >
                        Parcel Track
                      </a>{" "}
                    </div>
                  </a>
                )}
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            {order.shippingAddress && order.shippingAddress.country && (
              <>
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-hairsby-orange" />
                    Shipping Address
                  </h3>
                  <div className="pl-7">
                    <p className="font-medium">
                      {order.shippingAddress.street}
                    </p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                    <p>
                      {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Order Timeline */}
            <div>
              <OrderTimeline order={order} />
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-hairsby-orange" />
                Items ({order.items?.length})
              </h3>
              <div className="space-y-3 pl-7">
                {order.items?.map((item) => (
                  <div
                    key={item.productId}
                    className="border rounded-lg p-4 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-FOREGROUND">
                        Qty: {Number(item.quantity)} × £
                        {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      £{(Number(item.quantity) * Number(item.price)).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-muted-foreground/100">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    £{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground/100">
                    Shipping
                  </span>
                  <span className="font-medium">£0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground/100">Tax</span>
                  <span className="font-medium">£0.00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>£{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-hairsby-orange" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-7">
                <div>
                  <p className="text-sm text-muted-foreground/100">
                    Payment Method
                  </p>
                  <p className="capitalize font-medium">
                    {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground/100">
                    Payment Status
                  </p>
                  <OrderStatusBadge paymentStatus={order.paymentStatus} />
                </div>
                {order.paymentReference && (
                  <div>
                    <p className="text-sm text-muted-foreground/100">
                      Reference
                    </p>
                    <p className="font-mono">{order.paymentReference}</p>
                  </div>
                )}
                {order.paymentStatus === "paid" && (
                  <div>
                    <p className="text-sm text-muted-foreground/100">
                      Amount Paid
                    </p>
                    <p className="font-medium">
                      £{Number(order.paidAmount).toFixed(2)}
                    </p>
                  </div>
                )}
                {order.paymentStatus === "partial" && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground/100">
                        Amount Paid
                      </p>
                      <p className="font-medium">
                        £{Number(order.paidAmount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground/100">
                        Balance
                      </p>
                      <p className="font-medium">
                        £
                        {(
                          Number(order.totalAmount) - Number(order.paidAmount)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-hairsby-orange" />
                    Notes
                  </h3>
                  <p className="pl-7 text-foreground/80 whitespace-pre-line">
                    {order.notes}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Provider Details - Only shows on lg screens and up */}
          {/* {user?.id !== order.provider?.id ? ( */}
          <div className="lg:sticky lg:top-6 lg:h-fit rounded-lg border p-4">
            <ProviderProfileSummary provider={order.provider as UserProfile} />
          </div>
          {/* ) : null} */}
        </div>
        {onEditOrder && order.provider?.id === user?.id && (
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
            <Button
              className="bg-hairsby-orange hover:bg-hairsby-orange/80"
              onClick={onEditOrder}
            >
              Edit Order
            </Button>
          </div>
        )}
      </WrapperContent>
    </Wrapper>
  );
}
