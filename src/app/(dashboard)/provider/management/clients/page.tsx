"use client";

import React, { useEffect, useState } from "react";
import { getClients } from "@/lib/api/accounts/clients";
import Spinner from "@/components/general/spinner";
import { ClientDashboard } from "./components/clientDashboard";

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getClients(pagination.page, pagination.limit);
        setClients(data.clients);
        setPagination({
          ...pagination,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (err) {
        setError("Failed to load clients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pagination.page, pagination.limit]);

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <ClientDashboard clients={clients} />;
}
