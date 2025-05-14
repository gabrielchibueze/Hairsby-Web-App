"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex h-12 items-center gap-5 rounded-lg bg-gray-50 p-1",
      "overflow-x-auto w-full whitespace-nowrap",
      "scroll-smooth snap-x snap-mandatory", // Smooth scrolling and snap points
      "[&::-webkit-scrollbar]:hidden", // Hide scrollbar but keep functionality
      "scrollbar-hide", // For browsers that support it
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "snap-start", // Ensures tabs snap into place when scrolling
      "inline-flex flex-shrink-0 items-center justify-center",
      "rounded-lg px-4 py-2.5 text-sm font-medium",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hairsby-orange/50",
      "data-[state=active]:text-hairsby-dark data-[state=inactive]:text-hairsby-dark/60",
      "data-[state=inactive]:hover:text-hairsby-dark/80",
      "group relative overflow-hidden", // For the hover effect
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
      "animate-in fade-in duration-200", // Smooth fade-in
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
