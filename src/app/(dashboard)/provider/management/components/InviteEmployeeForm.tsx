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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { inviteEmployee } from "@/lib/api/accounts/business";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import Spinner from "@/components/general/spinner";
import { useAuth } from "@/lib/contexts/auth.context";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.array(z.string()).min(1, "At least one role is required"),
  permissions: z.object({
    manageSchedule: z.boolean().optional(),
    manageServices: z.boolean().optional(),
    manageProducts: z.boolean().optional(),
    manageBookings: z.boolean().optional(),
    manageOrders: z.boolean().optional(),
    manageGallery: z.boolean().optional(),
    manageProfile: z.boolean().optional(),
    manageAvailability: z.boolean().optional(),
    viewReports: z.boolean().optional(),
    managePayments: z.boolean().optional(),
  }),
});

const predefinedRoles = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "senior_specialist", label: "Senior Specialist" },
  { value: "specialist", label: "Specialist" },
  { value: "junior_specialist", label: "Junior Specialist" },
];

export type PermissionName =
  | "manageSchedule"
  | "manageServices"
  | "manageProducts"
  | "manageBookings"
  | "manageOrders"
  | "manageGallery"
  | "manageProfile"
  | "manageAvailability"
  | "viewReports"
  | "managePayments";

type FormFieldName =
  | "email"
  | "firstName"
  | "lastName"
  | "role"
  | "permissions"
  | `permissions.${PermissionName}`;

interface PermissionOption {
  name: PermissionName;
  label: string;
}
const permissionOptions: PermissionOption[] = [
  { name: "manageSchedule", label: "Manage Schedule" },
  { name: "manageServices", label: "Manage Services" },
  { name: "manageProducts", label: "Manage Products" },
  { name: "manageBookings", label: "Manage Bookings" },
  { name: "manageOrders", label: "Manage Orders" },
  { name: "manageGallery", label: "Manage Gallery" },
  { name: "manageProfile", label: "Manage Profile" },
  { name: "manageAvailability", label: "Manage Availability" },
  { name: "viewReports", label: "View Reports" },
  { name: "managePayments", label: "Manage Payments" },
];

export function InviteEmployeeForm({
  onClose,
  onSuccess,
}: {
  onClose?: any;
  onSuccess?: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customRoleInput, setCustomRoleInput] = React.useState("");
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: ["specialist"],
      permissions: {
        manageSchedule: false,
        manageServices: true,
        manageProducts: true,
        manageBookings: true,
        manageOrders: true,
        manageGallery: false,
        manageProfile: true,
        manageAvailability: true,
        viewReports: false,
        managePayments: false,
      },
    },
  });

  const addCustomRole = () => {
    if (customRoleInput.trim()) {
      const currentRoles = form.getValues("role");
      if (!currentRoles.includes(customRoleInput)) {
        form.setValue("role", [...currentRoles, customRoleInput]);
        setCustomRoleInput("");
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await inviteEmployee(values);
      toast({
        title: "Invitation Sent",
        description: "The specialist has been invited to join your business.",
      });
      setIsLoading(false);
      router.refresh();

      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMessage = await ErrorToastResponse(error?.response);
      setIsLoading(false);
      toast({
        title: "Error",
        description: errorMessage || "There was an error sending your invite",
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <div className="flex gap-2 flex-col">
                  <Select
                    onValueChange={(value) => {
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select from predefined roles" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {predefinedRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 flex gap-2 items-center">
                    <Input
                      placeholder="Add custom role (e.g., Nail Expert)"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addCustomRole())
                      }
                      className="h-10"
                    />
                    <Button
                      type="button"
                      onClick={addCustomRole}
                      variant="brand"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((role) => {
                    const isPredefined = predefinedRoles.some(
                      (r) => r.value === role
                    );
                    const label = isPredefined
                      ? predefinedRoles.find((r) => r.value === role)?.label
                      : role;

                    return (
                      <div
                        key={role}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(
                              field.value.filter((r) => r !== role)
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
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
                : () =>
                    router.push(
                      `${user?.role === "business" ? "/provider/management/specialists" : user?.role === "specialist" ? "/provider" : "/dashboard"}`
                    )
            }
          >
            Cancel
          </Button>
          <Button type="submit" variant="brand" disabled={isLoading}>
            {isLoading && <Spinner plain={true} size="xs" className="mr-2" />}{" "}
            Send Invitation
          </Button>
        </div>
      </form>
    </Form>
  );
}
