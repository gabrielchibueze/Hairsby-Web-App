// components/favorite/favorite-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavoriteServices,
  addServiceToFavorites,
  removeServiceFromFavorites,
  getFavoriteProducts,
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProviders,
  addProviderToFavorites,
  removeProviderFromFavorites,
} from "@/lib/api/accounts/favorite";
import { toast } from "@/components/ui/use-toast";

type FavoriteItem = {
  id: string;
  type: "service" | "product" | "provider";
  itemId: string;
  // name: string;
  // price?: number;
  // image?: string;
};

type FavoriteContextType = {
  favorites: FavoriteItem[];
  favoriteCount: number;
  isFavorite: (
    type: "service" | "product" | "provider",
    itemId: string
  ) => boolean;
  toggleFavorite: (
    type: "service" | "product" | "provider",
    itemId: string
    // name: string,
    // price?: number,
    // image?: string
  ) => void;
  isLoading: boolean;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: services = { favorites: [], pagination: { total: 0 } } } =
    useQuery({
      queryKey: ["favorites", "services"],
      queryFn: () => getFavoriteServices(1, 100),
    });

  const { data: products = { favorites: [], pagination: { total: 0 } } } =
    useQuery({
      queryKey: ["favorites", "products"],
      queryFn: () => getFavoriteProducts(1, 100),
    });

  const { data: providers = { favorites: [], pagination: { total: 0 } } } =
    useQuery({
      queryKey: ["favorites", "providers"],
      queryFn: () => getFavoriteProviders(1, 100),
    });

  const addServiceMutation = useMutation({
    mutationFn: addServiceToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "services"] });
      toast({
        title: "Added to favorites",
        description: "Service has been added to your favorites",
      });
    },
  });

  const removeServiceMutation = useMutation({
    mutationFn: removeServiceFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "services"] });
      toast({
        title: "Removed from favorites",
        description: "Service has been removed from your favorites",
      });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: addProductToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "products"] });
      toast({
        title: "Added to favorites",
        description: "Product has been added to your favorites",
      });
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: removeProductFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "products"] });
      toast({
        title: "Removed from favorites",
        description: "Product has been removed from your favorites",
      });
    },
  });

  const addProviderMutation = useMutation({
    mutationFn: addProviderToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "providers"] });
      toast({
        title: "Added to favorites",
        description: "Provider has been added to your favorites",
      });
    },
  });

  const removeProviderMutation = useMutation({
    mutationFn: removeProviderFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "providers"] });
      toast({
        title: "Removed from favorites",
        description: "Provider has been removed from your favorites",
      });
    },
  });

  const allFavorites = [
    ...services.favorites.map((f) => ({
      id: f.id,
      type: "service" as const,
      itemId: f.service.id,
      name: f.service.name,
      price: f.service.price,
    })),
    ...products.favorites.map((f) => ({
      id: f.id,
      type: "product" as const,
      itemId: f.product.id,
      name: f.product.name,
      price: f.product.price,
    })),
    ...providers.favorites.map((f) => ({
      id: f.id,
      type: "provider" as const,
      itemId: f.provider.id,
      name:
        f.provider.businessName ||
        `${f.provider.firstName} ${f.provider.lastName}`,
      image: f.provider.photo,
    })),
  ];

  const favoriteCount = allFavorites.length;

  const isFavorite = (
    type: "service" | "product" | "provider",
    itemId: string
  ) => {
    return allFavorites.some((f) => f.type === type && f.itemId === itemId);
  };

  const toggleFavorite = async (
    type: "service" | "product" | "provider",
    itemId: string
    // name?: string,
    // price?: number,
    // image?: string
  ) => {
    console.log("This is the Item Id", itemId);
    setIsLoading(true);
    try {
      const currentlyFavorite = isFavorite(type, itemId);
      console.log(currentlyFavorite);
      if (currentlyFavorite) {
        switch (type) {
          case "service":
            await removeServiceMutation.mutateAsync(itemId);
            break;
          case "product":
            await removeProductMutation.mutateAsync(itemId);
            break;
          case "provider":
            await removeProviderMutation.mutateAsync(itemId);
            break;
        }
      } else {
        switch (type) {
          case "service":
            await addServiceMutation.mutateAsync(itemId);
            break;
          case "product":
            await addProductMutation.mutateAsync(itemId);
            break;
          case "provider":
            await addProviderMutation.mutateAsync(itemId);
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites: allFavorites,
        favoriteCount,
        isFavorite,
        toggleFavorite,
        isLoading,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
}
