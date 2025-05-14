"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useToast } from "@/components/ui/use-toast";
import * as Icons from "@/components/general/icons";
import { verifyEmail } from "@/lib/api/auths/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">Loading verification...</div>
      }
    >
      <VerifyEmailComponent />
    </Suspense>
  );
}

function VerifyEmailComponent() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      toast({
        title: "Invalid Token",
        description: "The verification token is missing",
        variant: "destructive",
      });
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(token);
        if (response.success) {
          setStatus("success");
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified.",
          });
        } else {
          setStatus("error");

          throw new Error(response?.message || "Failed to verify email.");
        }
      } catch (error: any) {
        setStatus("error");
        const message = await ErrorToastResponse(error.response);
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: message || "An unexpected error occurred",
        });
      }
    };

    verifyToken();
  }, [token, toast]);

  return (
    <AuthLayout
      title={
        status === "verifying"
          ? "Verifying Email"
          : status === "success"
            ? "Email Verified"
            : "Verification Failed"
      }
      subtitle={
        status === "verifying"
          ? "Please wait while we verify your email address"
          : status === "success"
            ? "Your email has been successfully verified"
            : "There was an error verifying your email"
      }
      className="w-full max-w-md"
    >
      <div className="text-center">
        {status === "verifying" && (
          <Icons.Spinner className="mx-auto h-12 w-12 animate-spin" />
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <Button
              asChild
              className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
            >
              <Link href="/login">Continue to Login</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/resend-verification-email">
                Resend Verification Email
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
