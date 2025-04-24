"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { withdrawFunds } from "@/lib/api/financials/wallet";
import { useMutation } from "@tanstack/react-query";
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
import Spinner from "@/components/spinner";

const formSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
});

export function WithdrawFundsDialog({
  wallet,
  onSuccess,
  variant = "default",
  children,
}: {
  wallet: any;
  onSuccess: () => void;
  variant?: "default" | "outline";
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: withdrawFunds,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Withdrawal request submitted",
        className: "bg-green-500 text-white",
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to withdraw funds",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.amount > wallet?.balance) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Insufficient funds",
      });
      return;
    }
    mutate(values);
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setOpen(true)}
        disabled={!wallet?.defaultBankAccountId}
      >
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-80 sm:max-w-[425px] sm:mx-0">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Transfer money from your wallet to your bank account
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Available Balance: {wallet?.currency}{" "}
                  {wallet?.balance.toFixed(2)}
                </p>
                {wallet?.defaultBankAccountId && (
                  <p className="text-sm text-muted-foreground">
                    Funds will be transferred to your default bank account
                  </p>
                )}
              </div>
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
              <DialogFooter className="flex gap-2 flex-row justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                >
                  {isPending ? <Spinner /> : null}
                  Withdraw
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
