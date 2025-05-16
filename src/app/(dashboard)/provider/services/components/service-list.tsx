"use client";

import { Service } from "@/lib/api/services/service";
import { ServiceCard } from "./service-card";
import { useState } from "react";
import { ServiceFilters } from "./service-filters";

interface ServiceListProps {
  services: Service[];
  onEditService: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

export function ServiceList({
  services,
  onEditService,
  onViewDetails,
}: ServiceListProps) {
  const [filteredServices, setFilteredServices] = useState(services);

  return (
    <div className="space-y-4">
      <ServiceFilters
        services={services}
        onFilterChange={setFilteredServices}
      />

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => onEditService(service)}
              onViewDetails={() => onViewDetails(service)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground/100">
            No services match your filters. Create a new service to get started.
          </p>
        </div>
      )}
    </div>
  );
}
