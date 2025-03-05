"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Image from "next/image"
import { format } from "date-fns"
import {  as Calendar,  as Clock,  as CreditCard,  as DollarSign,  as Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { getBookingById, processPayment } from "@/lib/api/bookings"
import { getWallet } from "@/lib/api/wallet"

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card")
  const [useWalletBalance, setUseWalletBalance] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const { data: booking } = useQuery({
    queryKey: ["booking", params.id],
    queryFn: () => getBookingById(params.id),
  })

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  })

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      const result = await processPayment(params.id, {
        paymentMethod,
        useWalletBalance
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Payment processed successfully",
        })
        window.location.href = `/services/${params.id}/checkout/confirmation`
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment failed. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!booking) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your booking payment
        </p>

        <div className="mt-8 grid gap-6">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={booking.service.images[0]}
                      alt={booking.service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.service.provider.businessName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(booking.date), "PPP")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(`2000-01-01T${booking.time}`), "p")}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold">
                    £{booking.service.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you want to pay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "card" | "wallet")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet Balance (£{wallet?.balance.toFixed(2)})
                    </Label>
                  </div>
                </RadioGroup>

                {wallet && wallet.balance > 0 && paymentMethod === "card" && (
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Use Wallet Balance</Label>
                      <p className="text-sm text-muted-foreground">
                        Available: £{wallet.balance.toFixed(2)}
                      </p>
                    </div>
                    <Switch
                      checked={useWalletBalance}
                      onCheckedChange={setUseWalletBalance}
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Month</Label>
                        <Input placeholder="MM" />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Year</Label>
                        <Input placeholder="YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}