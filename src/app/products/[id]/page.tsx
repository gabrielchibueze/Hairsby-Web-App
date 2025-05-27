import { getProductById } from "@/lib/api/products/product";
import ProductDetailComponent from "./productDetails";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);

  return {
    title: `${product.name} | Hairsby`,
    description: product.description,
    keywords: [
      `buy ${product.name} online`,
      `${product.brand} ${product.name}`,
      `${product.name} reviews`,
      `${product.category} products`,
      `professional ${product.name}`,
      `${product.name} price comparison`,
      `${product.name} how to use`,
      `how to use ${product.name}`,
      `${product.name} ingredients`,
      `best ${product.category} products`,
      `${product.name} for salons`,
      "products",
    ],
    openGraph: {
      title: `${product.name} | Hairsby`,
      images: [product.coverPhoto || product.images[0]],
      url: `https://hairsby.com/products/${params.id}`,
    },
    alternates: {
      canonical: `https://hairsby.com/products/${params.id}`,
    },
  };
}
export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductDetailComponent params={params} />;
}
