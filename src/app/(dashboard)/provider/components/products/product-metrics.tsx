"use client";

import { Product } from "@/lib/api/products/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Star,
  TrendingUp,
  Percent,
  Box,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth.context";

interface ProductMetricsProps {
  products: Product[];
}

export function ProductMetrics({ products }: ProductMetricsProps) {
  // Calculate metrics
  const { user } = useAuth();
  let totalProducts = 0,
    productsWithVariants = 0,
    outOfStockProducts = 0,
    productsWithDiscount = 0,
    averagePrice = 0,
    averageRating = 0,
    totalOrders = 0;
  if (products && products.length > 0) {
    totalProducts = products.length;
    productsWithVariants = products.filter((p) => p.hasVariants).length;
    outOfStockProducts = products.filter(
      (p) => p.status === "out_of_stock"
    ).length;

    productsWithDiscount = products.filter(
      (p) => p.discountPrice && p.discountPrice < p.price
    ).length;

    averagePrice =
      products.reduce((sum, product) => sum + Number(product.price), 0) /
      totalProducts;

    averageRating =
      products.reduce(
        (sum, product) => sum + (Number(product.averageRating) || 0),
        0
      ) / totalProducts;

    totalOrders = products.reduce(
      (sum, product) => sum + (Number(product.ordersCount) || 0),
      0
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {productsWithVariants} with variants
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Status</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{outOfStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            {products.length > 1
              ? Number((outOfStockProducts / totalProducts) * 100).toFixed(1)
              : 0}
            % of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(Number(averagePrice).toFixed(2), user?.currency!)}
          </div>
          <p className="text-xs text-muted-foreground">
            {productsWithDiscount} products with discounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number(averageRating).toFixed(1)}/5
          </div>
          <p className="text-xs text-muted-foreground">from product reviews</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number(totalOrders).toFixed(0)}
          </div>
          <p className="text-xs text-muted-foreground">
            all-time product orders
          </p>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Discounts</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsWithDiscount}</div>
          <p className="text-xs text-muted-foreground">
            {Number((productsWithDiscount / totalProducts) * 100).toFixed(1)}%
            of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Variants</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsWithVariants}</div>
          <p className="text-xs text-muted-foreground">
            {Number((productsWithVariants / totalProducts) * 100).toFixed(1)}%
            of total
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
}
