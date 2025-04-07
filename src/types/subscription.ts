// src/types/subscription.ts
export interface PlanLimit {
  bookingsPerMonth: number | null;
  specialists: number | null;
  locations: number | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  interval: string;
  features: string[];
  limits: PlanLimit;
}

export interface PlanComparison {
  priceDifference: number;
  pricePercentageDifference: string;
  additionalFeatures: string[];
  missingFeatures: string[];
  commonFeatures: string[];
  bookings: {
    a: number;
    b: number;
    difference: number;
    percentage: string;
  };
  specialists: {
    a: number;
    b: number;
    difference: number;
  };
  locations: {
    a: number;
    b: number;
    difference: number;
  };
  isUpgrade: boolean;
  isDowngrade: boolean;
}
