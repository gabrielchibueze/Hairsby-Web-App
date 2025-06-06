import React, { Suspense, useEffect, useState } from "react";
import { BusinessEmployee } from "@/lib/api/accounts/business";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Order } from "@/lib/api/products/order";
import { Booking } from "@/lib/api/services/booking";
import { Target } from "lucide-react";
import Spinner from "@/components/general/spinner";
import { BusinessEmployeeServices } from "./catalogs/businessEmployeeServices";
import { BusinessEmployeeProducts } from "./catalogs/businessEmployeeProducts";
import { BusinessEmployeeBookings } from "./catalogs/businessEmployeeBookings";
import { BusinessEmployeeOrders } from "./catalogs/businessEmployeeOrders";
import { BusinessEmployeeSettings } from "./businessEmployeeSettings";
import { useAuth } from "@/lib/contexts/auth.context";
import { ViewMode } from "./businessEmployeeDetailsComponent";
import { ScheduleSettings } from "../../account/components/schedule-settings";

export interface EmployeeTabsProps {
  businessEmployee: BusinessEmployee;
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

export function BusinessEmployeeTabs({
  businessEmployee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isBusiness = user?.role === "business";
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
          {/* {isBusiness && */}
          {businessEmployee.employmentStatus !== "terminated" && (
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          )}
          {/* } */}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <BusinessEmployeeServices
            isLoading={isLoading}
            businessEmployee={businessEmployee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="products">
          <BusinessEmployeeProducts
            isLoading={isLoading}
            businessEmployee={businessEmployee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="bookings">
          <BusinessEmployeeBookings
            isLoading={isLoading}
            businessEmployee={businessEmployee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        <TabsContent value="orders">
          <BusinessEmployeeOrders
            isLoading={isLoading}
            businessEmployee={businessEmployee}
            modeAndCreateFunction={modeAndCreateFunction}
          />
        </TabsContent>
        {/* {isBusiness && ( */}
        {businessEmployee.employmentStatus !== "terminated" && (
          <TabsContent value="schedule">
            <ScheduleSettings
              title="Manage Schedule"
              message={
                isBusiness
                  ? `Set working hours and availability for ${businessEmployee.employee.firstName} ${businessEmployee.employee.lastName}`
                  : "Manage your work schedule and availability"
              }
              employeeSchedule={businessEmployee.employee.schedule}
            />
          </TabsContent>
        )}
        {/* )} */}
        <TabsContent value="settings">
          <BusinessEmployeeSettings
            isLoading={isLoading}
            businessEmployee={businessEmployee}
          />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
