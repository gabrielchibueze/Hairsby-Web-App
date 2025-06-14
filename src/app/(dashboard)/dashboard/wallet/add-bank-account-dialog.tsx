"use client";

import { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addBankAccount } from "@/lib/api/financials/wallet";
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
import { Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupportedBankAccountInfo } from "@/lib/utils/stripe-utils/country-currency-codes";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/general/spinner";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const formSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountHolderType: z.enum(["individual", "company"]),
  country: z.string().min(1, "Country is required"),
  currency: z.string().min(1, "Currency is required"),
  accountNumber: z
    .string()
    .min(4, "Account number must be at least 4 characters"),
  routingNumber: z.string().min(1, "Routing/Sort code is required"),
});

export function AddBankAccountDialog({
  onSuccess,
  children,
}: {
  onSuccess: () => void;
  children?: React.ReactNode;
}) {
  const stripe = useStripe();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("GB");
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([
    "gbp",
  ]);
  const [routingLabel, setRoutingLabel] = useState("Sort Code");
  const { toast } = useToast();

  // Fetch supported bank account info (countries and currencies)
  const { data: bankAccountInfo } = useQuery({
    queryKey: ["supportedBankInfo"],
    queryFn: async () => {
      return await getSupportedBankAccountInfo();
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
      accountHolderType: "individual",
      country: "GB",
      currency: "gbp",
    },
  });

  // Update available currencies and routing label when country changes
  useEffect(() => {
    const currentCountry = form.watch("country");
    setCountry(currentCountry);

    // Update routing number label based on country
    switch (currentCountry) {
      case "GB":
        setRoutingLabel("Sort Code");
        break;
      case "AU":
        setRoutingLabel("BSB Number");
        break;
      default:
        setRoutingLabel("Routing Number");
    }

    if (bankAccountInfo?.currenciesByCountry && currentCountry) {
      const currencies = bankAccountInfo.currenciesByCountry[
        currentCountry
      ] || ["gbp"];
      setAvailableCurrencies(currencies);

      // If current currency isn't available for new country, set to first available
      if (!currencies.includes(form.watch("currency"))) {
        form.setValue("currency", currencies[0]);
      }
    }
  }, [form.watch("country"), bankAccountInfo?.currenciesByCountry, form]);

  const { mutate: addBankAccountMutation, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      // Create bank account token
      const bankAccountToken = await stripe.createToken("bank_account", {
        country: values.country,
        currency: values.currency,
        account_holder_name: values.accountHolderName,
        account_holder_type: values.accountHolderType,
        account_number: values.accountNumber,
        routing_number: values.routingNumber,
      });

      if (bankAccountToken.error) {
        throw new Error(bankAccountToken.error.message);
      }

      if (!bankAccountToken.token) {
        throw new Error("Failed to create bank account token");
      }

      // Send to backend
      return addBankAccount({
        token: bankAccountToken.token.id,
        bankName: values.bankName,
        accountHolderName: values.accountHolderName,
        accountHolderType: values.accountHolderType,
        currency: values.currency,
        country: values.country,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bank account added successfully",
        className: "bg-green-500 text-primary-foreground",
      });
      onSuccess();
      setOpen(false);
      form.reset();
    },
    onError: async (error: any) => {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to add bank account",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addBankAccountMutation(values);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {children || (
          <>
            <Plus className="h-4 w-4 mr-2" />
            <span className="sm:hidden">New</span>
            <span className="hidden sm:flex">Add Bank Account</span>
          </>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[725px] mx-4">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Connect your bank account to withdraw funds
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[450px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-1"
              >
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCountry(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bankAccountInfo?.countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={availableCurrencies.length <= 1}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCurrencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank of England" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="routingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{routingLabel}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            country === "GB" ? "12-34-56" : "021000021"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountHolderType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex gap-4 flex-row justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !stripe}
                    variant="brand"
                  >
                    {isPending ? <Spinner /> : null}
                    Add Account
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
