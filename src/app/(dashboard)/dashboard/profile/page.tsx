"use client";

import { User, Gift } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralProgram } from "@/components/profile/referral-program";
import ProfileComponent from "./ProfileComponent";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("profile");
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
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">
            Manage your personal information, and preferences
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setPathActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex justify-start gap-8 sm:justify-start">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="referrals">
              <Gift className="mr-2 h-4 w-4" />
              Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileComponent />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralProgram />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
