// @/app/provider/management/branches/components/businessBranchSettings.tsx

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
import { BusinessBranch } from "@/lib/api/accounts/company";
import { updateBranch } from "@/lib/api/accounts/company";
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
import { useAuth } from "@/lib/contexts/auth.context";
import { useRouter } from "next/navigation";

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

interface BranchSettingsProps {
  businessBranch: BusinessBranch;
  isLoading: boolean;
}

export function BusinessBranchSettings({
  businessBranch,
  isLoading,
}: BranchSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(businessBranch.permissions);
  const [branchDetails, setBranchDetails] = useState({
    branchName: businessBranch.branchName,
    phone: businessBranch.branch.phone,
    address: businessBranch.branch.address || "",
    city: businessBranch.branch.city || "",
    country: businessBranch.branch.country || "",
    postcode: businessBranch.branch.postcode || "",
  });
  const [status, setStatus] = useState(businessBranch.status);

  useEffect(() => {
    if (businessBranch) {
      setPermissions(businessBranch.permissions);
      setBranchDetails({
        branchName: businessBranch.branchName,
        phone: businessBranch.branch.phone,
        address: businessBranch.branch.address || "",
        city: businessBranch.branch.city || "",
        country: businessBranch.branch.country || "",
        postcode: businessBranch.branch.postcode || "",
      });
      setStatus(businessBranch.status);
    }
  }, [businessBranch]);

  const handlePermissionChange = (
    permission: PermissionName,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
  };

  const handleBranchDetailsChange = (
    field: keyof typeof branchDetails,
    value: any
  ) => {
    setBranchDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateBranch(businessBranch.branch.id, {
        branchName: branchDetails.branchName,
        permissions,
        status,
        profile: {
          phone: branchDetails.phone,
          address: branchDetails.address,
          city: branchDetails.city,
          country: branchDetails.country,
          postcode: branchDetails.postcode,
        },
      });

      router.refresh();
      toast({
        title: "Success",
        description: "Branch settings updated successfully",
      });
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to update branch settings",
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
        {/* Branch Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Branch Information</CardTitle>
            <CardDescription>
              Update this branch's details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                value={branchDetails.branchName}
                onChange={(e) =>
                  handleBranchDetailsChange("branchName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={branchDetails.phone}
                onChange={(e) =>
                  handleBranchDetailsChange("phone", e.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={branchDetails.address}
                onChange={(e) =>
                  handleBranchDetailsChange("address", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={branchDetails.city}
                onChange={(e) =>
                  handleBranchDetailsChange("city", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={branchDetails.country}
                onChange={(e) =>
                  handleBranchDetailsChange("country", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                value={branchDetails.postcode}
                onChange={(e) =>
                  handleBranchDetailsChange("postcode", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Permissions</CardTitle>
            <CardDescription>
              Configure what this branch can access and manage
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-employees"
                checked={permissions.manageEmployees || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageEmployees", checked)
                }
              />
              <Label htmlFor="manage-employees">Manage Employees</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-services"
                checked={permissions.manageServices || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageServices", checked)
                }
              />
              <Label htmlFor="manage-services">Manage Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-products"
                checked={permissions.manageProducts || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageProducts", checked)
                }
              />
              <Label htmlFor="manage-products">Manage Products</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-bookings"
                checked={permissions.manageBookings || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageBookings", checked)
                }
              />
              <Label htmlFor="manage-bookings">Manage Bookings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-orders"
                checked={permissions.manageOrders || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageOrders", checked)
                }
              />
              <Label htmlFor="manage-orders">Manage Orders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-gallery"
                checked={permissions.manageGallery || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageGallery", checked)
                }
              />
              <Label htmlFor="manage-gallery">Manage Gallery</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="view-reports"
                checked={permissions.viewReports || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("viewReports", checked)
                }
              />
              <Label htmlFor="view-reports">View Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-payments"
                checked={permissions.managePayments || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("managePayments", checked)
                }
              />
              <Label htmlFor="manage-payments">Manage Payments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-branch-settings"
                checked={permissions.manageBranchSettings || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageBranchSettings", checked)
                }
              />
              <Label htmlFor="manage-branch-settings">
                Manage Branch Settings
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manage-branch-locations"
                checked={permissions.manageBranchLocations || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange("manageBranchLocations", checked)
                }
              />
              <Label htmlFor="manage-branch-locations">
                Manage Branch Locations
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Branch Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Branch Status</CardTitle>
            <CardDescription>
              Update the current status of this branch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="active-status"
                  name="branchStatus"
                  value="active"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                  className="h-4 w-4 text-hairsby-orange focus:ring-hairsby-orange"
                />
                <Label htmlFor="active-status">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="suspended-status"
                  name="branchStatus"
                  value="suspended"
                  checked={status === "suspended"}
                  onChange={() => setStatus("suspended")}
                  className="h-4 w-4 text-hairsby-orange focus:ring-hairsby-orange"
                />
                <Label htmlFor="suspended-status">Suspended</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={handleSave} variant="brand" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
