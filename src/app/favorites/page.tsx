import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Favorites | Hairsby",
  description:
    "View and manage your saved favorite services and professionals.",
  keywords: [
    "saved beauty services",
    "favorite hairstylists",
    "wishlist hair appointments",
    "remember salon services",
    "bookmark beauty professionals",
    "quick book favorites",
    "save for later beauty",
    "preferred stylists list",
    "salon service collections",
  ],
  robots: {
    index: false,
  },
  openGraph: {
    title: "Your Favorites | Hairsby",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/favorites",
  },
};

export default function FavoritesPage() {
  return;
}
