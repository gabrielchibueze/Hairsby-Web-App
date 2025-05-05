// components/layout/auth-layout.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { HairsbyIcon } from "@/components/logo";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  return (
    <div
      className={`min-h-fit bg-white flex items-center justify-center p-6 md:p-8 ${pathname.startsWith("/signup") ? "py-16" : "py-36"}`}
    >
      <div
        className={`w-full flex flex-col items-center ${pathname.startsWith("/signup") ? "" : "py-16"}`}
      >
        {/* Logo/Branding at the top */}
        {/* <div className="mb-6 text-center">
          <Link href="/" className="inline-block">
            <HairsbyIcon className="h-10 w-auto text-white" />
          </Link>
        </div> */}

        <div
          className={cn(
            "bg-white rounded-xl shadow-sm overflow-hidden",
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
        <div className="mt-6 text-center text-sm text-gray-800">
          <p>
            By continuing, you agree to our{" "}
            <Link
              href="/terms-conditions"
              className="underline hover:text-gray-400"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-gray-400"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
