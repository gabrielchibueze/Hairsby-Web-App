import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  currency?: string;
  payload?: any;
}
export const CustomTooltip = ({
  active,
  payload,
  label,
  currency = "£",
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="p-4 rounded-lg border shadow-sm"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      <p className="font-semibold mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}: </span>
            <span className="font-medium ml-1">
              {item.name.toLowerCase().includes("revenue")
                ? `${currency}${Number(item.value).toFixed(2)}`
                : Number(item.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
