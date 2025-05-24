// components/provider/management/specialists/employeeSettings.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BusinessEmployee,
  employmentStatus,
} from "@/lib/api/accounts/business";
import { updateEmployee } from "@/lib/api/accounts/business";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Predefined roles
const predefinedRoles = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "senior_specialist", label: "Senior Specialist" },
  { value: "specialist", label: "Specialist" },
  { value: "junior_specialist", label: "Junior Specialist" },
];

type PermissionName =
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

interface EmployeeSettingsProps {
  employee: BusinessEmployee;
  isLoading: boolean;
}

export function EmployeeSettings({
  employee,
  isLoading,
}: EmployeeSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(employee.permissions);
  const [roles, setRoles] = useState<string[]>(employee.role);
  const [employmentStatus, setEmploymentStatus] = useState<employmentStatus>(
    employee.employmentStatus
  );
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    firstName: employee.employee.firstName,
    lastName: employee.employee.lastName,
    phone: employee.employee.phone,
    dob: employee.employee.dob ? new Date(employee.employee.dob) : null,
    address: employee.employee.address || "",
    city: employee.employee.city || "",
    country: employee.employee.country || "",
    postcode: employee.employee.postcode || "",
  });

  useEffect(() => {
    if (employee) {
      setPermissions(employee.permissions);
      setRoles(employee.role);
      setEmploymentStatus(employee.employmentStatus);
      setPersonalInfo({
        firstName: employee.employee.firstName,
        lastName: employee.employee.lastName,
        phone: employee.employee.phone,
        dob: employee.employee.dob ? new Date(employee.employee.dob) : null,
        address: employee.employee.address || "",
        city: employee.employee.city || "",
        country: employee.employee.country || "",
        postcode: employee.employee.postcode || "",
      });
    }
  }, [employee]);

  const handlePermissionChange = (
    permission: PermissionName,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
  };

  const handlePersonalInfoChange = (
    field: keyof typeof personalInfo,
    value: any
  ) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCustomRole = () => {
    if (customRoleInput.trim() && !roles.includes(customRoleInput)) {
      setRoles((prev) => [...prev, customRoleInput]);
      setCustomRoleInput("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRoles((prev) => prev.filter((role) => role !== roleToRemove));
  };

  const addPredefinedRole = (role: string) => {
    if (!roles.includes(role)) {
      setRoles((prev) => [...prev, role]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateEmployee(employee.employee.id, {
        role: roles,
        permissions,
        employmentStatus,
        profile: {
          ...personalInfo,
          dob: personalInfo.dob ? format(personalInfo.dob, "yyyy-MM-dd") : null,
        },
      });

      toast({
        title: "Success",
        description: "Employee settings updated successfully",
      });
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to update employee settings",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid gap-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>
              Update the employee's personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) =>
                  handlePersonalInfoChange("firstName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) =>
                  handlePersonalInfoChange("lastName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) =>
                  handlePersonalInfoChange("phone", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {personalInfo.dob
                      ? format(personalInfo.dob, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={personalInfo.dob || undefined}
                    onSelect={(date) => handlePersonalInfoChange("dob", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={personalInfo.address}
                onChange={(e) =>
                  handlePersonalInfoChange("address", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={personalInfo.city}
                onChange={(e) =>
                  handlePersonalInfoChange("city", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={personalInfo.country}
                onChange={(e) =>
                  handlePersonalInfoChange("country", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                value={personalInfo.postcode}
                onChange={(e) =>
                  handlePersonalInfoChange("postcode", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Employee Roles</CardTitle>
            <CardDescription>
              Assign roles to define this employee's responsibilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-col">
              <Select onValueChange={addPredefinedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from predefined roles" />
                </SelectTrigger>
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
                    e.key === "Enter" && (e.preventDefault(), addCustomRole())
                  }
                  className="h-10"
                />
                <Button type="button" onClick={addCustomRole} variant="brand">
                  Add
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((role) => {
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
                      onClick={() => removeRole(role)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Permissions</CardTitle>
            <CardDescription>
              Fine-tune what this employee can access and manage
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-schedule"
                checked={permissions.manageSchedule}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageSchedule", checked)
                }
              />
              <Label htmlFor="manage-schedule">Manage Schedule</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-services"
                checked={permissions.manageServices}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageServices", checked)
                }
              />
              <Label htmlFor="manage-services">Manage Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-products"
                checked={permissions.manageProducts}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageProducts", checked)
                }
              />
              <Label htmlFor="manage-products">Manage Products</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-bookings"
                checked={permissions.manageBookings}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageBookings", checked)
                }
              />
              <Label htmlFor="manage-bookings">Manage Bookings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-orders"
                checked={permissions.manageOrders}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageOrders", checked)
                }
              />
              <Label htmlFor="manage-orders">Manage Orders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-gallery"
                checked={permissions.manageGallery}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageGallery", checked)
                }
              />
              <Label htmlFor="manage-gallery">Manage Gallery</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="view-reports"
                checked={permissions.viewReports}
                onCheckedChange={(checked) =>
                  handlePermissionChange("viewReports", checked)
                }
              />
              <Label htmlFor="view-reports">View Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-payments"
                checked={permissions.managePayments}
                onCheckedChange={(checked) =>
                  handlePermissionChange("managePayments", checked)
                }
              />
              <Label htmlFor="manage-payments">Manage Payments</Label>
            </div>
          </CardContent>
        </Card>

        {/* Employment Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Employment Status</CardTitle>
            <CardDescription>
              Update the current status of this employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="active-status"
                  name="employmentStatus"
                  value="active"
                  checked={employmentStatus === "active"}
                  onChange={() => setEmploymentStatus("active")}
                  className="h-4 w-4 text-hairsby-orange focus:ring-hairsby-orange"
                />
                <Label htmlFor="active-status">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="on-leave-status"
                  name="employmentStatus"
                  value="on_leave"
                  checked={employmentStatus === "on_leave"}
                  onChange={() => setEmploymentStatus("on_leave")}
                  className="h-4 w-4 text-hairsby-orange focus:ring-hairsby-orange"
                />
                <Label htmlFor="on-leave-status">On Leave</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="terminated-status"
                  name="employmentStatus"
                  value="terminated"
                  checked={employmentStatus === "terminated"}
                  onChange={() => setEmploymentStatus("terminated")}
                  className="h-4 w-4 text-hairsby-orange focus:ring-hairsby-orange"
                />
                <Label htmlFor="terminated-status">Terminated</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-hairsby-orange hover:bg-hairsby-orange/90 shadow-lg transition-all hover:shadow-hairsby-orange/30"
          disabled={loading}
          size="lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
