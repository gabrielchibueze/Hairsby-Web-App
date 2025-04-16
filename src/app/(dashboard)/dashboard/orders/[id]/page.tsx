import { OrderDetails } from "@/components/order/order-details";
import { orderDetailMetadata } from "@/app/metadata";

export const metadata = orderDetailMetadata;

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container py-8">
      <OrderDetails id={params.id} />
    </div>
  );
}
