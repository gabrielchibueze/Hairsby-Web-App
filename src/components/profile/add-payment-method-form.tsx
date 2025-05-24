// @/components/profile/add-payment-method-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { addPaymentMethod } from "@/lib/api/accounts/profile";
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
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "../general/spinner";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const paymentFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

export function AddPaymentMethodForm({
  onSuccess,
  source,
}: {
  source?: string | null;
  onSuccess: (method: any) => void;
}) {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: {
          name: values.name,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      await addPaymentMethod({ paymentMethodId: paymentMethod.id });
      onSuccess({
        id: paymentMethod.id,
        type: "card",
        isDefault: false,
        card: {
          brand: paymentMethod.card?.brand || "",
          last4: paymentMethod.card?.last4 || "",
          exp_month: paymentMethod.card?.exp_month || 0,
          exp_year: paymentMethod.card?.exp_year || 0,
        },
      });
      setLoading(false);
      if (source) {
        // router.push(`/dashboard/${source}`);
        router.back();
      }
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);

      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to add payment method",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name on Card</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Card Details</FormLabel>
          <div className="rounded-lg border p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <FormMessage />
        </FormItem>

        <Button
          type="submit"
          className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
        >
          {loading ? <Spinner /> : null} Add Payment Method
        </Button>
      </form>
    </Form>
  );
}
