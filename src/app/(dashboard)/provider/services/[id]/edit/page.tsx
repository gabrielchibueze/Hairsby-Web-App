"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getServiceById } from "@/lib/api/services/service";
import { Service } from "@/lib/api/services/service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceForm } from "../../components/service-form";

export default function EditServicePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(id as string);
        setService(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load service",
          variant: "destructive",
        });
        router.push("/provider/services");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, router]);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Service updated successfully",
    });
    // router.push("/provider/services");
  };

  const handleCancel = () => {
    router.push(`/provider/services/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-24 ml-auto" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground/100">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
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
              Edit Service: {service.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              service={service}
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
