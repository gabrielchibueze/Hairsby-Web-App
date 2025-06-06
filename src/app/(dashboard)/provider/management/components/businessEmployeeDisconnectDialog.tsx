"use client";

import { useState, useEffect } from "react";
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
import {
  BusinessEmployee,
  disconnectFromBusiness,
  terminateEmployee,
} from "@/lib/api/accounts/business";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  reason: z.string().min(5, "Reason is required"),
});

export function BusinessEmployeeDisconnectDialog({
  variant = "default",
  children,
  open,
  setOpenDisconnectDialog,
  id,
  businessEmployee,
}: {
  variant?: "default" | "outline";
  children?: React.ReactNode;
  open?: boolean;
  setOpenDisconnectDialog?: any;
  id: string;
  businessEmployee?: BusinessEmployee;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>("");
  const [specialistName, setSpecialistName] = useState<string | null>("");
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const isBusiness = user?.role === "business";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (isBusiness) {
        await terminateEmployee(id, values.reason);
      } else {
        await disconnectFromBusiness(id, values.reason);
      }

      toast({
        title: "Success",
        description: isBusiness
          ? "Specialist terminated successfully"
          : "Disconnected from organisation successfully",
        className: "bg-green-500 text-primary-foreground",
      });
      setOpenDisconnectDialog(false);
      setIsLoading(false);
      router.push(
        `/provider/management/${isBusiness ? "specialists" : "organisations"}`
      );
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          message ||
          (isBusiness
            ? "Failed to terminate specialist"
            : "Failed to disconnect from organisation"),
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessEmployee) {
      const businessName =
        businessEmployee.business?.businessName ||
        `${businessEmployee.business.firstName} ${businessEmployee.business.lastName}`;
      const specialistName = `${businessEmployee.employee.firstName} ${businessEmployee.employee.lastName}`;
      setSpecialistName(specialistName);
      setBusinessName(businessName);
    }
  }, [businessEmployee]);

  return (
    <Dialog open={open} onOpenChange={setOpenDisconnectDialog}>
      <DialogContent className="max-w-[90vw] sm:max-w-[525px] min-h-[200px]">
        <DialogHeader>
          <DialogTitle>
            {isBusiness
              ? `Terminate ${specialistName} from ${businessName}`
              : `Disconnect from ${businessName}`}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to{" "}
            {isBusiness
              ? `terminate this specialist from your business?`
              : `disconnect from this organisation?`}
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
                      placeholder={
                        isBusiness
                          ? "Reason for termination"
                          : "Reason for disconnecting"
                      }
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
              <Button
                type="submit"
                disabled={isLoading}
                variant={isBusiness ? "destructive" : "brand"}
              >
                {isLoading ? <Spinner plain={true} size="xs" /> : null}
                {isBusiness ? "Terminate" : "Disconnect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
