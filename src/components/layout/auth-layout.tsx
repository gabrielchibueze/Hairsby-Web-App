// components/layout/auth-layout.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { HairsbyIcon } from "@/components/logo";

export function AuthLayout({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-hairsby-dark flex items-center justify-center p-8 md:p-8">
      <div className="w-full flex flex-col items-center">
        {/* Logo/Branding at the top */}
        {/* <div className="mb-6 text-center">
          <Link href="/" className="inline-block">
            <HairsbyIcon className="h-10 w-auto text-white" />
          </Link>
        </div> */}

        <div
          className={cn(
            "bg-white rounded-2xl shadow-xl overflow-hidden",
            className // This is where you pass your width classes (e.g., "w-full max-w-md")
          )}
        >
          <div className="bg-hairsby-orange p-5 text-center">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="text-white/90 text-sm mt-2">{subtitle}</p>
            )}
          </div>

          <div className={cn("p-6 sm:p-8 space-y-6")}>{children}</div>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-white/80">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
