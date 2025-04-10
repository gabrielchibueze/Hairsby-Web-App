"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { getAppointments } from "@/lib/api/service/appointments";
import { cn } from "@/lib/utils";
import { getBookings } from "@/lib/api/services/booking";

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", selectedDate, statusFilter],
    queryFn: () => getBookings({ status: statusFilter }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past appointments
          </p>
        </div>
        <Button asChild>
          <a href="/services">Book New Appointment</a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* Filters & Calendar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Appointments Grid */}
          <div className="grid gap-4">
            {appointments.map((appointment: any, index: number) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {appointment.service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.provider.businessName}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        {format(
                          new Date(`${appointment.date}T${appointment.time}`),
                          "PPp"
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          appointment.status === "confirmed" &&
                            "bg-green-100 text-green-800",
                          appointment.status === "cancelled" &&
                            "bg-red-100 text-red-800",
                          appointment.status === "completed" &&
                            "bg-blue-100 text-blue-800"
                        )}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/dashboard/appointments/${appointment.id}`}>
                            View Details
                          </a>
                        </Button>
                        {appointment.status === "confirmed" && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`/dashboard/appointments/${appointment.id}/reschedule`}
                            >
                              Reschedule
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
