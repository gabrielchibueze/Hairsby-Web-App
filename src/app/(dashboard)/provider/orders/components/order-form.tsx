"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Order,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from "@/lib/api/products/order";
import { Product } from "@/lib/api/products/product";
import { getProducts } from "@/lib/api/products/product";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const orderFormSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
  shippingAddress: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
    })
    .optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

export function OrderForm({
  order,
  customerId,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
  onCancel,
}: {
  order: Order | null;
  customerId: string;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      items:
        order?.items?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })) || [],
      shippingAddress: order?.shippingAddress || undefined,
      paymentMethod: order?.paymentMethod || "card",
      notes: order?.notes || "",
    },
  });

  const selectedItems = form.watch("items");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  async function onSubmit(values: z.infer<typeof orderFormSchema>) {
    setIsSubmitting(true);
    try {
      if (order) {
        // Update order status if needed
        await updateOrderStatus(order.id, {
          status: "processing",
          paymentStatus: "paid",
        });
        toast({
          title: "Success",
          description: "Order updated successfully",
        });
      } else {
        // Create new order
        await createOrder({
          items: values.items,
          shippingAddress: values.shippingAddress,
          paymentMethod: values.paymentMethod,
          notes: values.notes,
        });
        toast({
          title: "Success",
          description: "Order created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      await cancelOrder(order.id, "Cancelled by customer");
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Section */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label className="block mb-2">Products</Label>
              {isLoadingProducts ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products?.map((product) => {
                    const currentItem = selectedItems.find(
                      (item) => item.productId === product.id
                    );
                    const quantity = currentItem?.quantity || 0;

                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "border rounded-lg p-4 transition-colors",
                          quantity > 0
                            ? "border-hairsby-orange bg-amber-50"
                            : "hover:border-gray-300"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <div className="text-sm text-gray-500 mt-1">
                              {product.stock} in stock
                            </div>
                          </div>
                          <span className="text-sm text-hairsby-orange font-medium">
                            £{product.price}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={quantity <= 0}
                            onClick={() => {
                              const newItems = selectedItems?.filter(
                                (item) => item.productId !== product.id
                              );
                              form.setValue("items", newItems);
                            }}
                          >
                            Remove
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={quantity <= 1}
                              onClick={() => {
                                const newItems = selectedItems?.map((item) =>
                                  item.productId === product.id
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                                );
                                form.setValue("items", newItems);
                              }}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={quantity >= product.stock}
                              onClick={() => {
                                const existingItem = selectedItems.find(
                                  (item) => item.productId === product.id
                                );
                                if (existingItem) {
                                  const newItems = selectedItems?.map((item) =>
                                    item.productId === product.id
                                      ? { ...item, quantity: item.quantity + 1 }
                                      : item
                                  );
                                  form.setValue("items", newItems);
                                } else {
                                  form.setValue("items", [
                                    ...selectedItems,
                                    { productId: product.id, quantity: 1 },
                                  ]);
                                }
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {form.formState.errors.items && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.items.message}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-medium">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shippingAddress.street"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingAddress.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingAddress.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingAddress.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingAddress.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special instructions..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          {order &&
            (order.status === "pending" || order.status === "processing") && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isSubmitting}
              >
                Cancel Order
              </Button>
            )}
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
            ) : order ? (
              "Update Order"
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
