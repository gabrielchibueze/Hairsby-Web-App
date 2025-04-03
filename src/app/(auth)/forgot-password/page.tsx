// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
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
import { linkResetPasswordRequest, resetPassword } from "@/lib/api/auths/auth";
import { useToast } from "@/components/ui/use-toast";
import * as Icons from "@/components/icons";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await linkResetPasswordRequest(values.email);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message || "Failed to send reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
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
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset link
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-hairsby-orange hover:text-hairsby-orange/80"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
