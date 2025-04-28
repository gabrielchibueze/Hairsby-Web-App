// "use client";

// import { Order } from "@/lib/api/products/order";
// import { Input } from "@/components/ui/input";
// import { useState, useEffect } from "react";

// interface SearchFilterProps {
//   orders: Order[];
//   onFilterChange: (filteredOrders: Order[]) => void;
// }

// export function SearchFilter({ orders, onFilterChange }: SearchFilterProps) {
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const filtered = orders?.filter((order) => {
//       return (
//         searchTerm === "" ||
//         order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (order.customer?.firstName &&
//           order.customer.firstName
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//         (order.customer?.lastName &&
//           order.customer.lastName
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//         order.items.some((item) =>
//           item.name.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     });

//     onFilterChange(filtered);
//   }, [orders, searchTerm, onFilterChange]);

//   return (
//     <Input
//       placeholder="Search orders..."
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       className="max-w-sm"
//     />
//   );
// }

"use client";

import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  return (
    <Input
      placeholder="Search orders..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  );
}
