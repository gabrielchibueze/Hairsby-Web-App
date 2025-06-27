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

export function OrdersTab({ data }: { data: EarningsMetricsResponse }) {
  const { user } = useAuth();
  const router = useRouter();
  const orderTrendData = data.trends.orders.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    orders: item.count || 0,
    orderRevenue: item.amount || 0,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Order Trends */}
      <Card className="p-4 pb-12">
        <div className="h-[350px]">
          <h3 className="text-lg font-semibold mb-4">Order Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orderTrendData}
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
                dataKey="orders"
                name="Orders"
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="orderRevenue"
                name="Revenue"
                fill={CHART_COLORS.secondary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Selling Products */}
      <Card className="p-4 pb-12">
        <div className="h-[350px]">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topPerformers.products}
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
                dataKey="order_count"
                name="Orders"
                fill={CHART_COLORS.primary}
                radius={[0, 4, 4, 0]}
                onClick={(data: TopPerformer) =>
                  router.push(`/provider/products/${data.id}`)
                }
                style={{ cursor: "pointer" }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={CHART_COLORS.secondary}
                radius={[0, 4, 4, 0]}
                onClick={(data: TopPerformer) =>
                  router.push(`/provider/products/${data.id}`)
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
