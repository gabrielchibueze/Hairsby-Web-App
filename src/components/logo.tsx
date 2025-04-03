// components/logo.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function HairsbyLogo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <img src="hairsby-logo.svg" alt="Hairsby Logo" className="h-8" />
    </Link>
  );
}

export function HairsbyIcon({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      {/* Replace with your actual logo SVG or image */}
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 2v4" />
        <path d="m16.24 7.76 2.83-2.83" />
        <path d="M18 12h4" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="M12 18v4" />
        <path d="m7.76 16.24-2.83 2.83" />
        <path d="M6 12H2" />
        <path d="m7.76 7.76-2.83-2.83" />
      </svg>
      <span className="inline-block font-bold">Hairsby</span> */}

      <img src="hairsby-icon.svg" alt="Hairsby Icon" className="h-8" />
    </Link>
  );
}
