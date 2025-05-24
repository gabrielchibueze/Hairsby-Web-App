"use client";

import { useState, useEffect, Suspense } from "react";
import { CreditCard, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethods } from "@/components/profile/payment-methods";
import Breadcrumb from "@/components/general/breadcrumb";
import SettingsComponent from "./settings";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/general/spinner";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const target = searchParams.get("target");
  const [activeTab, setActiveTab] = useState(target || "settings");

  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your settings and payment methods, and preferences
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex justify-start gap-8 sm:justify-start">
            <TabsTrigger value="settings">
              <Gift className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SettingsComponent />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentMethods source={source} />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
