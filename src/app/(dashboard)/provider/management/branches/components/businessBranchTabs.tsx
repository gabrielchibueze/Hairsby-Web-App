// @/app/provider/management/branches/components/businessBranchTabs.tsx

import React, { Suspense, useEffect, useState } from "react";
import { BusinessBranch } from "@/lib/api/accounts/company";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Order } from "@/lib/api/products/order";
import { Booking } from "@/lib/api/services/booking";
import { Target } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth.context";
import { ViewMode } from "./businessBranchDetailsComponent";
import { BusinessBranchServices } from "./catalogs/businessBranchServices";
import { BusinessBranchProducts } from "./catalogs/businessBranchProducts";
import { BusinessBranchBookings } from "./catalogs/businessBranchBookings";
import { BusinessBranchOrders } from "./catalogs/businessBranchOrders";
import { ScheduleSettings } from "../../../account/components/schedule-settings";
import { BusinessBranchSettings } from "./businessBranchSettings";

export interface BranchTabsProps {
  businessBranch: BusinessBranch;
  isLoading: boolean;
  modeAndCreateFunction: ({
    mode,
    order,
    booking,
  }: {
    mode: ViewMode;
    order?: Order;
    booking?: Booking;
  }) => void;
}

export function BusinessBranchTabs({
  businessBranch,
  isLoading,
  modeAndCreateFunction,
}: BranchTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("services");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("services");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };

  return (
    <Suspense>
      <Tabs
        value={activeTab}
        onValueChange={setPathActiveTab}
        className="w-full"
      >
        <TabsList className="sm:grid sm:w-full sm:grid-cols-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {businessBranch.status !== "suspended" && (
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          )}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <BusinessBranchServices
            isLoading={isLoading}
            businessBranch={businessBranch}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="products">
          <BusinessBranchProducts
            isLoading={isLoading}
            businessBranch={businessBranch}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="bookings">
          <BusinessBranchBookings
            isLoading={isLoading}
            businessBranch={businessBranch}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="orders">
          <BusinessBranchOrders
            isLoading={isLoading}
            businessBranch={businessBranch}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        {businessBranch.status !== "suspended" && (
          <TabsContent value="schedule">
            <ScheduleSettings
              title="Manage Schedule"
              message={`Set working hours and availability for ${businessBranch.branchName}`}
              employeeSchedule={businessBranch.branch.schedule}
            />
          </TabsContent>
        )}
        <TabsContent value="settings">
          <BusinessBranchSettings
            isLoading={isLoading}
            businessBranch={businessBranch}
          />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
