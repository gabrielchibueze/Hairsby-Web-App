"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreditCard,
  Gift,
} from "lucide-react";
import { format } from "date-fns";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/contexts/auth.context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethods } from "@/components/profile/payment-methods";
import { uploadUserProfilePhoto } from "@/lib/api/accounts/profile";
import Breadcrumb from "@/components/general/breadcrumb";
import SettingsComponent from "./settings";
import { useSearchParams } from "next/navigation";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().min(5, "Please enter a valid address").optional(),
  city: z.string().min(2, "Please enter a valid city").optional(),
  postcode: z.string().min(5, "Please enter a valid postcode").optional(),
  country: z.string().min(2, "Please enter a valid country").optional(),
});

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const target = searchParams.get("target");

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      dob: user?.dob ? format(new Date(user.dob), "yyyy-MM-dd") : "",
      address: user?.address || "",
      city: user?.city || "",
      postcode: user?.postcode || "",
      country: user?.country || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob ? format(new Date(user.dob), "yyyy-MM-dd") : "",
        address: user.address || "",
        city: user.city || "",
        postcode: user.postcode || "",
        country: user.country || "",
      });
    }
  }, [user, form]);
  console.log("search target", target);
  useEffect(() => {
    if (target) {
      const curenttarget = target.split("#"[1]);
      setActiveTab(target);
    }
  }, [target]);
  console.log(user);
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsLoading(true);
      await updateProfile(values);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsLoading(true);
        const file = e.target.files[0];
        await uploadUserProfilePhoto(file);
        toast({
          title: "Success",
          description: "Profile photo updated successfully",
          className: "bg-green-500 text-white",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile photo",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "My Settings" },
        ]}
      />{" "}
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
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="flex justify-start gap-8 sm:justify-start">
          <TabsTrigger value="settings">
            <Gift className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
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
  );
}
