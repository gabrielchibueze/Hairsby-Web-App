"use client"

import { createContext, useContext, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, type Cart } from "@/lib/api/cart"
import { useToast } from "@/components/ui/use-toast"

interface CartContextType {
  cart: Cart | undefined
  isLoading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clear: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart
  })

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string, quantity?: number }) =>
      addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string, quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart"
      })
    }
  })

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      })
    }
  })

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart"
      })
    }
  })

  const addItem = async (productId: string, quantity?: number) => {
    await addMutation.mutateAsync({ productId, quantity })
  }

  const updateItem = async (itemId: string, quantity: number) => {
    await updateMutation.mutateAsync({ itemId, quantity })
  }

  const removeItem = async (itemId: string) => {
    await removeMutation.mutateAsync(itemId)
  }

  const clear = async () => {
    await clearMutation.mutateAsync()
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clear
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}