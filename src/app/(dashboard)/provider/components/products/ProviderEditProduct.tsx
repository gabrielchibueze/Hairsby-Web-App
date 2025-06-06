"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/lib/api/products/product";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "./product-form";
import { getProviderProductById } from "@/lib/api/accounts/provider";

export default function ProviderEditProduct() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [businessEmployeeData, setBusinessEmployeeData] = useState<any>({
    employeeId: "" as string,
    businessId: "" as string,
    firstName: "" as string,
    lastName: "" as string,
    businessName: "" as string,
    role: "" as string,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const employeeId = searchParams.get("employeeId") || null;
    const businessId = searchParams.get("businessId") || null;
    const firstName = searchParams.get("firstName") || null;
    const lastName = searchParams.get("lastName") || null;
    const businessName = searchParams.get("businessName") || null;
    const role = searchParams.get("role") || null;
    const canManage = searchParams.get("canManage") === "true";

    setBusinessEmployeeData((prev: any) => {
      return {
        ...prev,
        employeeId,
        businessId,
        firstName,
        lastName,
        businessName,
        role,
        canManage,
      };
    });
  }, [searchParams]);

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
    router.back();
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 rounded-lg" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            {/* Variants Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  if (
    businessEmployeeData.businessId &&
    businessEmployeeData.employeeId &&
    !businessEmployeeData.canManage
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Edit Product{" "}
            {businessEmployeeData.role === "business"
              ? `for ${businessEmployeeData.firstName} ${businessEmployeeData.lastName}`
              : `with ${businessEmployeeData.businessName || `${businessEmployeeData.firstName} ${businessEmployeeData.lastName}`}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2 ">
              <p className="text-lg font-medium">
                Permission to edit product denied.
              </p>
              <Button
                variant="brand"
                className="flex items-center gap-2 mt-4 mx-auto"
                onClick={handleCancel}
              >
                <ChevronLeft className="h-4 w-4" />
                Go back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
          Back
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
              businessEmployeeData={businessEmployeeData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
