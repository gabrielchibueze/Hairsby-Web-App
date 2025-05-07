"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingList } from "@/components/booking/booking-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Breadcrumb from "@/components/general/breadcrumb";

export default function BookingsComponent() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "My Bookings" },
        ]}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
          <Link href="/services">Book a Service</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <BookingList status="confirmed" />
        </TabsContent>
        <TabsContent value="pending">
          <BookingList status="pending" />
        </TabsContent>
        <TabsContent value="past">
          <BookingList status="completed" />
        </TabsContent>
        <TabsContent value="cancelled">
          <BookingList status="cancelled" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
