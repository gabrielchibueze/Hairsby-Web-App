import { Metadata } from "next";
import { CartList } from "@/components/cart/cart-list";
export const metadata: Metadata = {
  title: "Your Cart | Hairsby",
  description: "Review your selected services and products before checkout.",
  keywords: [
    "professional service checkout",
    "hair appointment cart",
    "review bookings",
    "service package cart",
    "product purchase summary",
    "service cart items",
    "appointment confirmation",
    "payment options service",
    "service quantity update",
  ],
  robots: {
    index: false,
  },
  openGraph: {
    title: "Your Cart | Hairsby",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/cart",
  },
};
export default function CartPage() {
  return <CartList />;
}
