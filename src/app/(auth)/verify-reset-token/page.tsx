// app/verify-reset-token/page.tsx for using 6 digit token to change password
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { verifyResetToken, changePassword } from "@/lib/api/auths/auth";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const tokenFormSchema = z.object({
  token: z.string().min(6, {
    message: "Token must be 6 characters",
  }),
});

const passwordFormSchema = z
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

export default function VerifyResetTokenPage() {
  const [step, setStep] = useState<"token" | "password">("token");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const tokenForm = useForm<z.infer<typeof tokenFormSchema>>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      token: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleTokenSubmit = async (values: z.infer<typeof tokenFormSchema>) => {
    try {
      setIsLoading(true);
      // You might need to get the email from somewhere (localStorage, query params, etc.)
      const response = await verifyResetToken(email, values.token);

      if (response.success) {
        setToken(values.token);
        setStep("password");
      }
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Invalid token. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (
    values: z.infer<typeof passwordFormSchema>
  ) => {
    try {
      setIsLoading(true);
      await changePassword({
        email,
        newPassword: values.newPassword,
        token,
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      router.push("/login");
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        step === "token" ? "Enter Verification Code" : "Create New Password"
      }
      subtitle={
        step === "token"
          ? "Enter the 6-digit code sent to your email"
          : "Create a strong new password for your account"
      }
      className="w-full max-w-md"
    >
      {step === "token" ? (
        <Form {...tokenForm}>
          <form
            onSubmit={tokenForm.handleSubmit(handleTokenSubmit)}
            className="space-y-4"
          >
            <FormField
              control={tokenForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" maxLength={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              variant="brand"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify Code
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              variant="brand"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}
