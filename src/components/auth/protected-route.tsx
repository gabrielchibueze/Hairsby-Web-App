"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth.context"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("customer" | "specialist" | "business" | "admin")[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${pathname}`)
      return
    }

    if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized")
      return
    }
  }, [user, isLoading, router, pathname, allowedRoles])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}