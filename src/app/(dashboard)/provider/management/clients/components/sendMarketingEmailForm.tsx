"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/general/spinner";
import {
  bulkSendMarketingEmails,
  sendMarketingEmail,
} from "@/lib/api/accounts/clients";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const formSchema = z.object({
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message is required"),
  offerCode: z.string().optional(),
  expiryDate: z.string().optional(),
});

export function SendMarketingEmailForm({
  onClose,
  onSuccess,
  clientIds,
}: {
  onClose: () => void;
  onSuccess: () => void;
  clientIds?: string[] | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
      offerCode: "",
      expiryDate: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (clientIds && clientIds?.length > 1) {
        await bulkSendMarketingEmails(clientIds, values);
      } else {
        await sendMarketingEmail(clientIds?.[0] as string, values);
      }
      toast({
        title: "Success",
        description: `Marketing email${clientIds && clientIds?.length > 1 ? "s" : ""} sent successfully`,
      });
      onSuccess();
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to send marketing email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email subject"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your message"
                  className="min-h-[150px]"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="offerCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Code (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., SUMMER20"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Select expiry date"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} variant="brand">
            {isLoading ? <Spinner plain={true} size="xs" /> : null}
            Send Email
          </Button>
        </div>
      </form>
    </Form>
  );
}
