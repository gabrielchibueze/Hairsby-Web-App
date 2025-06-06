// app/(provider)/account/page.tsx
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SettingsComponent from "../../dashboard/settings/settings";

export default function ProviderSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const target = searchParams.get("t") as string;
  useEffect(() => {
    if (target) {
      setPathActiveTab(target);
    } else {
      setPathActiveTab("profile");
    }
  }, [target]);

  const setPathActiveTab = (path: string) => {
    setActiveTab(path);
    router.push(`${pathname}?t=${path}`);
  };
  return (
    <Suspense>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">
            Manage your account, settings and preferences
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setPathActiveTab}
          className="w-full"
        >
          <TabsList className="sm:grid sm:w-full sm:grid-cols-6">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings">
              <User className="mr-2 h-4 w-4" />
              Settings
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
            <ProfileComponent />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <SettingsComponent />
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
    </Suspense>
  );
}
