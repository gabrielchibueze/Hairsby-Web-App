"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import {  as Edit,  as MoreVertical,  as Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dummyNotifications = [
  {
    id: "1",
    title: "New Feature Alert",
    message: "Check out our latest features!",
    type: "all",
    status: "scheduled",
    scheduledFor: "2025-02-26"
  },
  {
    id: "2",
    title: "Special Offer",
    message: "Limited time discount on all services",
    type: "customer",
    status: "sent",
    sentAt: "2025-02-25"
  }
]

export function NotificationList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Target: {notification.type}</span>
                  <span>•</span>
                  <span className={cn(
                    "capitalize",
                    notification.status === "sent" ? "text-green-600" : "text-yellow-600"
                  )}>
                    {notification.status}
                  </span>
                  <span>•</span>
                  <span>
                    {notification.status === "sent" 
                      ? `Sent on ${format(new Date(notification.sentAt), "PP")}`
                      : `Scheduled for ${format(new Date(notification.scheduledFor), "PP")}`
                    }
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
  )
}