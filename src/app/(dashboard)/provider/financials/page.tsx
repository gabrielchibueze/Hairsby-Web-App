// app/(provider)/financials/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, History, Repeat } from "lucide-react";
import { EarningsOverview } from "./components/earnings-overview";
import { Payouts } from "./components/payouts";
import { Subscription } from "./components/subscription";
import { Transactions } from "./components/transactions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Spinner from "@/components/general/spinner";

export default function ProviderFinancialsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("earnings");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;
  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("earnings");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };
  return (
    <Suspense>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground">
            Manage your earnings, payouts, and subscriptions
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setPathActiveTab}
          className="w-full"
        >
          <TabsList className="sm:grid sm:w-full sm:grid-cols-6">
            <TabsTrigger value="earnings">
              <DollarSign className="mr-2 h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="payouts">
              <CreditCard className="mr-2 h-4 w-4" />
              Payouts
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <Repeat className="mr-2 h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <History className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="mt-6">
            <EarningsOverview />
          </TabsContent>
          <TabsContent value="payouts" className="mt-6">
            <Payouts />
          </TabsContent>
          <TabsContent value="subscription" className="mt-6">
            <Subscription />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <Transactions />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
