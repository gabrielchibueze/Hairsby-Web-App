// "use client";

// import * as React from "react";
// import * as TabsPrimitive from "@radix-ui/react-tabs";
// import { cn } from "@/lib/utils";

// const Tabs = TabsPrimitive.Root;

// const TabsList = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.List>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
// >(({ className, ...props }, forwardedRef) => {
//   const internalRef = React.useRef<HTMLDivElement>(null);

//   // Combine forwarded ref and internal ref
//   React.useImperativeHandle(forwardedRef, () => internalRef.current!, []);

//   // Scroll active tab into view when it changes
//   React.useEffect(() => {
//     if (internalRef.current) {
//       const activeTab = internalRef.current.querySelector(
//         '[data-state="active"]'
//       );
//       if (activeTab) {
//         activeTab.scrollIntoView({
//           behavior: "smooth",
//           block: "nearest",
//           inline: "center",
//         });
//       }
//     }
//   }, [props.children]);

//   return (
//     <TabsPrimitive.List
//       ref={internalRef}
//       className={cn(
//         "flex h-10 items-center gap-5 rounded-lg bg-muted p-0",
//         "overflow-x-auto w-full whitespace-nowrap",
//         "scroll-smooth snap-x snap-mandatory",
//         "[&::-webkit-scrollbar]:hidden",
//         "scrollbar-hide",
//         className
//       )}
//       {...props}
//     />
//   );
// });
// TabsList.displayName = TabsPrimitive.List.displayName;

// const TabsTrigger = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Trigger>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Trigger
//     ref={ref}
//     className={cn(
//       "snap-start",
//       "inline-flex flex-shrink-0 items-center justify-center",
//       "rounded-lg px-4 py-2.5 text-sm font-medium",
//       "transition-all duration-200 ease-out",
//       "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hairsby-orange/40",
//       "data-[state=active]:bg-foreground/80 data-[state=inactive]:bg-foreground/60",
//       "data-[state=inactive]:hover:bg-foreground/80",
//       "group relative overflow-hidden",
//       className
//     )}
//     {...props}
//   >
//     <span className="relative z-10 flex items-center gap-2">
//       {props.children}
//     </span>
//     <span className="absolute inset-0 z-0 rounded-lg bg-hairsby-orange/0 transition-all duration-300 group-data-[state=active]:bg-hairsby-orange/10 group-hover:bg-hairsby-orange/5" />
//     <span className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 bg-hairsby-orange transition-transform duration-300 group-data-[state=active]:scale-x-100" />
//   </TabsPrimitive.Trigger>
// ));
// TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// const TabsContent = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Content
//     ref={ref}
//     className={cn(
//       "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hairsby-orange/50",
//       "animate-in fade-in duration-200",
//       className
//     )}
//     {...props}
//   />
// ));
// TabsContent.displayName = TabsPrimitive.Content.displayName;

// export { Tabs, TabsList, TabsTrigger, TabsContent };

"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, forwardedRef) => {
  const internalRef = React.useRef<HTMLDivElement>(null);

  // Combine forwarded ref and internal ref
  React.useImperativeHandle(forwardedRef, () => internalRef.current!, []);

  // Scroll active tab into view when it changes
  React.useEffect(() => {
    if (internalRef.current) {
      const activeTab = internalRef.current.querySelector(
        '[data-state="active"]'
      );
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [props.children]);

  return (
    <TabsPrimitive.List
      ref={internalRef}
      className={cn(
        "flex h-10 items-center gap-5 rounded-lg  p-0",
        "overflow-x-auto w-full whitespace-nowrap",
        "scroll-smooth snap-x snap-mandatory",
        "[&::-webkit-scrollbar]:hidden",
        "scrollbar-hide",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "snap-start",
      "inline-flex flex-shrink-0 items-center justify-center border-border border-[1px]",
      "rounded-3xl px-4 py-2 text-sm font-medium",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hairsby-orange/40",
      "data-[state=active]:bg-foreground/80 data-[state=inactive]:bg-foreground/60",
      "data-[state=inactive]:hover:bg-foreground/80",
      "group relative overflow-hidden",
      className
    )}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2">
      {props.children}
    </span>
    <span className="absolute inset-0 z-0 rounded-lg bg-hairsby-orange/0 transition-all duration-300 group-data-[state=active]:bg-hairsby-orange/10 group-hover:bg-hairsby-orange/5" />
    <span className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 bg-hairsby-orange transition-transform duration-300 group-data-[state=active]:scale-x-100" />
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hairsby-orange/50",
      "animate-in fade-in duration-200",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
