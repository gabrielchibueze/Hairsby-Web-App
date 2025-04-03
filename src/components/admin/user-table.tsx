"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers, updateUserStatus } from "@/lib/api/accounts/admin";

export function AdminUserTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", page],
    queryFn: () => getUsers({ page, limit: 10 }),
  });

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      await updateUserStatus(userId, status);
      // Refetch users
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>{format(new Date(user.joinedDate), "PP")}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  user.status === "active" && "bg-green-100 text-green-800",
                  user.status === "suspended" && "bg-red-100 text-red-800"
                )}
              >
                {user.status}
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusChange(
                        user.id,
                        user.status === "active" ? "suspended" : "active"
                      )
                    }
                  >
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/users/${user.id}`}>View Details</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
