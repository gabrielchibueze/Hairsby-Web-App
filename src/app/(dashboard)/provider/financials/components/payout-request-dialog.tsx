// app/(provider)/financials/components/payout-request-dialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { BankAccountSelector } from "./bank-account-selector";

const payoutSchema = z.object({
  amount: z.number().min(1, "Amount must be at least £1"),
  paymentMethod: z.enum(["bank_transfer", "paypal"]),
  bankDetails: z
    .object({
      accountNumber: z.string().min(8, "Invalid account number"),
      sortCode: z.string().length(6, "Sort code must be 6 digits"),
    })
    .optional(),
});

export function PayoutRequestDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof payoutSchema>) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<
    "bank_transfer" | "paypal"
  >("bank_transfer");
  const form = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "bank_transfer",
    },
  });

  const handleSubmit = (values: z.infer<typeof payoutSchema>) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Withdraw your earnings to your bank account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (£)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
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
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "bank_transfer"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          setPaymentMethod("bank_transfer");
                          field.onChange("bank_transfer");
                        }}
                      >
                        Bank Transfer
                      </Button>
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "paypal" ? "default" : "outline"
                        }
                        onClick={() => {
                          setPaymentMethod("paypal");
                          field.onChange("paypal");
                        }}
                      >
                        PayPal
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "bank_transfer" && (
              <BankAccountSelector
                onSelect={(account) =>
                  form.setValue("bankDetails", {
                    accountNumber: account.accountNumber,
                    sortCode: account.sortCode,
                  })
                }
              />
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand">
                Request Payout
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
