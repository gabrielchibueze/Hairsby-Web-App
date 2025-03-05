"use client"

import { ThemeProvider } from "next-themes"
import { Provider as ReduxProvider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { store } from "@/lib/store"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/contexts/auth.context"
import { CartProvider } from "@/components/cart/cart-provider"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}