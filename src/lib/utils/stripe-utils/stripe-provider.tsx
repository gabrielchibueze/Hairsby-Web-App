"use client";

import { Elements } from "@stripe/react-stripe-js";
// import { Elements } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE!);

export function StripeProvider({ children }: { children: ReactNode }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#F9A000", // Hairsby orange
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
