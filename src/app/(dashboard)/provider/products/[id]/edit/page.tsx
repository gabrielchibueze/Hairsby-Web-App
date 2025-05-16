"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getProductById, updateProduct } from "@/lib/api/products/product";
import { Product } from "@/lib/api/products/product";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "../../components/product-form";

export default function EditProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        router.push(`/provider/products/${product?.id}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Product updated successfully. Redirecting...",
    });
    // router.push("/dashboard/products");
  };

  const handleCancel = () => {
    router.push(`/provider/products/${product?.id}`);
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
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-24 ml-auto" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground/100">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Edit Product: {product.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={product}
              providerId={user?.id || ""}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
