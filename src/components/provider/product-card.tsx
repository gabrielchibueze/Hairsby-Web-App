"use client"

import Image from "next/image"
import { Edit, MoreVertical, Trash } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    images: string[]
    category: string
    isAvailable: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Product deleted successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product"
      })
    }
  }

  const handleAvailabilityChange = async () => {
    try {
      // TODO: Implement availability toggle
      toast({
        title: "Success",
        description: `Product ${product.isAvailable ? 'hidden' : 'shown'} successfully`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product availability"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="relative h-48 p-0">
        <Image
          src={product.images[0]}
          alt={product.name}
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
                <a href={`/provider/products/${product.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Product
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this product? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
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
            <h3 className="font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
          <Badge
            variant={
              product.stock === 0
                ? "destructive"
                : product.stock < 10
                ? "warning"
                : "success"
            }
          >
            {product.stock === 0
              ? "Out of Stock"
              : product.stock < 10
              ? "Low Stock"
              : "In Stock"}
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold">£{product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            {product.stock} in stock
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Availability</span>
          <Switch
            checked={product.isAvailable}
            onCheckedChange={handleAvailabilityChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}