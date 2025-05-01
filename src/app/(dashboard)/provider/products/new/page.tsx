"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createProduct } from "@/lib/api/products/product";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "../components/product-form";
import { useState } from "react";

export default function CreateProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    // toast({
    //   title: "Success",
    //   description: "Product created successfully",
    // });
    // router.push("/provider/products");
  };

  const handleCancel = () => {
    router.push("/provider/products");
  };

  return (
    <div className="container mx-auto px-4 py-4">
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
              Create New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={null}
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
