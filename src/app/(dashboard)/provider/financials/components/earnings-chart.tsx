// app/(provider)/financials/components/earnings-chart.tsx
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface EarningsChartProps {
  data: Array<{
    month: string;
    total: number;
    count: number;
  }>;
}

export function EarningsChart({ data }: EarningsChartProps) {
  const formattedData = data.map((item) => ({
    name: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    earnings: item.total,
    bookings: item.count,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `£${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Earnings
                        </span>
                        <span className="font-bold">
                          £{Number(payload[0].value)?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Bookings
                        </span>
                        <span className="font-bold">
                          {payload[1].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="earnings"
            name="Earnings"
            fill="#F9A000"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="bookings"
            name="Bookings"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}