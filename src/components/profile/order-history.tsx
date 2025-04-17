"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPurchaseHistory } from "@/lib/api/accounts/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Order } from "@/lib/api/products/order";

export function OrderHistory() {
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const { purchases } = await getPurchaseHistory();
        setPurchases(purchases);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load purchase history",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="default" className="gap-1">
            <Package className="h-3 w-3" />
            Shipped
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Processing</Badge>;
    }
  };

  return (
    <Card className="border-hairsby-orange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Purchase History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No purchases yet</h3>
            <p className="text-sm text-muted-foreground">
              Your order history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        Order #{purchase.orderCode}
                      </h3>
                      {getStatusBadge(purchase.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {purchase.createdAt &&
                            format(new Date(purchase?.createdAt), "PPP")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {purchase.items.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="font-medium">{item.quantity}x</span>
                          <span>{item.name}</span>
                          {i === 2 && purchase.items.length > 3 && (
                            <span className="text-muted-foreground">
                              +{purchase.items.length - 3} more
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-medium">
                      ${purchase.totalAmount.toFixed(2)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-hairsby-orange text-hairsby-orange"
                    >
                      View Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
