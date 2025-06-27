import { StatusBarChart } from "./status-bar-chart";
import { Card } from "@/components/ui/card";
import { EarningsMetricsResponse } from "@/lib/api/accounts/provider";

interface OverviewTabProps {
  data: EarningsMetricsResponse;
}

export function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Booking Status Distribution */}
      <Card className="p-4 pb-12">
        <StatusBarChart
          data={data.bookingStatusStats}
          title="Booking Status Distribution"
          type="booking"
        />
      </Card>

      {/* Order Status Distribution */}
      <Card className="p-4 pb-12">
        <StatusBarChart
          data={data.orderStatusStats}
          title="Order Status Distribution"
          type="order"
        />
      </Card>
    </div>
  );
}
