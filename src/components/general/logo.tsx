"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: number;
  height?: number;
  type?: string;
  withLink?: boolean;
}

export function HairsbyLogo({
  className,
  width = 120,
  height = 32,
  type,
  withLink = true,
}: LogoProps) {
  if (type === "white") {
    return (
      <a href="/" className={cn("flex items-center", className)}>
        <Image
          src="/hairsby-logo-white.svg"
          alt="Hairsby Logo"
          width={width}
          height={height}
          priority
        />
      </a>
    );
  }
  return (
    <a href="/" className={cn("flex items-center", className)}>
      <Image
        src="/hairsby-logo.svg"
        alt="Hairsby Logo"
        width={width}
        height={height}
        priority
      />
    </a>
  );
}

export function HairsbyIcon({
  withLink = true,
  className,
  width = 32,
  height = 32,
}: LogoProps) {
  return (
    <>
      {withLink ? (
        <a href="/" className={cn("flex items-center", className)}>
          <Image
            src="/hairsby-icon.svg"
            alt="Hairsby icon"
            width={width}
            height={height}
            priority
          />
        </a>
      ) : (
        <Image
          src="/hairsby-icon.svg"
          alt="Hairsby icon"
          width={width}
          height={height}
          priority
        />
      )}
    </>
  );
}
