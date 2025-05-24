"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createService } from "@/lib/api/services/service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { ServiceForm } from "../components/service-form";
import { useState } from "react";

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Service
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
