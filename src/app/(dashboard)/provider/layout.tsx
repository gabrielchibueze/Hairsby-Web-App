"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth.context"
import { ProviderSidebar } from "@/components/provider/provider-sidebar"
import { ProviderNav } from "@/components/provider/provider-nav"

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !['specialist', 'business'].includes(user.role))) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !['specialist', 'business'].includes(user.role)) {
      router.push("/login")    
  }

  return (
    <div className="flex min-h-screen">
      <ProviderSidebar />
      <div className="flex-1">
        <ProviderNav />
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  )
}