// // components/provider/management/specialists/EmployeeDashboard.tsx
// "use client";
// import React, { useCallback, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import type { BusinessEmployee } from "@/lib/api/accounts/business";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { DataTable } from "@/app/(dashboard)/dashboard/wallet/transactions-table";
// import { employeeColumns } from "./employeeColums";
// import { InviteEmployeeForm } from "./InviteEmployeeForm";
// import { useRouter } from "next/navigation";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface EmployeeDashboardProps {
//   employees: BusinessEmployee[];
// }

// export function EmployeeDashboard({ employees }: EmployeeDashboardProps) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const router = useRouter();
//   const toggleDialog = useCallback(() => {
//     setIsDialogOpen((prev) => !prev);
//   }, []);

//   const handleFormSuccess = useCallback(() => {
//     setIsDialogOpen(false);
//     // Consider adding a refresh here if you need to update the employee list
//     router.refresh();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Team Management</h2>
//           <p className="text-muted-foreground">
//             Manage your specialists and their permissions
//           </p>
//         </div>
//         <Button onClick={toggleDialog} variant="brand">
//           <Plus className="mr-2 h-4 w-4" />
//           Invite Specialist
//         </Button>
//       </div>

//       <div className="rounded-md border bg-white">
//         <DataTable
//           columns={employeeColumns}
//           data={employees}
//           emptyMessage="No specialists found"
//         />
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
//         <DialogContent className="max-w-[90vw] sm:max-w-[725px] sm:mx-0">
//           <DialogHeader>
//             <DialogTitle>Onboard a new Specialist</DialogTitle>
//           </DialogHeader>
//           <ScrollArea className="max-h-[500px] ">
//             <InviteEmployeeForm
//               onClose={toggleDialog}
//               onSuccess={handleFormSuccess}
//             />
//           </ScrollArea>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BusinessEmployee } from "@/lib/api/accounts/business";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { employeeColumns } from "./employeeColums";
import { InviteEmployeeForm } from "./InviteEmployeeForm";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/ui/data-table";

interface EmployeeDashboardProps {
  employees: BusinessEmployee[];
}

export function EmployeeDashboard({ employees }: EmployeeDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const toggleDialog = useCallback(() => {
    setIsDialogOpen((prev) => !prev);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setIsDialogOpen(false);
    router.refresh();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your specialists and their permissions
          </p>
        </div>
        <Button onClick={toggleDialog} className="gap-2" variant="brand">
          <Plus className="h-4 w-4" />
          Invite Specialist
        </Button>
      </div>

      <DataTable
        columns={employeeColumns}
        data={employees}
        emptyMessage="No specialists found"
        searchableColumns={["employee"]}
        filterableColumns={[
          {
            id: "role",
            title: "Role",
            options: [
              { value: "admin", label: "Admin" },
              { value: "specialist", label: "Specialist" },
            ],
          },
          {
            id: "employmentStatus",
            title: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "on_leave", label: "On Leave" },
              { value: "terminated", label: "Terminated" },
            ],
          },
        ]}
        dateRangeColumn="joinedAt"
      />

      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogContent className="max-w-[90vw] sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Onboard a new Specialist</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-200px)]">
            <InviteEmployeeForm
              onClose={toggleDialog}
              onSuccess={handleFormSuccess}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
