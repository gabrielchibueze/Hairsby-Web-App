// app/onboarding/invalid-token/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function InvalidTokenPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Invalid Onboarding Link"
      // subtitle={`Welcome to ${onboardingData.businessName} on Hairsby`}
      className="w-full lg:max-w-[800px]"
      caption="Hairsby is connecting service professionals with customers."
    >
      {/* <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center ">
        <p className="text-gray-600 mb-6">
          The onboarding link you used is either invalid or has expired. Please
          contact your business administrator or handler for a new invitation.
        </p>
        <Button onClick={() => router.push("/")} variant="brand">
          Return to Homepage
        </Button>
      </div>
      {/* </div> */}
    </AuthLayout>
  );
}
