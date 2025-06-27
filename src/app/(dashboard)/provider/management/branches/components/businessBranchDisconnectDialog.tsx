// @/app/provider/management/branches/components/businessBranchDisconnectDialog.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import Spinner from "@/components/general/spinner";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import { useAuth } from "@/lib/contexts/auth.context";
import { BusinessBranch } from "@/lib/api/accounts/company";
import { deleteBranch } from "@/lib/api/accounts/company";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  reason: z.string().min(5, "Reason is required"),
});

export function BusinessBranchDisconnectDialog({
  variant = "default",
  children,
  open,
  setOpenDisconnectDialog,
  id,
  businessBranch,
}: {
  variant?: "default" | "outline";
  children?: React.ReactNode;
  open?: boolean;
  setOpenDisconnectDialog?: any;
  id: string;
  businessBranch?: BusinessBranch;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>("");
  const [branchName, setBranchName] = useState<string | null>("");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await deleteBranch(id, values.reason);

      toast({
        title: "Success",
        description: "Branch suspended successfully",
        className: "bg-green-500 text-primary-foreground",
      });
      setOpenDisconnectDialog(false);
      setIsLoading(false);
      router.push("/provider/management/branches");
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to suspend branch",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessBranch) {
      const businessName =
        businessBranch.parentBusiness.businessName ||
        `${businessBranch.parentBusiness.firstName} ${businessBranch.parentBusiness.lastName}`;
      setBusinessName(businessName);
      setBranchName(businessBranch.branchName);
    }
  }, [businessBranch]);

  return (
    <Dialog open={open} onOpenChange={setOpenDisconnectDialog}>
      <DialogContent className="max-w-[90vw] sm:max-w-[525px] min-h-[200px]">
        <DialogHeader>
          <DialogTitle>
            Suspend {branchName} branch of {businessName}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to suspend this branch location?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="Reason for suspension"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-3 flex-row justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDisconnectDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} variant="destructive">
                {isLoading ? <Spinner plain={true} size="xs" /> : null}
                Suspend Branch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
