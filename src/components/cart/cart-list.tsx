"use client";
import {
  Calendar,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CartItem } from "@/lib/api/cart/cart";
import formatDuration from "@/lib/utils/minute-to-hour";
import { formatCurrency } from "@/lib/utils";

export function CartList() {
  const { cart, removeFromCart, updateQuantity, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && !cart.items.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/60" />
        <p className="mt-4 text-xl font-medium text-foreground">
          Your cart is empty
        </p>
        <p className="mt-2 text-muted-foreground">
          Add some products or services to get started
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="brandline" asChild>
            <a href="/services">Browse Services</a>
          </Button>
          <Button asChild variant="brand">
            <a href="/products">Shop Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex-1 overflow-y-auto space-y-8">
        {cart.groupedByProvider.map((group) => (
          <div
            key={group.providerId}
            className="border rounded-lg overflow-hidden"
          >
            <div className="bg-muted px-4 py-3 border-b">
              <h3 className="font-medium text-foreground">
                From {group.providerName}
              </h3>
            </div>

            {/* Services Section */}
            {group.services.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-foreground">Services</h4>
                </div>
                <ul className="space-y-4">
                  {group.services.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeFromCart(item.id)}
                      onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                    />
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <Button asChild variant="brand">
                    <a href={`/providers/${group.providerId}`}>
                      Book These Services
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Products Section */}
            {group.products.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-foreground">Products</h4>
                </div>
                <ul className="space-y-4">
                  {group.products.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeFromCart(item.id)}
                      onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                    />
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <Button asChild variant="brand">
                    <a href={`/providers/${group.providerId}`}>
                      Order These Products
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <div className="px-4 py-3 border-t bg-muted/50 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium">£{group.subtotal.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-lg font-medium mb-4">
          <span>Total</span>
          <span>£{cart.total.toFixed(2)}</span>
        </div>
        <Button className="w-fit ml-auto" size="lg" asChild variant="brand">
          <a href="/checkout">Checkout All</a>
        </Button>
      </div>
    </div>
  );
}

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <li className="flex gap-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.images?.[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name || "Item image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            {item.type === "service" ? (
              <Calendar className="h-6 w-6 text-muted-foreground/60" />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground/60" />
            )}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium text-foreground">{item.name}</h4>
            {item.type === "service" ? (
              <Badge variant="outline" className="text-xs mt-1">
                {formatDuration(Number(item?.duration))}
              </Badge>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">{item.brand}</p>
            )}
            <span className="text-sm text-muted-foreground block mt-1">
              {formatCurrency(
                Number(item.discountPrice || item.price).toFixed(2),
                item?.currency!
              )}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive/80"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity === 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}
