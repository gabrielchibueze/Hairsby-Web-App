"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
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
import { changePassword } from "@/lib/api/accounts/profile";
import { useState } from "react";
import Spinner from "../general/spinner";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export function ChangePasswordForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    try {
      setLoading(true);
      await changePassword(values);
      toast({
        title: "Success",
        description: "Password changed successfully",
        className: "bg-green-500 text-white",
      });
      form.reset();
      setLoading(false);
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to change password. Please try again.",
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
        >
          {loading ? <Spinner /> : null}Change Password
        </Button>
      </form>
    </Form>
  );
}
