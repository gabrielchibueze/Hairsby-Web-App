"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface RevenueChartProps {
  data: Array<{
    date: string
    revenue: number
    payouts: number
  }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
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
                  <Card>
                    <CardContent className="p-2">
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <div className="w-full space-y-1">
                            <p className="text-sm font-medium">Revenue</p>
                            <p className="text-sm text-muted-foreground">
                              £ {payload[0].value}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full space-y-1">
                            <p className="text-sm font-medium">Payouts</p>
                            <p className="text-sm text-muted-foreground">
                              £{payload[1].value}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="payouts"
            stroke="#f43f5e"
            strokeWidth={2}
            dot={false}
            name="Payouts"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}