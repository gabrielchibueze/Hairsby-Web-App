import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {
    if (!decorative) {
      return (
        <hr
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          className={cn(
            "shrink-0 border-0 bg-border",
            orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        role="presentation"
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
