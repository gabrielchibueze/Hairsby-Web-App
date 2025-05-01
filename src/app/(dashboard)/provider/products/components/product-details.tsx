// "use client";

// import { Product } from "@/lib/api/products/product";
// import { Button } from "@/components/ui/button";
// import { Package, DollarSign, Box, Info, Layers } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import { formatCurrency } from "@/lib/utils";
// import { StatusBadge } from "./status-badge";

// interface ProductDetailsProps {
//   product: Product;
//   onEditProduct?: () => void;
// }

// export function ProductDetails({
//   product,
//   onEditProduct,
// }: ProductDetailsProps) {
//   const mainImage =
//     product.coverPhoto || product.images?.[0] || "/placeholder-product.jpg";

//   return (
//     <div className="space-y-6">
//       {/* Product Images */}
//       <h1>
//         <span className="mr-4 font-bold">{product.name}</span>
//         <StatusBadge status={product.status} />
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
//           <Image
//             src={mainImage}
//             alt={product.name}
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>
//         <div className="grid grid-cols-3 gap-2">
//           {product.images?.slice(0, 5)?.map((image, index) => (
//             <div
//               key={index}
//               className="relative aspect-square bg-gray-100 rounded overflow-hidden"
//             >
//               <Image
//                 src={image}
//                 alt={`${product.name} ${index + 1}`}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <Separator />

//       {/* Basic Information */}
//       <div className="space-y-4">
//         <h3 className="font-medium flex items-center gap-2 text-lg">
//           <Package className="h-5 w-5 text-hairsby-orange" />
//           Product Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
//           <div>
//             <p className="text-sm text-gray-500">Name</p>
//             <p className="font-medium">{product.name}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Description</p>
//             <p className="whitespace-pre-line">{product.description}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Category</p>
//             <p className="capitalize">{product.category}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Brand</p>
//             <p className="capitalize">{product.brand}</p>
//           </div>
//         </div>
//       </div>

//       <Separator />

//       {/* Pricing */}
//       <div className="space-y-4">
//         <h3 className="font-medium flex items-center gap-2 text-lg">
//           <DollarSign className="h-5 w-5 text-hairsby-orange" />
//           Pricing
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
//           <div>
//             <p className="text-sm text-gray-500">Price</p>
//             <p className="font-medium">
//               {formatCurrency(Number(product.price))}
//             </p>
//           </div>
//           {product.discountPrice && (
//             <div>
//               <p className="text-sm text-gray-500">Discount Price</p>
//               <p className="font-medium text-hairsby-orange">
//                 {formatCurrency(Number(product.discountPrice))}
//               </p>
//             </div>
//           )}
//           <div>
//             <p className="text-sm text-gray-500">Discount</p>
//             <p className="font-medium">
//               {product.discountPrice
//                 ? `${Math.round(
//                     ((product.price - product.discountPrice) / product.price) *
//                       100
//                   )}% off`
//                 : "None"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <Separator />

//       {/* Inventory */}
//       <div className="space-y-4">
//         <h3 className="font-medium flex items-center gap-2 text-lg">
//           <Box className="h-5 w-5 text-hairsby-orange" />
//           Inventory
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
//           <div>
//             <p className="text-sm text-gray-500">Stock</p>
//             <p>{product.stock}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Status</p>
//             <StatusBadge status={product.status} />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">SKU</p>
//             <p className="font-mono">{product.id.split("-")[0]}</p>
//           </div>
//         </div>
//       </div>

//       {/* Variants */}
//       {product.hasVariants && product.variants && (
//         <>
//           <Separator />
//           <div className="space-y-4">
//             <h3 className="font-medium flex items-center gap-2 text-lg">
//               <Layers className="h-5 w-5 text-hairsby-orange" />
//               Variants ({product.variants?.length})
//             </h3>
//             <div className="space-y-3 pl-7">
//               {product.variants?.map((variant) => (
//                 <div
//                   key={variant.id}
//                   className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4"
//                 >
//                   <div>
//                     <p className="text-sm text-gray-500">Name</p>
//                     <p className="font-medium">{variant.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Price</p>
//                     <p>{formatCurrency(variant.price)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Stock</p>
//                     <p>{variant.stock}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Images</p>
//                     <p>{variant.images?.length || 0}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Notes */}
//       {product.notes && (
//         <>
//           <Separator />
//           <div className="space-y-2">
//             <h3 className="font-medium flex items-center gap-2 text-lg">
//               <Info className="h-5 w-5 text-hairsby-orange" />
//               Notes
//             </h3>
//             <p className="pl-7 text-gray-700 whitespace-pre-line">
//               {product.notes}
//             </p>
//           </div>
//         </>
//       )}

//       <div className="flex justify-end gap-4 pt-6">
//         {onEditProduct && (
//           <Button
//             className="bg-hairsby-orange hover:bg-hairsby-orange/80"
//             onClick={onEditProduct}
//           >
//             Edit Product
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Package,
  DollarSign,
  Tag,
  Box,
  Star,
  Image as ImageIcon,
  Info,
  Layers,
} from "lucide-react";
import { Product } from "@/lib/api/products/product";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface ProductDetailsProps {
  product: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEditProduct?: () => void;
  embedded?: boolean;
}

export function ProductDetails({
  product,
  open = true,
  onOpenChange,
  onEditProduct,
  embedded = false,
}: ProductDetailsProps) {
  if (!product) return null;

  const Wrapper = embedded ? "div" : Dialog;
  const WrapperContent = embedded ? "div" : DialogContent;

  const mainImage =
    product.coverPhoto || product.images?.[0] || "/placeholder-product.jpg";

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent
        className={embedded ? "" : "max-w-[350px] sm:mx-0 sm:max-w-[800px]"}
      >
        {!embedded && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{product.name}</span>
              <StatusBadge status={product.status} />
            </DialogTitle>
          </DialogHeader>
        )}
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Product Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.images?.slice(0, 5)?.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
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
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
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
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    {formatCurrency(Number(product.price))}
                  </p>
                </div>
                {product.discountPrice && (
                  <div>
                    <p className="text-sm text-gray-500">Discount Price</p>
                    <p className="font-medium text-hairsby-orange">
                      {formatCurrency(Number(product.discountPrice))}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Discount</p>
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
                  <p className="text-sm text-gray-500">Stock</p>
                  <p>{product.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={product.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">SKU</p>
                  <p className="font-mono">{product.id.split("-")[0]}</p>
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
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{variant.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p>{formatCurrency(variant.price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Stock</p>
                          <p>{variant.stock}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Images</p>
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
                  <p className="pl-7 text-gray-700 whitespace-pre-line">
                    {product.notes}
                  </p>
                </div>
              </>
            )}
          </div>

          {!embedded && (
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Close
              </Button>
              {onEditProduct && (
                <Link href={`/provider/products/${product.id}/edit`}>
                  <Button
                    className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                    onClick={onEditProduct}
                  >
                    Edit Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </ScrollArea>
      </WrapperContent>
    </Wrapper>
  );
}
