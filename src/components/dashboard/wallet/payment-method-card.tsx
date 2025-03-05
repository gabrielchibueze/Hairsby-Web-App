"use client"

import { motion } from "framer-motion"
import { CreditCard, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface PaymentMethodCardProps {
  method: {
    id: string
    last4: string
    expMonth: string
    expYear: string
    isDefault: boolean
  }
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export function PaymentMethodCard({ method, onDelete, onSetDefault }: PaymentMethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            •••• {method.last4}
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription>
            Expires {method.expMonth}/{method.expYear}
          </CardDescription>
          <div className="mt-4 flex items-center justify-between">
            {!method.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetDefault(method.id)}
              >
                Set as Default
              </Button>
            )}
            {method.isDefault && (
              <span className="text-sm text-muted-foreground">Default</span>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this payment method? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(method.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}