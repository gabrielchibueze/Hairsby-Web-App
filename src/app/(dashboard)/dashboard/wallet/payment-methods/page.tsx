"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PaymentMethodCard } from "@/components/dashboard/wallet/payment-method-card";

import {
  removePaymentMethod,
  setDefaultPaymentMethod,
} from "@/lib/api/accounts/profile";
import { getWallet } from "@/lib/api/financials/wallet";

export default function PaymentMethodsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  const removeMutation = useMutation({
    mutationFn: removePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast({
        title: "Success",
        description: "Payment method removed successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove payment method",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast({
        title: "Success",
        description: "Default payment method updated",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update default payment method",
      });
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/dashboard/wallet">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wallet
        </a>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallet?.paymentMethods.map((method: any, index: number) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PaymentMethodCard
                method={method}
                onDelete={() => removeMutation.mutate(method.id)}
                onSetDefault={() => setDefaultMutation.mutate(method.id)}
              />
            </motion.div>
          ))}
          <Button className="w-full" asChild>
            <a href="/dashboard/wallet/payment-methods/add">
              <Plus className="mr-2 h-4 w-4" />
              Add New Payment Method
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
