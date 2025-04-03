"use client";

import { motion } from "framer-motion";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dummyTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to Hairsby!",
    type: "onboarding",
    lastModified: "2025-02-25",
  },
  {
    id: "2",
    name: "Booking Confirmation",
    subject: "Your appointment is confirmed",
    type: "booking",
    lastModified: "2025-02-24",
  },
];

export function EmailTemplateList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Subject: {template.subject}</span>
                  <span>•</span>
                  <span>Type: {template.type}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
