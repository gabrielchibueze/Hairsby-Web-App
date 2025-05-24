"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useToast } from "@/components/ui/use-toast";
import * as Icons from "@/components/general/icons";
import { PasswordInput } from "@/components/general/password-input";
import { linkResetPassword, linkVerifyResetToken } from "@/lib/api/auths/auth";
import { useRouter } from "next/navigation";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import Spinner from "@/components/general/spinner";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <ResetPasswordComponent />
    </Suspense>
  );
}

function ResetPasswordComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast({
          title: "Invalid Token",
          description: "The reset token is missing or invalid",
          variant: "destructive",
        });
        router.push("/forgot-password");
        return;
      }

      try {
        setIsLoading(true);
        const response = await linkVerifyResetToken(token);

        if (response.success) {
          setTokenValid(true);
          setEmail(response.data.email);
          toast({
            title: "Token Verified",
            description: "You can now set a new password",
          });
        } else {
          throw new Error(response?.message || "Token verification failed");
        }
      } catch (error: any) {
        const message = await ErrorToastResponse(error.response);

        toast({
          variant: "destructive",
          title: "Error",
          description: message || "An unexpected error occurred",
        });
        router.push("/forgot-password");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token || !email) return;

    try {
      setIsLoading(true);
      const response = await linkResetPassword({
        email,
        newPassword: values.newPassword,
        token,
      });

      if (response.success) {
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
        router.push("/login");
      } else {
        throw new Error(response.message || "Password reset failed");
      }
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!tokenValid) {
    return (
      <AuthLayout
        title="Reset Password"
        subtitle="Validating your reset token..."
        className="w-full max-w-md"
      >
        <div className="text-center py-8">
          <Icons.Spinner className="mx-auto h-8 w-8 animate-spin text-hairsby-orange" />
          <p className="mt-4 text-sm text-gray-600">
            Please wait while we verify your reset link...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
      className="w-full max-w-md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter new password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
