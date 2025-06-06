"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createService } from "@/lib/api/services/service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { ServiceForm } from "./service-form";
import { useEffect, useState } from "react";

export default function ProviderCreateService() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessEmployeeData, setBusinessEmployeeData] = useState<any>({
    employeeId: "" as string,
    businessId: "" as string,
    firstName: "" as string,
    lastName: "" as string,
    businessName: "" as string,
    role: "" as string,
  });
  const searchParams = useSearchParams();
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Service created successfully. Redirecting...",
    });
    // router.push("/provider/services");
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    const employeeId = searchParams.get("employeeId") || null;
    const businessId = searchParams.get("businessId") || null;
    const firstName = searchParams.get("firstName") || null;
    const lastName = searchParams.get("lastName") || null;
    const businessName = searchParams.get("businessName") || null;
    const role = searchParams.get("role") || null;
    const canManage = searchParams.get("canManage") === "true";

    setBusinessEmployeeData((prev: any) => {
      return {
        ...prev,
        employeeId,
        businessId,
        firstName,
        lastName,
        businessName,
        role,
        canManage,
      };
    });
  }, [searchParams]);

  if (
    businessEmployeeData.businessId &&
    businessEmployeeData.employeeId &&
    !businessEmployeeData.canManage
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Service{" "}
            {businessEmployeeData.role === "business"
              ? `for ${businessEmployeeData.firstName} ${businessEmployeeData.lastName}`
              : `with ${businessEmployeeData.businessName || `${businessEmployeeData.firstName} ${businessEmployeeData.lastName}`}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                Permission to create service denied.
              </p>
              <Button
                variant="brand"
                className="flex items-center gap-2 mt-4  mx-auto"
                onClick={handleCancel}
              >
                <ChevronLeft className="h-4 w-4" />
                Go back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Service{" "}
              {businessEmployeeData.firstName && businessEmployeeData.employeeId
                ? `for ${businessEmployeeData.firstName} ${businessEmployeeData.lastName}`
                : businessEmployeeData.firstName &&
                    businessEmployeeData.businessid
                  ? `with ${businessEmployeeData.businessName}`
                  : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              service={null}
              providerId={user?.id || ""}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              businessEmployeeData={businessEmployeeData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
