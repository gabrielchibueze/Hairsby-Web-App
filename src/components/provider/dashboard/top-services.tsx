// components/provider/dashboard/top-services.tsx
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/contexts/auth.context";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface TopService {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
}

interface TopServicesProps {
  services: TopService[];
  loading: boolean;
}

export function TopServices({ services, loading = false }: TopServicesProps) {
  const { user } = useAuth();
  // Calculate max revenue for percentage calculation
  const maxRevenue = Math.max(...services.map((s) => s.revenue), 1);
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-between flex-col gap-4 sm:py-12">
        <p>You dont have any services yet.</p>
        <Link href="/provider/services">
          <Button variant="brand">Create Service</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{service.name}</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(service.revenue.toFixed(2), user?.currency!)} (
              {service.bookings} bookings)
            </span>
          </div>
          <Progress
            value={(service.revenue / maxRevenue) * 100}
            className="h-2"
            indicatorClassName="bg-hairsby-orange"
          />
        </div>
      ))}
    </div>
  );
}
