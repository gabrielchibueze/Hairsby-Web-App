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
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
  MapPin,
  Calendar,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { Order } from "@/lib/api/products/order";
import { Separator } from "@/components/ui/separator";
import { OrderStatus, StatusBadge } from "./status-badge";
import { PaymentStatus, PaymentStatusBadge } from "./payment-status-badge";

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

  const Wrapper = embedded ? "div" : Dialog;
  const WrapperContent = embedded ? "div" : DialogContent;

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent className={embedded ? "" : "sm:max-w-[800px]"}>
        {!embedded && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Order #{order.orderCode}</span>
              <div className="flex gap-2">
                <StatusBadge status={order.status as OrderStatus} />
                <PaymentStatusBadge
                  status={order.paymentStatus as PaymentStatus}
                />
              </div>
            </DialogTitle>
          </DialogHeader>
        )}

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-hairsby-orange" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
              </div>
              {order.customer?.businessName && (
                <div>
                  <p className="text-sm text-gray-500">Business</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p>{format(new Date(order.createdAt || new Date()), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Code</p>
                <p className="font-mono">{order.orderCode}</p>
              </div>
              {order.estimatedDeliveryDate && (
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p>{format(new Date(order.estimatedDeliveryDate), "PPP")}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          {order.shippingAddress && (
            <>
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-hairsby-orange" />
                  Shipping Address
                </h3>
                <div className="pl-7">
                  <p className="font-medium">{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
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
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    £{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-medium">
                  £{order.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="font-medium">£0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tax</span>
                <span className="font-medium">£0.00</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>£{order.totalAmount.toFixed(2)}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="capitalize font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <PaymentStatusBadge
                  status={order.paymentStatus as PaymentStatus}
                />
              </div>
              {order.paymentReference && (
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-mono">{order.paymentReference}</p>
                </div>
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
                <p className="pl-7 text-gray-700 whitespace-pre-line">
                  {order.notes}
                </p>
              </div>
            </>
          )}
        </div>

        {!embedded && (
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
            {onEditOrder && (
              <Button
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                onClick={onEditOrder}
              >
                Edit Order
              </Button>
            )}
          </div>
        )}
      </WrapperContent>
    </Wrapper>
  );
}
