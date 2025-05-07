"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  User,
  Gift,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/contexts/auth.context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReferralProgram } from "@/components/profile/referral-program";
import { uploadUserProfilePhoto } from "@/lib/api/accounts/profile";
import Spinner from "@/components/general/spinner";

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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

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
      {/* <Breadcrumb
        breadcrumb={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "My Profile" },
        ]}
      />{" "} */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Manage your personal information, and preferences
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
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
          {/* Profile Overview */}
          <Card className="border-hairsby-orange/20">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="relative">
                   <Avatar size="xxl"
                    src={user?.photo} 
                    alt={`${user?.firstName} ${user?.lastName}`}
                    fallback={
                      <>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </>
                    }
                  />
               
                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-hairsby-orange text-white transition-colors hover:bg-hairsby-orange/90"
                  >
                    {isLoading ? <Spinner /> : <Camera className="h-4 w-4" />}
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isLoading}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                    {user?.isEmailVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="warning">Unverified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{user?.phone || "Not provided"}</span>
                  </div>
                  {user?.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {user.address}, {user.city}, {user.postcode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-hairsby-orange/20">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      className="bg-hairsby-orange hover:bg-hairsby-orange/90"
                      disabled={isLoading}
                    >
                      {isLoading ? `${(<Spinner />)}Saving...` : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralProgram />
        </TabsContent>
      </Tabs>
    </div>
  );
}
