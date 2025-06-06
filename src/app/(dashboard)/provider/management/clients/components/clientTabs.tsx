"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Client } from "@/lib/api/accounts/clients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Order } from "@/lib/api/products/order";
import { Booking } from "@/lib/api/services/booking";
import Spinner from "@/components/general/spinner";
import { ClientStats } from "./catalogs/clientStats";
import { ClientBookings } from "./catalogs/clientBookings";
import { ClientOrders } from "./catalogs/clientOrders";
import { ClientNotes } from "./catalogs/clientNotes";
import { ViewMode } from "../[id]/page";

export interface ClientTabsProps {
  client: Client;
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

export function ClientTabs({
  client,
  isLoading,
  modeAndCreateFunction,
}: ClientTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("stats");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("stats");
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
        <TabsList className="sm:grid sm:w-full sm:grid-cols-4">
          <TabsTrigger value="stats">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <ClientStats client={client} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="bookings">
          <ClientBookings
            client={client}
            isLoading={isLoading}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="orders">
          <ClientOrders
            client={client}
            isLoading={isLoading}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="notes">
          <ClientNotes client={client} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
