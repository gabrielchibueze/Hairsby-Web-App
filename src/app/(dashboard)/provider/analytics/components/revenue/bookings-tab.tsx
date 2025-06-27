import { Card } from "@/components/ui/card";
import {
  EarningsMetricsResponse,
  TopPerformer,
} from "@/lib/api/accounts/provider";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { useRouter } from "next/navigation";
import { areaCurrencyFormat } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth.context";

const CHART_COLORS = {
  primary: "#4f46e5",
  secondary: "#10b981",
};

export function BookingsTab({ data }: { data: EarningsMetricsResponse }) {
  const router = useRouter();
  const { user } = useAuth();
  const bookingTrendData = data.trends.bookings.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    bookings: item.count || 0,
    bookingRevenue: item.amount || 0,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Booking Trends */}
      <Card className="p-4 pb-12">
        <div className="h-[350px]">
          <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bookingTrendData}
              margin={{ top: 20, right: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 12,
                  fill: "var(--foreground)",
                }}
                stroke="var(--foreground)"
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{
                  fontSize: 12,
                  fill: "var(--foreground)",
                }}
                stroke="var(--foreground)"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{
                  fontSize: 12,
                  fill: "var(--foreground)",
                }}
                stroke="var(--foreground)"
                tickFormatter={(value) =>
                  `${areaCurrencyFormat(user?.currency!)}${value.toLocaleString()}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="bookings"
                name="Bookings"
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="bookingRevenue"
                name="Revenue"
                fill={CHART_COLORS.secondary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Performing Services */}
      <Card className="p-4 pb-12">
        <div className="h-[350px]">
          <h3 className="text-lg font-semibold mb-4">
            Top Performing Services
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topPerformers.services}
              layout="vertical"
              margin={{ top: 20, right: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                tick={{
                  fontSize: 12,
                  fill: "var(--foreground)",
                }}
                stroke="var(--foreground)"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{
                  fontSize: 12,
                  fill: "var(--foreground)",
                }}
                stroke="var(--foreground)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="booking_count"
                name="Bookings"
                fill={CHART_COLORS.primary}
                radius={[0, 4, 4, 0]}
                style={{ cursor: "pointer" }}
                onClick={(data: TopPerformer) =>
                  router.push(`/provider/services/${data.id}`)
                }
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={CHART_COLORS.secondary}
                radius={[0, 4, 4, 0]}
                onClick={(data: TopPerformer) =>
                  router.push(`/provider/services/${data.id}`)
                }
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
