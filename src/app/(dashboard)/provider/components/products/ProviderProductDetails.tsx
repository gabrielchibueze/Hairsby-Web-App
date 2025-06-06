"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api/products/product";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewList } from "@/components/reviews/review-list";
import { AddReviewForm } from "@/components/reviews/add-review-form";
import Link from "next/link";
import { getProviderProductById } from "@/lib/api/accounts/provider";
import { ImageCarousel } from "@/components/general/image-carousel";
import { OrderList } from "@/components/order/components/order-list";
import { ProductStatusBadge } from "./status-badge";

export default function ProviderProductDetails({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [canEdit, setCanEdit] = useState(false);
  const [editQueryString, setEditQueryString] = useState<string | null>(null);
  const searchParams = useSearchParams();

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
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  useEffect(() => {
    const employeeId = searchParams.get("employeeId");
    const businessId = searchParams.get("businessId");
    const canManage = searchParams.get("canManage") === "true";
    const whoCanEdit = businessId && employeeId && !canManage ? false : true;

    setCanEdit(whoCanEdit);
    if (employeeId && businessId) {
      setEditQueryString(searchParams.toString());
    }
  }, [searchParams]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-3 gap-1">
              {[...Array(3)].map((_, i) => (
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
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div>
        <Card className="p-0">
          <CardHeader className="border-b ">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    {product.name}
                    <ProductStatusBadge status={product.status} />
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {product.category} • {product.brand}
                  </CardDescription>
                </div>

                {canEdit && (
                  <Link
                    href={`/provider/products/${product.id}/edit${editQueryString ? `?${editQueryString}` : ""}`}
                  >
                    <Button variant="brand">Edit Product</Button>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {Number(product.averageRating)?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
                <span className="text-sm text-muted-foreground">
                  • {product.orders?.length || 0} orders
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="details">
                  <Info className="h-4 w-4 mr-2" />
                  Product Details
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Orders ({product.orders?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Reviews ({product.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    {/* Product Images */}
                    <ImageCarousel
                      images={product.images}
                      name={product.name}
                      price={product.price}
                      discountPrice={product.discountPrice}
                    />
                  </div>
                  <section className="space-y-6">
                    {/* Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Overview</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>

                    <Separator />
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5 text-hairsby-orange" />
                        Product Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{product.name}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Category
                          </p>
                          <p className="capitalize">{product.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Brand</p>
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
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">
                            {formatCurrency(Number(product.price))}
                          </p>
                        </div>
                        {product.discountPrice && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Discount Price
                            </p>
                            <p className="font-medium text-hairsby-orange">
                              {formatCurrency(Number(product.discountPrice))}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">
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
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p>{product.stock}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
                          <ProductStatusBadge status={product.status} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">SKU</p>
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
                                  <p className="text-sm text-muted-foreground">
                                    Name
                                  </p>
                                  <p className="font-medium">{variant.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Price
                                  </p>
                                  <p>{formatCurrency(variant.price)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Stock
                                  </p>
                                  <p>{variant.stock}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
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
                  </section>
                </div>
              </TabsContent>
              <TabsContent value="orders" className="p-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Product Orders</h3>
                      <p className="text-sm text-muted-foreground mt-1">
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
                    <OrderList orders={product.orders} inDetails={true} />
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        No orders found for this product
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Customer Reviews</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-lg font-bold">
                          {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
