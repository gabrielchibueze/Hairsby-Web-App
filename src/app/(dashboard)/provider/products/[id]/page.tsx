"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api/products/product";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { getProductById, getProductOrders } from "@/lib/api/products/product";
import { toast } from "@/components/ui/use-toast";
import {
  Package,
  DollarSign,
  Tag,
  Box,
  Star,
  Image as ImageIcon,
  Info,
  Layers,
  ShoppingCart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProductStatusBadge } from "../components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewList } from "@/components/general/reviews/review-list";
import { AddReviewForm } from "@/components/general/reviews/add-review-form";
import Link from "next/link";
import { getProviderProductById } from "@/lib/api/accounts/provider";
import { Order } from "@/lib/api/products/order";
import { ImageCarousel } from "@/components/general/image-carousel";
import { OrderStatusBadge } from "@/components/order/components/order-status-badge";
import { OrderList } from "@/components/order/components/order-list";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProviderProductById(id as string);
        setProduct(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        router.push("/dashboard/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);
  console.log(product);

  const handleEditProduct = () => {
    router.push(`/provider/products/${id}/edit`);
  };

  const handleBack = () => {
    router.push("/provider/products");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded" />
              ))}
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground/100">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-0">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  {product.name}
                  <ProductStatusBadge status={product.status} />
                </CardTitle>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {Number(product.averageRating)?.toFixed(1) ||
                      "No ratings yet"}
                  </span>
                  <span className="mx-2 text-muted-FOREGROUND/60">•</span>
                  <span className="text-sm text-muted-foreground/100">
                    {product.reviewCount} reviews
                  </span>
                  <span className="mx-2 text-muted-FOREGROUND/60">•</span>
                  <span className="text-sm text-muted-foreground/100">
                    {product.orders?.length || 0} orders
                  </span>
                </div>
              </div>
              <Link href={`/provider/products/${product.id}/edit`}>
                <Button className="bg-hairsby-orange hover:bg-hairsby-orange/80">
                  Edit Product
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="orders">
                  Orders ({product.orders?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({product.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6">
                <TabsContent value="details" className="p-6">
                  <div className="space-y-6">
                    {/* Product Images */}
                    <ImageCarousel
                      images={product.images}
                      name={product.name}
                      price={product.price}
                      discountPrice={product.discountPrice}
                      flex={true}
                    />

                    <Separator />

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5 text-hairsby-orange" />
                        Product Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Name
                          </p>
                          <p className="font-medium">{product.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Description
                          </p>
                          <p className="whitespace-pre-line">
                            {product.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Category
                          </p>
                          <p className="capitalize">{product.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Brand
                          </p>
                          <p className="capitalize">{product.brand}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-lg">
                        <DollarSign className="h-5 w-5 text-hairsby-orange" />
                        Pricing
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Price
                          </p>
                          <p className="font-medium">
                            {formatCurrency(Number(product.price))}
                          </p>
                        </div>
                        {product.discountPrice && (
                          <div>
                            <p className="text-sm text-muted-foreground/100">
                              Discount Price
                            </p>
                            <p className="font-medium text-hairsby-orange">
                              {formatCurrency(Number(product.discountPrice))}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Discount
                          </p>
                          <p className="font-medium">
                            {product.discountPrice
                              ? `${Math.round(
                                  ((product.price - product.discountPrice) /
                                    product.price) *
                                    100
                                )}% off`
                              : "None"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Inventory */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-lg">
                        <Box className="h-5 w-5 text-hairsby-orange" />
                        Inventory
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Stock
                          </p>
                          <p>{product.stock}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            Status
                          </p>
                          <ProductStatusBadge status={product.status} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground/100">
                            SKU
                          </p>
                          <p className="font-mono">
                            {product.id.split("-")[0]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Variants */}
                    {product.hasVariants && product.variants && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-medium flex items-center gap-2 text-lg">
                            <Layers className="h-5 w-5 text-hairsby-orange" />
                            Variants ({product.variants?.length})
                          </h3>
                          <div className="space-y-3 pl-7">
                            {product.variants?.map((variant) => (
                              <div
                                key={variant.id}
                                className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4"
                              >
                                <div>
                                  <p className="text-sm text-muted-foreground/100">
                                    Name
                                  </p>
                                  <p className="font-medium">{variant.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground/100">
                                    Price
                                  </p>
                                  <p>{formatCurrency(variant.price)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground/100">
                                    Stock
                                  </p>
                                  <p>{variant.stock}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground/100">
                                    Images
                                  </p>
                                  <p>{variant.images?.length || 0}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Notes */}
                    {product.notes && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h3 className="font-medium flex items-center gap-2 text-lg">
                            <Info className="h-5 w-5 text-hairsby-orange" />
                            Notes
                          </h3>
                          <p className="pl-7 text-foreground/80 whitespace-pre-line">
                            {product.notes}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>{" "}
              </TabsContent>

              <TabsContent value="orders" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Product Orders</h3>
                      <p className="text-sm text-muted-foreground/100 mt-1">
                        All orders containing this product
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                          <Skeleton className="h-6 w-48" />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : product?.orders && product?.orders?.length > 0 ? (
                    // <div className="space-y-4">
                    //   {product.orders?.map((order) => (
                    //     <div key={order.id} className="border rounded-lg p-4">
                    //       <div className="flex justify-between items-start">
                    //         <div>
                    //           <h4 className="font-medium">
                    //             Order #{order.orderCode}
                    //           </h4>
                    //           <p className="text-sm text-muted-foreground/100">
                    //             {order.createdAt && formatDate(order.createdAt)}
                    //           </p>
                    //         </div>

                    //         <OrderStatusBadge status={order.status} />
                    //       </div>

                    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    //         <div>
                    //           <p className="text-sm text-muted-foreground/100">Customer</p>
                    //           <p>
                    //             {order.customer?.firstName}{" "}
                    //             {order.customer?.lastName}
                    //           </p>
                    //         </div>
                    //         <div>
                    //           <p className="text-sm text-muted-foreground/100">
                    //             Total Amount
                    //           </p>
                    //           <p>{formatCurrency(order.totalAmount)}</p>
                    //         </div>
                    //         <div>
                    //           <p className="text-sm text-muted-foreground/100">
                    //             Payment Status
                    //           </p>
                    //           <p className="capitalize">
                    //             {order.paymentStatus.replace("_", " ")}
                    //           </p>
                    //         </div>
                    //       </div>

                    //       <div className="mt-4">
                    //         <p className="text-sm text-muted-foreground/100">
                    //           This Product in Order
                    //         </p>
                    //         {order.items
                    //           .filter(
                    //             (item: any) => item.productId === product.id
                    //           )
                    //           .map((item: any, index: number) => (
                    //             <div
                    //               key={index}
                    //               className="flex items-center justify-between mt-2 p-2 bg-background rounded"
                    //             >
                    //               <div className="flex items-center space-x-4">
                    //                 <div className="w-12 h-12 bg-muted/80 rounded flex items-center justify-center">
                    //                   <ShoppingCart className="h-5 w-5 text-muted-FOREGROUND/60" />
                    //                 </div>
                    //                 <div>
                    //                   <p className="font-medium">{item.name}</p>
                    //                   <p className="text-sm text-muted-foreground/100">
                    //                     Qty: {item.quantity}
                    //                   </p>
                    //                 </div>
                    //               </div>
                    //               <p className="font-medium">
                    //                 {formatCurrency(item.price * item.quantity)}
                    //               </p>
                    //             </div>
                    //           ))}
                    //       </div>

                    //       <div className="mt-4 flex justify-end">
                    //         <Button
                    //           variant="outline"
                    //           size="sm"
                    //           onClick={() =>
                    //             router.push(`/dashboard/orders/${order.id}`)
                    //           }
                    //         >
                    //           View Order
                    //         </Button>
                    //       </div>
                    //     </div>
                    //   ))}
                    // </div>
                    <OrderList orders={product.orders} inDetails={true} />
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-FOREGROUND/60" />
                      <p className="mt-2 text-muted-foreground/100">
                        No orders found for this product
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          Customer Reviews
                        </h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-lg font-bold">
                            {product.averageRating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="mx-2 text-muted-FOREGROUND/60">
                            •
                          </span>
                          <span className="text-muted-foreground/100">
                            {product.reviewCount} reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Add Review Form (only for customers) */}
                    <div>
                      {!user?.id ? (
                        <p className="spacy-y-8 m-auto">
                          Sign in to make a review for this product
                        </p>
                      ) : (
                        user?.id != product.provider?.id && (
                          <AddReviewForm id={product.id} type="product" />
                        )
                      )}

                      {/* Reviews List */}
                      <ReviewList id={product.id} type="product" />
                    </div>
                  </div>
                </TabsContent>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
