// app/(provider)/settings/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Clock, Image, Building } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth.context";
import { ProfileSettings } from "./components/profile-settings";
import { PaymentSettings } from "./components/payment-settings";
import { ScheduleSettings } from "./components/schedule-settings";
import { GallerySettings } from "./components/gallery-settings";
import { BusinessSettings } from "./components/business-settings";
import ProfileComponent from "../../dashboard/profile/ProfileComponent";

export default function ProviderSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Image className="mr-2 h-4 w-4" />
            Gallery
          </TabsTrigger>
          {user?.role === "business" && (
            <TabsTrigger value="business">
              <Building className="mr-2 h-4 w-4" />
              Business
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          {/* <ProfileSettings /> */}
          <ProfileComponent />
        </TabsContent>
        <TabsContent value="payments" className="mt-6">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
          <ScheduleSettings />
        </TabsContent>
        <TabsContent value="gallery" className="mt-6">
          <GallerySettings />
        </TabsContent>
        {user?.role === "business" && (
          <TabsContent value="business" className="mt-6">
            <BusinessSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
