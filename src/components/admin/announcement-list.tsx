"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const dummyAnnouncements = [
  {
    id: "1",
    title: "New Feature Release",
    type: "general",
    status: "published",
    author: "Admin Team",
    publishDate: "2025-02-25",
  },
  {
    id: "2",
    title: "System Maintenance Notice",
    type: "provider",
    status: "scheduled",
    author: "System Admin",
    publishDate: "2025-02-26",
  },
];

export function AnnouncementList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-medium">{announcement.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Type: {announcement.type}</span>
                  <span>•</span>
                  <span
                    className={cn(
                      "capitalize",
                      announcement.status === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    )}
                  >
                    {announcement.status}
                  </span>
                  <span>•</span>
                  <span>
                    {format(new Date(announcement.publishDate), "PP")}
                  </span>
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
