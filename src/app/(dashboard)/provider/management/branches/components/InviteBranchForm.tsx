// @/app/provider/management/branches/components/InviteBranchForm.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createBranch } from "@/lib/api/accounts/company";
import { useRouter } from "next/navigation";
import Spinner from "@/components/general/spinner";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import { useAuth } from "@/lib/contexts/auth.context";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  branchName: z.string().min(2, "Branch name must be at least 2 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  permissions: z.object({
    manageEmployees: z.boolean().optional(),
    manageServices: z.boolean().optional(),
    manageProducts: z.boolean().optional(),
    manageBookings: z.boolean().optional(),
    manageOrders: z.boolean().optional(),
    manageGallery: z.boolean().optional(),
    manageProfile: z.boolean().optional(),
    manageAvailability: z.boolean().optional(),
    viewReports: z.boolean().optional(),
    managePayments: z.boolean().optional(),
    manageBranchSettings: z.boolean().optional(),
    manageBranchLocations: z.boolean().optional(),
  }),
});

type PermissionName =
  | "manageEmployees"
  | "manageServices"
  | "manageProducts"
  | "manageBookings"
  | "manageOrders"
  | "manageGallery"
  | "manageProfile"
  | "manageAvailability"
  | "viewReports"
  | "managePayments"
  | "manageBranchSettings"
  | "manageBranchLocations";

interface PermissionOption {
  name: PermissionName;
  label: string;
}
const permissionOptions: PermissionOption[] = [
  { name: "manageEmployees", label: "Manage Employees" },
  { name: "manageServices", label: "Manage Services" },
  { name: "manageProducts", label: "Manage Products" },
  { name: "manageBookings", label: "Manage Bookings" },
  { name: "manageOrders", label: "Manage Orders" },
  { name: "manageGallery", label: "Manage Gallery" },
  { name: "manageProfile", label: "Manage Profile" },
  { name: "manageAvailability", label: "Manage Availability" },
  { name: "viewReports", label: "View Reports" },
  { name: "managePayments", label: "Manage Payments" },
  { name: "manageBranchSettings", label: "Manage Branch Settings" },
  { name: "manageBranchLocations", label: "Manage Branch Locations" },
];

export function InviteBranchForm({
  onClose,
  onSuccess,
}: {
  onClose?: any;
  onSuccess?: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      branchName: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postcode: "",
      permissions: {
        manageEmployees: false,
        manageServices: true,
        manageProducts: true,
        manageBookings: true,
        manageOrders: true,
        manageGallery: false,
        manageProfile: true,
        manageAvailability: true,
        viewReports: false,
        managePayments: false,
        manageBranchSettings: true,
        manageBranchLocations: false,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await createBranch(values);
      toast({
        title: "Invitation Sent",
        description: "The branch has been created and invitation sent.",
      });
      setIsLoading(false);
      router.refresh();

      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMessage = await ErrorToastResponse(error?.response);
      setIsLoading(false);
      toast({
        title: "Error",
        description: errorMessage || "There was an error creating the branch",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="branchName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input placeholder="Downtown Branch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="manager@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                  <Input placeholder="Doe" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+44 1234 567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="London" {...field} />
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
                  <Input placeholder="United Kingdom" {...field} />
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
                  <Input placeholder="SW1A 1AA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissionOptions.map((permission) => (
              <FormField
                key={permission.name}
                control={form.control}
                name={`permissions.${permission.name}` as const}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-hairsby-orange focus:ring-hairsby-orange"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {permission.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={
              onClose
                ? () => onClose(false)
                : () => router.push("/provider/management/branches")
            }
          >
            Cancel
          </Button>
          <Button type="submit" variant="brand" disabled={isLoading}>
            {isLoading && <Spinner plain={true} size="xs" className="mr-2" />}{" "}
            Create Branch
          </Button>
        </div>
      </form>
    </Form>
  );
}
