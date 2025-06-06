"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  initiateStripeOAuth,
  getStripeDashboardLink,
} from "@/lib/api/accounts/provider";

export function ConnectStripeButton({
  stripeStatus,
  onStatusChange,
}: {
  stripeStatus: "not_connected" | "pending" | "active";
  onStatusChange: (status: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { url } = await initiateStripeOAuth();
      window.location.href = url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to connect Stripe account",
      });
      setLoading(false);
    }
  };

  const handleOpenDashboard = async () => {
    try {
      setLoading(true);
      const { url } = await getStripeDashboardLink();
      window.open(url, "_blank");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to open Stripe dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {stripeStatus === "not_connected" ? (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="bg-hairsby-orange hover:bg-hairsby-orange/90"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Connect Stripe"
          )}
        </Button>
      ) : stripeStatus === "pending" ? (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="bg-hairsby-orange hover:bg-hairsby-orange/90"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Complete Setup"
          )}
        </Button>
      ) : (
        <Button
          onClick={handleOpenDashboard}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <span>Dashboard</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
