// components/provider/management/specialists/EmployeeTabs.tsx
import React, { Suspense, useEffect, useState } from "react";
import { BusinessEmployee } from "@/lib/api/accounts/business";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { EmployeeServices } from "./employeeServices";
import { EmployeeProducts } from "./employeeProducts";
import { EmployeeBookings } from "./employeeBookings";
import { EmployeeOrders } from "./employeeOrders";
import { ScheduleSettings } from "../../../settings/components/schedule-settings";
import { Order } from "@/lib/api/products/order";
import { Booking } from "@/lib/api/services/booking";
import { ViewMode } from "../[id]/page";
import { Target } from "lucide-react";
import { EmployeeSettings } from "./employeeSettings";
import Spinner from "@/components/general/spinner";

export interface EmployeeTabsProps {
  employee: BusinessEmployee;
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

export function EmployeeTabs({
  employee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("services");

  const searchParams = useSearchParams();
  const target = searchParams.get("target") as string;
  useEffect(() => {
    setActiveTab(target);
  }, [target]);
  console.log(target);
  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="sm:grid sm:w-full sm:grid-cols-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <EmployeeServices
            isLoading={isLoading}
            employee={employee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="products">
          <EmployeeProducts
            isLoading={isLoading}
            employee={employee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="bookings">
          <EmployeeBookings
            isLoading={isLoading}
            employee={employee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="orders">
          <EmployeeOrders
            isLoading={isLoading}
            employee={employee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="schedule">
          <ScheduleSettings
            title="Manage Schedule"
            message={`Set working hours and availability for ${employee.employee.firstName} 
          ${employee.employee.lastName}`}
            employeeSchedule={employee.employee.schedule}
          />
        </TabsContent>
        <TabsContent value="settings">
          <EmployeeSettings isLoading={isLoading} employee={employee} />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
