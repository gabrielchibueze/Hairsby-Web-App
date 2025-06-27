"use client";

import { useState, useEffect, Suspense } from "react";
import { Gift, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethods } from "@/components/profile/payment-methods";
import SettingsComponent from "./settings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/general/spinner";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("settings");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;
  const source = searchParams.get("s") as string;

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("settings");
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
          <h1 className="text-3xl font-bold tracking-tight">
            My Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your settings and payment methods, and preferences
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setPathActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex justify-start gap-8 sm:justify-start">
            <TabsTrigger value="settings">
              <Gift className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Settings className="mr-2 h-4 w-4" />
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
