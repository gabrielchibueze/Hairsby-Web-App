"use client";

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

const CHART_COLORS = {
  primary: "#4f46e5",
  secondary: "#10b981",
  accent: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gray: "#6b7280",
};

const statusColors = {
  pending: CHART_COLORS.accent,
  confirmed: CHART_COLORS.info,
  completed: CHART_COLORS.secondary,
  cancelled: CHART_COLORS.danger,
  "no-show": CHART_COLORS.gray,
  processing: CHART_COLORS.accent,
  shipped: CHART_COLORS.info,
  delivered: CHART_COLORS.secondary,
  pickedup: "#8b5cf6",
  refunded: CHART_COLORS.danger,
};

interface StatusBarChartProps {
  data: Array<{
    status: string;
    count: number | string;
    totalAmount: number | string;
  }>;
  title: string;
  type: "booking" | "order";
}

export function StatusBarChart({ data, title, type }: StatusBarChartProps) {
  // Convert string numbers to numbers for the chart
  const chartData = data.map((item) => ({
    ...item,
    count: typeof item.count === "string" ? parseInt(item.count) : item.count,
    totalAmount:
      typeof item.totalAmount === "string"
        ? parseFloat(item.totalAmount)
        : item.totalAmount,
  }));

  return (
    <div className="h-[350px]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
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
            dataKey="status"
            type="category"
            width={80}
            tick={{
              fontSize: 12,
              fill: "var(--foreground)",
            }}
            stroke="var(--foreground)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="count"
            name="Count"
            fill={CHART_COLORS.primary}
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="totalAmount"
            name="Revenue"
            fill={CHART_COLORS.secondary}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
