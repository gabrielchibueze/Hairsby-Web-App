"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, User, Copy, ArrowRight, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getReferrals,
  getReferralLink,
  getReferralRewards,
} from "@/lib/api/accounts/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth.context";

interface Referral {
  id: string;
  referred: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  reward: number;
}

export function ReferralProgram() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [link, setLink] = useState("");
  const [rewards, setRewards] = useState({
    totalRewards: 0,
    totalReferrals: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const [
          { referrals, stats },
          { referralLink },
          { totalRewards, totalReferrals },
        ] = await Promise.all([
          getReferrals(),
          getReferralLink(),
          getReferralRewards(),
        ]);
        setReferrals(referrals);
        setLink(referralLink);
        setRewards({ totalRewards, totalReferrals });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load referral data",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, [toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <Card className="border-hairsby-orange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-6 w-6" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Your Referral Code
            </h3>
            <p className="text-2xl font-bold">
              {user?.referralCode || "------"}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Referrals
            </h3>
            <p className="text-2xl font-bold">
              {loading ? "--" : rewards.totalReferrals}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Rewards
            </h3>
            <div className="flex items-center gap-1">
              <Coins className="h-5 w-5 text-yellow-500" />
              <p className="text-2xl font-bold">
                ${loading ? "--" : rewards.totalRewards.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Your Referral Link</h3>
          <div className="flex gap-2">
            <Input value={link} readOnly className="flex-1" />
            <Button
              onClick={copyToClipboard}
              className="bg-hairsby-orange hover:bg-hairsby-orange/90"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Earn $10 for each friend who signs up using your link and makes
            their first booking
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Your Referrals</h3>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : referrals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <User className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No referrals yet</h3>
              <p className="text-sm text-muted-foreground">
                Share your link to start earning rewards
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {referral.referred.firstName}{" "}
                        {referral.referred.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {referral.referred.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        referral.status === "completed" ? "success" : "outline"
                      }
                    >
                      {referral.status === "completed" ? "Earned" : "Pending"}
                    </Badge>
                    <div className="flex items-center gap-1 font-medium">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span>${referral.reward.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
