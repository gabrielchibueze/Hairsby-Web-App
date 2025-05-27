"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  Cart,
  CartItem,
  CartServiceItem,
  CartProductItem,
} from "@/lib/api/cart/cart";
import { toast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/contexts/auth.context";
import { usePathname } from "next/navigation";

interface GroupedCartItems {
  [key: string]: {
    providerId: string;
    providerName: string;
    services: CartServiceItem[];
    products: CartProductItem[];
    subtotal: number;
  };
}

type AddToCartInput = Omit<CartServiceItem, "id"> | Omit<CartProductItem, "id">;

type CartContextType = {
  cart: Cart;
  addToCart: (item: AddToCartInput) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartAmount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: cartData = { items: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const cart = useMemo(() => {
    if (!cartData.items) return { ...cartData, groupedByProvider: [] };

    const grouped = cartData.items.reduce<GroupedCartItems>((acc, item) => {
      const providerId = item?.provider?.id;
      const providerName = item.provider?.name;

      if (providerId && !acc[providerId] && providerName) {
        acc[providerId] = {
          providerId,
          providerName,
          services: [],
          products: [],
          subtotal: 0,
        };
      }
      if (item.price && providerId) {
        if (item.type === "service") {
          acc[providerId].services.push(item as CartServiceItem);
          acc[providerId].subtotal += item?.price * item.quantity;
        } else {
          acc[providerId].products.push(item as CartProductItem);
          acc[providerId].subtotal += item?.price * item.quantity;
        }
      }
      return acc;
    }, {});

    return {
      ...cartData,
      groupedByProvider: Object.values(grouped),
    };
  }, [cartData]);

  const addMutation = useMutation({
    mutationFn: (item: AddToCartInput) =>
      apiAddToCart(
        item.type,
        item.type === "service"
          ? (item as Omit<CartServiceItem, "id">).serviceId
          : (item as Omit<CartProductItem, "id">).productId,
        item.quantity
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your shopping cart",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiUpdateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart item",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => apiRemoveFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your shopping cart",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart",
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => apiClearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Cart cleared",
        description: "Your shopping cart has been cleared",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart",
      });
    },
  });

  const addToCart = (item: AddToCartInput) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        variant: "default",
        description: "You need to be signed in to add to cart",
        action: (
          <Button
            asChild
            variant="outline"
            className="border-hairsby-orange text-hairsby-orange"
          >
            <a href={`/login?redirect=${encodeURIComponent(pathname)}`}>
              Sign In
            </a>
          </Button>
        ),
      });
      return;
    } else {
      addMutation.mutate(item);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    updateMutation.mutate({ itemId, quantity });
  };

  const removeFromCart = (itemId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        variant: "default",
        description: "You need to be signed in to add to cart",
        action: (
          <Button
            asChild
            variant="outline"
            className="border-hairsby-orange text-hairsby-orange"
          >
            <a href={`/login?redirect=${encodeURIComponent(pathname)}`}>
              Sign In
            </a>
          </Button>
        ),
      });
      return;
    } else {
      removeMutation.mutate(itemId);
    }
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartAmount = cart.items.reduce(
    (sum, item) => sum + (item.price ? item.quantity * item.price : 0),
    0
  );
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartAmount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
