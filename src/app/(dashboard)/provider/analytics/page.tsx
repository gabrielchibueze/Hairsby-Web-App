// app/(provider)/analytics/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, History, Repeat } from "lucide-react";
import { Payouts } from "./components/payouts";
import { Transactions } from "./components/transactions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import EarningsOverview from "./components/revenue";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

export default function ProviderFinancialsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("revenue");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;
  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("revenue");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View your reports, manage your earnings, payouts and transactions
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setPathActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="revenue">
              <DollarSign className="mr-2 h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="payouts">
              <CreditCard className="mr-2 h-4 w-4" />
              Payouts
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <History className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            <EarningsOverview />
          </TabsContent>
          <TabsContent value="payouts" className="mt-6">
            <Payouts />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <Transactions />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
