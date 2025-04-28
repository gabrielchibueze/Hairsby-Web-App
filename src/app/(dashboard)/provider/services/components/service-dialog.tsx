"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Service } from "@/lib/api/services/service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceDetails } from "./service-details";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceForm } from "./service-form";
import { useState } from "react";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  providerId: string;
  onSuccess: () => void;
}

export function ServiceDialog({
  open,
  onOpenChange,
  service,
  providerId,
  onSuccess,
}: ServiceDialogProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] sm:mx-0 sm:max-w-[800px] min-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {service ? (
              <>
                <span>{service.name}</span>
                {service.isPackage && (
                  <span className="text-sm font-normal text-gray-500">
                    (Package)
                  </span>
                )}
              </>
            ) : (
              "Create New Service"
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {service ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Service Details</TabsTrigger>
                <TabsTrigger value="edit">Edit Service</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <ServiceDetails
                  service={service}
                  embedded
                  onEditService={() => setActiveTab("edit")}
                />
              </TabsContent>
              <TabsContent value="edit" className="pt-4">
                <ServiceForm
                  service={service}
                  providerId={providerId}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  onSuccess={() => {
                    onSuccess();
                    onOpenChange(false);
                  }}
                  onCancel={() => onOpenChange(false)}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <ServiceForm
              service={null}
              providerId={providerId}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onSuccess={() => {
                onSuccess();
                onOpenChange(false);
              }}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
