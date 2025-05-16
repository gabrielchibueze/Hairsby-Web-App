"use client";

import { Order } from "@/lib/api/products/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

export function OrderTable({
  orders,
  onEditOrder,
  onViewDetails,
}: OrderTableProps) {
  const router = useRouter();

  const handleStatusChange = async (orderId: string, status: string) => {
    // Implement status change logic
    console.log(`Changing order ${orderId} to ${status}`);
    router.refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="w-[120px]">Order Code</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id} className="hover:bg-background">
              <TableCell className="font-medium">{order.orderCode}</TableCell>
              <TableCell>
                {format(new Date(order.createdAt || new Date()), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {order.customer?.firstName} {order.customer?.lastName}
              </TableCell>
              <TableCell>{order.items?.length}</TableCell>
              <TableCell className="text-right">
                £{Number(order.totalAmount).toFixed(2)}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                <OrderStatusBadge paymentStatus={order.paymentStatus} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {(order.status === "pending" ||
                      order.status === "processing") && (
                      <DropdownMenuItem onClick={() => onEditOrder(order)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {order.status === "pending" && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "processing")
                          }
                        >
                          Process Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "cancelled")
                          }
                          className="text-red-600"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      </>
                    )}
                    {order.status === "processing" && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "shipped")
                          }
                        >
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "cancelled")
                          }
                          className="text-red-600"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      </>
                    )}
                    {order.status === "shipped" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(order.id, "delivered")
                        }
                      >
                        Mark as Delivered
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
