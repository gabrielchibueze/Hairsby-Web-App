"use client";

import { Booking } from "@/lib/api/services/booking";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface BookingFiltersProps {
  bookings: Booking[];
  onFilterChange: (filteredBookings: Booking[]) => void;
}

export function BookingFilters({
  bookings,
  onFilterChange,
}: BookingFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const filtered = bookings?.filter((booking) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        (booking.customer?.firstName &&
          booking.customer?.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (booking.customer?.lastName &&
          booking.customer.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        booking.items.some((s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      // Date filter
      const bookingDate = new Date(booking.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" &&
          bookingDate.toDateString() === today.toDateString()) ||
        (dateFilter === "upcoming" && bookingDate >= today) ||
        (dateFilter === "past" && bookingDate < today);

      return matchesSearch && matchesStatus && matchesDate;
    });

    onFilterChange(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter, onFilterChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="Search by customer or service..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="no-show">No Show</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="past">Past</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
