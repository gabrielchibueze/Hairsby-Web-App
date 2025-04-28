"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Grid, List, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderServices } from "@/lib/api/accounts/provider";
import { ServiceMetrics } from "./components/service-metrics";
import { ServiceList } from "./components/service-list";
import { ServiceTable } from "./components/service-table";
import { ServiceDetails } from "./components/service-details";
import { ServiceDialog } from "./components/service-dialog";
import { Service } from "@/lib/api/services/service";

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getProviderServices();
        setServices(data.services || []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };

  const handleNewService = () => {
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setIsDetailsOpen(false);
    // Refresh services after successful operation
    const fetchServices = async () => {
      const data = await getProviderServices();
      setServices(data.services || []);
    };
    fetchServices();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <div className="flex gap-3">
          <Button
            onClick={handleNewService}
            className="bg-hairsby-orange hover:bg-hairsby-orange/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Service
          </Button>
        </div>
      </div>

      <ServiceMetrics services={services} />

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">
            <Grid className="mr-2 h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="packages">
            <Package className="mr-2 h-4 w-4" />
            Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <ServiceList
            services={services.filter((s) => !s.isPackage)}
            onEditService={handleEditService}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <ServiceTable
            services={services.filter((s) => !s.isPackage)}
            onEditService={handleEditService}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <ServiceList
            services={services.filter((s) => s.isPackage)}
            onEditService={handleEditService}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        providerId={user?.id || ""}
        onSuccess={handleSuccess}
      />

      <ServiceDetails
        service={selectedService}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditService={() => {
          setIsDetailsOpen(false);
          setIsDialogOpen(true);
        }}
      />
    </div>
  );
}
