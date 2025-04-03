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
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "@/lib/api/cart/cart";
import { toast } from "@/components/ui/use-toast";

type CartItem = {
  id: string;
  type: "service" | "product";
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  duration?: number;
};

type Cart = {
  items: CartItem[];
  total: number;
};

type CartContextType = {
  cart: Cart;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: cart = { items: [], total: 0 } } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const addMutation = useMutation({
    mutationFn: (item: Omit<CartItem, "id">) =>
      apiAddToCart(item.type, item.itemId, item.quantity),
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

  const addItem = (item: Omit<CartItem, "id">) => {
    addMutation.mutate(item);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    updateMutation.mutate({ itemId, quantity });
  };

  const removeItem = (itemId: string) => {
    removeMutation.mutate(itemId);
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
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
