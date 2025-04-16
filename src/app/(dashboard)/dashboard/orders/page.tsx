import { Metadata } from "next";
import OrdersComponent from "./order";
import { orderMetadata } from "@/app/metadata";

export const metadata = orderMetadata;

export default function OrdersPage() {
  return <OrdersComponent />;
}
