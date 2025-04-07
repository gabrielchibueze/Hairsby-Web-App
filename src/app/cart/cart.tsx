"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { getCart } from "@/lib/api/cart";
import { useCart } from "@/components/cart/cart-provider";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/api/cart/cart";

export default function CartComponent() {
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    initialData: { items: [], total: 0 },
  });

  const { removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-gray-900">Shopping Cart</span>
        </div>
      </div>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

          {isLoading ? (
            <div className="mt-8 space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : cart.items.length === 0 ? (
            <div className="mt-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Your cart is empty
              </h2>
              <p className="mt-2 text-gray-600">
                Start shopping to add items to your cart
              </p>
              <Link href="/products">
                <Button className="mt-6 bg-hairsby-orange hover:bg-amber-500">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
              {/* Cart Items */}
              <div className="lg:col-span-8">
                <div className="hidden lg:grid grid-cols-12 gap-4 border-b border-gray-200 pb-2 text-sm text-gray-500">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-3">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-6"
                    >
                      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-4">
                        {/* Product Info */}
                        <div className="flex items-start gap-4 lg:col-span-5">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.type === "service" &&
                                `Duration: ${item.duration} mins`}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 lg:mt-0 lg:col-span-2 flex items-center lg:block">
                          <span className="text-sm lg:hidden text-gray-500 mr-2">
                            Price:
                          </span>
                          <span className="text-gray-900">
                            £{item.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="mt-4 lg:mt-0 lg:col-span-3">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-50"
                            >
                              -
                            </button>
                            <div className="h-8 w-12 flex items-center justify-center border-t border-b border-gray-300 text-sm">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total and Remove */}
                        <div className="mt-4 lg:mt-0 lg:col-span-2 flex items-center justify-between">
                          <div className="lg:text-right">
                            <span className="text-sm lg:hidden text-gray-500 mr-2">
                              Total:
                            </span>
                            <span className="text-gray-900">
                              £{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-gray-400 hover:text-gray-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="mt-8 lg:mt-0 lg:col-span-4">
                <div className="rounded-lg bg-gray-50 p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">
                        £{cart.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="text-sm font-medium text-gray-900">
                        £0.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-base font-medium text-gray-900">
                        Order Total
                      </span>
                      <span className="text-base font-medium text-gray-900">
                        £{cart.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      asChild
                      className="w-full bg-hairsby-orange hover:bg-amber-500"
                    >
                      <Link href="/checkout">Checkout</Link>
                    </Button>
                  </div>

                  <div className="mt-4 flex justify-center text-sm text-gray-600">
                    <p>
                      or{" "}
                      <Link
                        href="/products"
                        className="font-medium text-hairsby-orange hover:text-amber-500"
                      >
                        Continue Shopping
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}
