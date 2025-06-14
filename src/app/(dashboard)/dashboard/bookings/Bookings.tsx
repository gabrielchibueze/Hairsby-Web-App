// "use client";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { BookingList } from "@/components/booking/booking-list";
// import { Button } from "@/components/ui/button";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useState } from "react";

// export default function BookingsComponent() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<string>("upcoming");

//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const target = searchParams.get("t") as string;
//   useEffect(() => {
//     if (target) {
//       setPathActiveTab(target);
//     } else {
//       setPathActiveTab("upcoming");
//     }
//   }, [target]);

//   const setPathActiveTab = (path: string) => {
//     setActiveTab(path);
//     router.push(`${pathname}?t=${path}`);
//   };
//   return (
//     <Suspense>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">My Bookings</h1>
//           <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
//             <a href="/services">Book a Service</a>
//           </Button>
//         </div>

//         <Tabs value={activeTab} onValueChange={setPathActiveTab}>
//           <TabsList>
//             <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//             <TabsTrigger value="pending">Pending</TabsTrigger>
//             <TabsTrigger value="past">Past</TabsTrigger>
//             <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
//           </TabsList>
//           <TabsContent value="upcoming">
//             <BookingList status="confirmed" />
//           </TabsContent>
//           <TabsContent value="pending">
//             <BookingList status="pending" />
//           </TabsContent>
//           <TabsContent value="past">
//             <BookingList status="completed" />
//           </TabsContent>
//           <TabsContent value="cancelled">
//             <BookingList status="cancelled" />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </Suspense>
//   );
// }

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingList } from "@/components/booking/booking-list";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/lib/api/services/booking";
import { Booking } from "@/lib/api/services/booking";

export default function BookingsComponent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;

  // Fetch all bookings at once
  const { data: allBookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("upcoming");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };

  // Filter bookings by status on the frontend
  const getFilteredBookings = (tab: string) => {
    if (!allBookings) return [];

    switch (tab) {
      case "upcoming":
        return allBookings.filter(
          (booking: Booking) => booking.status === "confirmed"
        );
      case "pending":
        return allBookings.filter(
          (booking: Booking) => booking.status === "pending"
        );
      case "past":
        return allBookings.filter(
          (booking: Booking) => booking.status === "completed"
        );
      case "cancelled":
        return allBookings.filter(
          (booking: Booking) => booking.status === "cancelled"
        );
      default:
        return [];
    }
  };

  return (
    <Suspense>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <Button variant="brand">
            <a href="/services">Book a Service</a>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setPathActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <BookingList
              bookings={getFilteredBookings("upcoming")}
              status="confirmed"
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="pending">
            <BookingList
              bookings={getFilteredBookings("pending")}
              status="pending"
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="past">
            <BookingList
              bookings={getFilteredBookings("past")}
              status="completed"
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="cancelled">
            <BookingList
              bookings={getFilteredBookings("cancelled")}
              status="cancelled"
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
