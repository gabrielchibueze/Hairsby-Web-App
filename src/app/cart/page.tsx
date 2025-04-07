import { Metadata } from "next";
import CartComponent from "./cart";
export const metadata: Metadata = {
  title: "Your Cart | Hairsby",
  description: "Review your selected services and products before checkout.",
  keywords: [
    "beauty service checkout",
    "hair appointment cart",
    "review bookings",
    "service package cart",
    "product purchase summary",
    "beauty cart items",
    "appointment confirmation",
    "payment options beauty",
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
  return <CartComponent />;
}
