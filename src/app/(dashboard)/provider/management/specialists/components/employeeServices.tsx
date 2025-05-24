// // components/provider/management/specialists/EmployeeServices.tsx
// import React from "react";
// import { getEmployeeServices } from "@/lib/api/accounts/business";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { DataTable } from "@/app/(dashboard)/dashboard/wallet/transactions-table";
// import { ServiceColumns } from "./serviceColumns";

// interface EmployeeServicesProps {
//   employeeId: string;
// }

// export function EmployeeServices({ employeeId }: EmployeeServicesProps) {
//   const router = useRouter();
//   const {
//     data: services,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["employeeServices", employeeId],
//     queryFn: () => getEmployeeServices(employeeId),
//   });

//   if (isLoading) return <div>Loading services...</div>;
//   if (error) return <div>Error loading services: {error.message}</div>;

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <Button
//           onClick={() =>
//             router.push(
//               `/provider/management/specialists/${employeeId}/services/new`
//             )
//           }
//           className="bg-hairsby-orange hover:bg-orange-500"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Service
//         </Button>
//       </div>
//       <DataTable columns={ServiceColumns} data={services || []} />
//     </div>
//   );
// }

"use client";
import React from "react";
import {
  BusinessEmployee,
  getEmployeeServices,
} from "@/lib/api/accounts/business";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ServiceColumns } from "./serviceColumns";
import { Service } from "@/lib/api/services/service";
import { EmployeeTabsProps } from "./employeeTabs";

interface EmployeeServicesProps {
  employee: any;
  services: Service[];
  isLoading: boolean;
}

export function EmployeeServices({
  employee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();
  // const {
  //   data: services,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["employeeServices", employeeId],
  //   queryFn: () => getEmployeeServices(employeeId),
  // });

  // if (error) return <div>Error loading services: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            router.push(
              `/provider/services/new?${encodeURIComponent(`employeeId=${employee.employee.id}&firstName=${employee.employee.firstName}&lastName=${employee.employee.lastName}`)}`
            )
          }
          className="gap-2"
          variant="brand"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>
      <DataTable
        columns={ServiceColumns}
        data={employee.employee.services || []}
        isLoading={isLoading}
        emptyMessage="No services found"
        searchableColumns={["name", "category"]}
        filterableColumns={[
          {
            id: "isAvailable",
            title: "Availability",
            options: [
              { value: "true", label: "Available" },
              { value: "false", label: "Unavailable" },
            ],
          },
        ]}
      />
    </div>
  );
}
