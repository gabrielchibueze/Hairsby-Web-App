// // components/provider/management/specialists/EmployeeProducts.tsx
// import React from "react";
// import { getEmployeeProducts } from "@/lib/api/accounts/business";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { DataTable } from "@/app/(dashboard)/dashboard/wallet/transactions-table";
// import { productColumns } from "./productColumns";

// interface EmployeeProductsProps {
//   employeeId: string;
// }

// export function EmployeeProducts({ employeeId }: EmployeeProductsProps) {
//   const router = useRouter();
//   const {
//     data: products,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["employeeProducts", employeeId],
//     queryFn: () => getEmployeeProducts(employeeId),
//   });

//   if (isLoading) return <div>Loading products...</div>;
//   if (error) return <div>Error loading products: {error.message}</div>;

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <Button
//           onClick={() =>
//             router.push(
//               `/provider/management/specialists/${employeeId}/products/new`
//             )
//           }
//           className="bg-hairsby-orange hover:bg-orange-500"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Product
//         </Button>
//       </div>
//       <DataTable columns={productColumns} data={products || []} />
//     </div>
//   );
// }

"use client";
import React from "react";
import { getEmployeeProducts } from "@/lib/api/accounts/business";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { productColumns } from "./productColumns";
import { Product } from "@/lib/api/products/product";
import { EmployeeTabsProps } from "./employeeTabs";

interface EmployeeProductsProps {
  products: Product[];
  isLoading: boolean;
  employeeId?: string;
  employee: any;
}

export function EmployeeProducts({
  employee,
  isLoading,
  modeAndCreateFunction,
}: EmployeeTabsProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            router.push(
              `/provider/products/new?employeeId=${employee.employee.id}&firstName=${employee.employee.firstName}&lastName=${employee.employee.lastName}`
            )
          }
          className="gap-2"
          variant="brand"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>
      <DataTable
        columns={productColumns}
        data={employee.employee.products || []}
        isLoading={isLoading}
        emptyMessage="No products found"
        searchableColumns={["name", "category"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "out_of_stock", label: "Out of Stock" },
            ],
          },
        ]}
      />
    </div>
  );
}
