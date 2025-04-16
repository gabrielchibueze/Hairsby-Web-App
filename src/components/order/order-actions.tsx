"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/api/products/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/lib/api/products/order";
import { toast } from "@/components/ui/use-toast";

export function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelOrder(order.id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
    },
  });

  const handleCancel = () => {
    const reason = prompt("Please enter the reason for cancellation:");
    if (reason) {
      cancelMutation.mutate(reason);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {order.status === "processing" && (
        <Button variant="outline" onClick={handleCancel}>
          Cancel Order
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => router.push(`/products`)}>
            Shop Again
          </DropdownMenuItem>
          {order.trackingNumber && (
            <DropdownMenuItem
              onClick={() =>
                window.open(
                  `https://tracking.example.com/?tracking=${order.trackingNumber}`,
                  "_blank"
                )
              }
            >
              Track Package
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
