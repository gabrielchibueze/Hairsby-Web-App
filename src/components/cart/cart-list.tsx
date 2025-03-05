"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export function CartList() {
  const { cart, updateItem, removeItem } = useCart();

  if (!cart?.items.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Your cart is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add some products to your cart
        </p>
        <Button className="mt-8" asChild>
          <a href="/products">Shop Now</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b py-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                £{item.price.toFixed(2)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateItem(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateItem(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-lg font-medium">
          <span>Total</span>
          <span>£{cart.total.toFixed(2)}</span>
        </div>
        <Button className="mt-4 w-full" size="lg" asChild>
          <a href="/checkout">Checkout</a>
        </Button>
      </div>
    </div>
  );
}
