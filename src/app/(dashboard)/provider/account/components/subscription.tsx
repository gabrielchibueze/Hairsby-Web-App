// app/(provider)/financials/components/subscription.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCurrentSubscription,
  getSubscriptionPlans,
  SubscriptionPlan,
} from "@/lib/api/financials/subscription";
import { PlanComparisonDialog } from "./plan-comparision-dialog";
import { formatCurrency } from "@/lib/utils";
import { UpgradeDialog } from "./upgrade-dialog";

export function Subscription() {
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["provider-subscription"],
    queryFn: getCurrentSubscription,
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: getSubscriptionPlans,
  });

  if (subscriptionLoading || plansLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  const currentPlan = subscription?.plan as SubscriptionPlan;
  const otherPlans =
    plans?.filter((plan: SubscriptionPlan) => plan.id !== currentPlan?.id) ||
    [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPlan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                  <p className="text-muted-foreground">
                    {currentPlan.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {subscription.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-8 text-sm">
                <div className="mr-4">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-sm font-semibold">
                    <span>
                      {formatCurrency(
                        currentPlan.price,
                        currentPlan?.currency!
                      )}
                    </span>
                    /<span>{currentPlan.interval}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billing</p>
                  <p className="text-sm font-semibold">
                    {currentPlan.interval === "month" ? "Monthly" : "Yearly"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold">
                    {subscription.status === "active" ||
                    subscription.id === "free"
                      ? "Active"
                      : subscription.status === "cancelled"
                        ? "Cancelled"
                        : "Inactive"}
                  </p>
                </div>
              </div>

              {subscription.currentPeriodEnd && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {subscription.status === "cancelled"
                      ? "Access ends on"
                      : "Next billing date"}
                  </p>
                  <p className="text-sm">
                    {new Date(
                      subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <PlanComparisonDialog
                  plans={plans}
                  currentPlanId={currentPlan.id}
                >
                  <Button variant="outline">Compare Plans</Button>
                </PlanComparisonDialog>

                {currentPlan.price >= 0 && (
                  <UpgradeDialog plans={otherPlans}>
                    <Button variant="brand">Change Plan</Button>
                  </UpgradeDialog>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>No active subscription found</p>
              <UpgradeDialog plans={plans}>
                <Button variant="brand">Subscribe Now</Button>
              </UpgradeDialog>
            </div>
          )}
        </CardContent>
      </Card>

      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPlan.features?.map(
                (feature: SubscriptionPlan["features"], index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-hairsby-orange">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm">{feature}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
