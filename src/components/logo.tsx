"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: number;
  height?: number;
  type?: string;
}

export function HairsbyLogo({
  className,
  width = 120,
  height = 32,
  type,
}: LogoProps) {
  if (type === "white") {
    return (
      <Link href="/" className={cn("flex items-center", className)}>
        <Image
          src="/hairsby-logo-white.svg"
          alt="Hairsby Logo"
          width={width}
          height={height}
          priority
        />
      </Link>
    );
  }
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/hairsby-logo.svg"
        alt="Hairsby Logo"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}

export function HairsbyIcon({ className, width = 32, height = 32 }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/hairsby-icon.svg"
        alt="Hairsby Icon"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
