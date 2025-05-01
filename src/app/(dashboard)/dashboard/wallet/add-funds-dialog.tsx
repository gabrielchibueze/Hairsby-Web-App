"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addFunds } from "@/lib/api/financials/wallet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPaymentMethods, PaymentMethod } from "@/lib/api/accounts/profile";
import Link from "next/link";
import Spinner from "@/components/spinner";

const formSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  paymentMethodId: z.string().min(1, "Payment method is required"),
});

export function AddFundsDialog({
  onSuccess,
  variant = "default",
  children,
}: {
  onSuccess: () => void;
  variant?: "default" | "outline";
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Fetch payment methods
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery(
    {
      queryKey: ["paymentMethods"],
      queryFn: getPaymentMethods,
      enabled: open, // Only fetch when dialog is open
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentMethodId: "",
    },
  });

  // Set default payment method when payment methods are loaded
  useEffect(() => {
    console.log(paymentMethods);
    if (paymentMethods && paymentMethods.length > 0) {
      const defaultMethod =
        paymentMethods.find((method) => method.isDefault) || paymentMethods[0];
      form.setValue("paymentMethodId", defaultMethod.id);
    }
  }, [paymentMethods, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: addFunds,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Funds added successfully",
        className: "bg-green-500 text-white",
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add funds",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-80 sm:max-w-[425px] min-h-[300px]">
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Deposit money into your wallet using your preferred payment method
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    {isLoadingPaymentMethods ? (
                      <Input
                        placeholder="Loading payment methods..."
                        disabled
                      />
                    ) : paymentMethods && paymentMethods.length > 0 ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method: PaymentMethod) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.card.brand.toUpperCase()} ••••{" "}
                              {method.card.last4}
                              (Exp {method.card.exp_month}/
                              {method.card.exp_year})
                              {method.isDefault && " • Default"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <Input
                          placeholder="No payment methods available"
                          disabled
                        />
                        <p className="text-sm">
                          No payment methods found -
                          <span className="ml-4 text-hairsby-orange underline">
                            <Link href="/dasboard/settings?source=wallet&target=payments">
                              add payment method
                            </Link>
                          </span>
                        </p>
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex gap-3 flex-row justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || isLoadingPaymentMethods}
                  className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                >
                  {isPending ? <Spinner /> : null}
                  Add Funds
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
