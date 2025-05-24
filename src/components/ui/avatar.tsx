// components/ui/avatar.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  alt?: string;
  fallback?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
      xxl: "h-24 w-24 text-xl",
    };

    // More flexible source validation
    const hasValidImage =
      src && typeof src === "string" && src.trim().length > 0;

    return (
      <span
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizes[size],
          className
        )}
        {...props}
      >
        {hasValidImage ? (
          <Image
            src={src}
            alt={alt || "Avatar"}
            fill
            className="aspect-square h-full w-full object-cover"
            unoptimized={src.startsWith("http")}
            onError={(e) => {
              // If image fails to load, it will automatically show the fallback
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        {/* Fallback shown when no image or image fails to load */}
        <div
          className={cn(
            `flex h-full w-full items-center justify-center rounded-full bg-foreground text-background `,
            className
          )}
        >
          {fallback}
        </div>
      </span>
    );
  }
);
Avatar.displayName = "Avatar";
export { Avatar };
// Usage example:
{
  /* <Avatar 
  src={review.customer.photo} 
  alt={`${review.customer.firstName} ${review.customer.lastName}`}
  fallback={
    <>
      {review.customer.firstName?.charAt(0)}
      {review.customer.lastName?.charAt(0)}
    </>
  }
/> */
}
