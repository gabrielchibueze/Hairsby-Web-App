// components/layout/auth-layout.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode, Suspense, useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/contexts/auth.context";
import { HairsbyIcon } from "../general/logo";
import Spinner from "../general/spinner";

export function AuthLayout({
  title,
  subtitle,
  children,
  className,
  caption,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  caption?: string;
}) {
  const pathname = usePathname();
  const { setTheme, theme, themes } = useTheme();
  const { user, isLoading } = useAuth();

  console.log(themes);
  useEffect(() => {
    if (theme === "light") setTheme("dark");
  }, []);
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0a0e17]">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-hairsby-orange"></div>
        <div className="absolute">
          <HairsbyIcon />
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Left Sidebar - Fixed on large screens */}
        <aside className="bg-gray-100 border-r border-gray-200 p-6 md:w-64 lg:w-80 flex flex-col justify-between md:fixed h-full">
          <div className="space-y-8">
            {/* Back Navigation - Left aligned on large screens */}
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 flex items-center text-sm md:justify-start"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Return to Hairsby
            </Link>

            {/* Brand Logo - Left aligned on large screens */}
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <div className="bg-hairsby-orange rounded-full w-8 h-8 border border-b-2 flex justify-center items-center">
                <Image
                  src="/hairsby-icon-white.png"
                  alt="Hairsby icon"
                  width={20}
                  height={20}
                  priority
                />
              </div>
              <h2 className="font-semibold">Hairsby</h2>
            </div>

            {/* Stripe Partnership Notice - Bigger and uppercase on large screens */}
            <p className="text-xs font-medium text-gray-600 md:text-sm lg:text-base lg:uppercase md:font-bold  text-center md:text-left">
              {caption || " Hairsby partners with Stripe for secure payments."}
            </p>
          </div>

          {/* Footer Links - Desktop Only - Vertical and left aligned */}
          <div className="hidden md:block space-y-2 text-xs text-gray-500 text-left">
            <div className="flex flex-col space-y-1">
              <Link href="/terms-condition" className="hover:text-gray-700">
                Terms
              </Link>
              <Link href="/privacy-policy" className="hover:text-gray-700">
                Privacy
              </Link>
            </div>
            <p className="mt-2">
              Powered by <span className="font-medium">Hairsby</span>
            </p>
          </div>
        </aside>

        {/* Main Content Area - Offset for fixed sidebar */}
        <main className="flex-1 flex items-center justify-center p-6 md:ml-64 lg:ml-80">
          <div
            className={cn(
              "w-full max-w-md bg-white p-8 sm:p-10 rounded-lg shadow-sm",
              className
            )}
          >
            {/* Form Header */}
            {(title || subtitle) && (
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Form Content */}
            <div className="space-y-6">{children}</div>

            {/* Footer Links - Mobile Only */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 md:hidden">
              <div className="flex justify-center space-x-4 mb-2">
                <Link href="/terms-conditions" className="hover:text-gray-700">
                  Terms
                </Link>
                <Link href="/privacy-policy" className="hover:text-gray-700">
                  Privacy
                </Link>
              </div>
              <p>
                Powered by <span className="font-medium">Hairsby</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  );
}
