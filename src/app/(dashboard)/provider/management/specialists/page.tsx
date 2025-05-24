// app/provider/management/specialists/page.tsx
"use client";

import React from "react";
import { getEmployees } from "@/lib/api/accounts/business";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/general/spinner";
import { EmployeeDashboard } from "./components/employeeDashboard";

export default function BusinessEmployeesPage() {
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["businessEmployees"],
    queryFn: getEmployees,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading employees: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <EmployeeDashboard employees={employees || []} />
    </div>
  );
}
