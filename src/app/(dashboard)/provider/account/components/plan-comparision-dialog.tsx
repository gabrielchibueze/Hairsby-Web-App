// app/(provider)/financials/components/plan-comparison-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionPlan } from "@/lib/api/financials/subscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PlanComparisonDialog({
  plans,
  currentPlanId,
  children,
}: {
  plans: SubscriptionPlan[];
  currentPlanId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const currentPlan = plans.find((plan) => plan.id === currentPlanId);
  const otherPlans = plans.filter((plan) => plan.id !== currentPlanId);

  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.features))
  );

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[725px] sm:mx-0">
          <DialogHeader>
            <DialogTitle>Compare Subscription Plans</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[500px]">
            <div className="relative">
              {/* Horizontal scroll container for mobile */}
              <ScrollArea orientation="horizontal" className="sm:hidden pb-4">
                <div className="max-[450px]:w-[350px] min-[451px]:w-[400px] max-[700px]:w-auto">
                  {" "}
                  {/* Force wider container on mobile */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead className="text-center">
                          {currentPlan?.name}
                          <Badge variant="outline" className="ml-2">
                            Current
                          </Badge>
                        </TableHead>
                        {otherPlans.map((plan) => (
                          <TableHead key={plan.id} className="text-center">
                            {plan.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allFeatures.map((feature) => (
                        <TableRow key={feature}>
                          <TableCell className="font-medium sticky left-0 bg-background z-10">
                            {feature}
                          </TableCell>
                          <TableCell className="text-center">
                            {currentPlan?.features.includes(feature)
                              ? "✓"
                              : "✗"}
                          </TableCell>
                          {otherPlans.map((plan) => (
                            <TableCell key={plan.id} className="text-center">
                              {plan.features.includes(feature) ? "✓" : "✗"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>

              {/* Regular table for desktop */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead className="text-center">
                        {currentPlan?.name}
                        <Badge variant="outline" className="ml-2">
                          Current
                        </Badge>
                      </TableHead>
                      {otherPlans.map((plan) => (
                        <TableHead key={plan.id} className="text-center">
                          {plan.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allFeatures.map((feature) => (
                      <TableRow key={feature}>
                        <TableCell className="font-medium">{feature}</TableCell>
                        <TableCell className="text-center">
                          {currentPlan?.features.includes(feature) ? "✓" : "✗"}
                        </TableCell>
                        {otherPlans.map((plan) => (
                          <TableCell key={plan.id} className="text-center">
                            {plan.features.includes(feature) ? "✓" : "✗"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
