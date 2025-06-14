"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { ProductForm } from "./product-form";
import { Product } from "@/lib/api/products/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ProductDetails } from "./product-details";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductDetails } from "./product-details";
import { ProductForm } from "./product-form";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  providerId: string;
  onSuccess: () => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  providerId,
  onSuccess,
}: ProductDialogProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] sm:mx-0 sm:max-w-[800px] min-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {product ? (
              <>
                <span>{product.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {product.category}
                </span>
              </>
            ) : (
              "Create New Product"
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {product ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="edit">Edit Product</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <ProductDetails
                  product={product}
                  embedded
                  onEditProduct={() => setActiveTab("edit")}
                />
              </TabsContent>
              <TabsContent value="edit" className="pt-4">
                <ProductForm
                  product={product}
                  providerId={providerId}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  onSuccess={() => {
                    onSuccess();
                    onOpenChange(false);
                  }}
                  onCancel={() => onOpenChange(false)}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <ProductForm
              product={null}
              providerId={providerId}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onSuccess={() => {
                onSuccess();
                onOpenChange(false);
              }}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
