"use client"

import Image from "next/image"
import { Clock, Edit, MoreVertical, Trash } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    price: number
    duration: number
    category: string
    images: string[]
    isAvailable: boolean
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader className="relative h-48 p-0">
        <Image
          src={service.images[0]}
          alt={service.name}
          fill
          className="rounded-t-lg object-cover"
        />
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={`/provider/services/${service.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Service
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Service
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Service</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this service? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{service.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {service.description}
            </p>
          </div>
          <Badge variant={service.isAvailable ? "success" : "secondary"}>
            {service.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span className="text-sm">{service.duration} min</span>
          </div>
          <p className="font-semibold">£{service.price.toFixed(2)}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Availability</span>
          <Switch checked={service.isAvailable} />
        </div>
      </CardContent>
    </Card>
  )
}