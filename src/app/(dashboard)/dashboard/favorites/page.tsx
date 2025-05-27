import { Metadata } from "next";
import FavoriteComponent from "@/components/favorite/favorite-components";

export const metadata: Metadata = {
  title: "Your Favorites | Hairsby",
  description:
    "View and manage your saved favorite services and professionals.",
  keywords: [
    "saved professional services",
    "favorite hairstylists",
    "wishlist hair appointments",
    "remember business services",
    "bookmark service professionals",
    "quick book favorites",
    "save for later service",
    "preferred specialists list",
    "business service collections",
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
  return <FavoriteComponent />;
}
