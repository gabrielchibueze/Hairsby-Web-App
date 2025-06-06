"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  getPaymentSettings,
  getStripeAccountStatus,
  updatePaymentSettings,
  connectStripeAccount,
  getStripeDashboardLink,
  disconnectStripeAccount,
} from "@/lib/api/accounts/provider";
import { useAuth } from "@/lib/contexts/auth.context";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";

const paymentSettingsSchema = z.object({
  acceptOnlinePayments: z.boolean(),
  paymentType: z.enum(["full", "partial"]),
  partialPaymentPercentage: z.number().min(1).max(100).optional(),
  escrowEnabled: z.boolean(),
  escrowReleaseDays: z.number().min(0),
  paymentMethods: z.array(z.string()),
});

export function PaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<{
    status: "not_connected" | "pending" | "active";
    details_submitted?: boolean;
    payouts_enabled?: boolean;
    requirements?: any;
    dashboardUrl?: string;
  }>({ status: "not_connected" });
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      acceptOnlinePayments: false,
      paymentType: "full",
      partialPaymentPercentage: 50,
      escrowEnabled: true,
      escrowReleaseDays: 1,
      paymentMethods: ["card", "cash"],
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getPaymentSettings();
        if (settings) {
          form.reset(settings);
          if (settings.stripeAccountId) {
            const status = await getStripeAccountStatus();
            setStripeStatus({
              status: status.details_submitted ? "active" : "pending",
              ...status,
            });
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load payment settings",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [form, toast]);

  const handleConnectStripe = async () => {
    try {
      setConnecting(true);
      const { url } = await connectStripeAccount();
      window.location.href = url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to connect Stripe account",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectStripe = async () => {
    try {
      setDisconnecting(true);
      await disconnectStripeAccount();
      setStripeStatus({ status: "not_connected" });
      form.setValue("acceptOnlinePayments", false);
      toast({
        title: "Success",
        description: "Stripe account disconnected successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to disconnect Stripe account",
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleOpenDashboard = async () => {
    try {
      const { url } = await getStripeDashboardLink();
      window.open(url, "_blank");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to open Stripe dashboard",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof paymentSettingsSchema>) => {
    try {
      await updatePaymentSettings(values);
      toast({
        title: "Success",
        description: "Payment settings updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment settings",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
          <CardDescription>
            Configure how you accept payments from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="acceptOnlinePayments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Accept Online Payments
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Enable to accept credit/debit card payments
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!stripeStatus.details_submitted}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("acceptOnlinePayments") && (
                  <>
                    <div className="border rounded-lg p-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="paymentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Type</FormLabel>
                            <div className="flex gap-4">
                              <Button
                                type="button"
                                variant={
                                  field.value === "full" ? "default" : "outline"
                                }
                                onClick={() => field.onChange("full")}
                              >
                                Full Payment
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  field.value === "partial"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => field.onChange("partial")}
                              >
                                Partial Payment
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("paymentType") === "partial" && (
                        <FormField
                          control={form.control}
                          name="partialPaymentPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deposit Percentage</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="100"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="border rounded-lg p-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="escrowEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Escrow Payments
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Hold payments until service is completed
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("escrowEnabled") && (
                        <FormField
                          control={form.control}
                          name="escrowReleaseDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Escrow Release Period</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <p className="text-sm text-muted-foreground">
                                Number of days after service completion to
                                release payment
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-hairsby-orange hover:bg-hairsby-orange/90"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration</CardTitle>
          <CardDescription>
            Connect your Stripe account to receive payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Stripe Account</p>
              <p className="text-sm text-muted-foreground">
                {stripeStatus.status === "not_connected"
                  ? "Not connected"
                  : stripeStatus.status === "pending"
                    ? "Pending verification"
                    : "Connected and verified"}
              </p>
            </div>
            <div className="flex gap-2">
              {stripeStatus.status === "not_connected" ? (
                <Button
                  onClick={handleConnectStripe}
                  disabled={connecting}
                  className="bg-hairsby-orange hover:bg-hairsby-orange/90"
                >
                  {connecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Connect Stripe"
                  )}
                </Button>
              ) : stripeStatus.status === "pending" ? (
                <Button
                  onClick={handleConnectStripe}
                  disabled={connecting}
                  className="bg-hairsby-orange hover:bg-hairsby-orange/90"
                >
                  {connecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleOpenDashboard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <span>Dashboard</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleDisconnectStripe}
                    disabled={disconnecting}
                    variant="destructive"
                  >
                    {disconnecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {stripeStatus.status !== "not_connected" && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      stripeStatus.status === "active" ? "default" : "secondary"
                    }
                  >
                    {stripeStatus.status === "active"
                      ? "Active"
                      : "Pending Verification"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payouts</p>
                  <Badge
                    variant={
                      stripeStatus.payouts_enabled ? "default" : "secondary"
                    }
                  >
                    {stripeStatus.payouts_enabled ? "Enabled" : "Not Enabled"}
                  </Badge>
                </div>
              </div>

              {stripeStatus.requirements?.currently_due?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-600">
                    Action Required
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5">
                    {stripeStatus.requirements.currently_due.map(
                      (requirement: any, index: number) => (
                        <li key={index}>{requirement}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Account ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {user?.stripeAccountId}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
