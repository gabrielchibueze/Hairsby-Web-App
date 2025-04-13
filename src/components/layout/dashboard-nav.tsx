// "use client";

// import Link from "next/link";
// import { Bell, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useAuth } from "@/lib/contexts/auth.context";
// import { ModeToggle } from "@/components/ui/mode-toggle";

// interface DashboardNavProps {
//   onMenuClick?: () => void;
// }

// export function DashboardNav({ onMenuClick }: DashboardNavProps) {
//   const { user, logout } = useAuth();

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-14 items-center">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="lg:hidden"
//           onClick={onMenuClick}
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//         <div className="mr-4 hidden md:flex">
//           <Link href="/" className="mr-6 flex items-center space-x-2">
//             <span className="hidden font-bold sm:inline-block">
//               {user?.firstName} {user?.lastName}
//             </span>
//           </Link>
//         </div>
//         <div className="flex flex-1 items-center justify-end space-x-4">
//           <nav className="flex items-center space-x-2">
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
//             </Button>
//             <ModeToggle />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="relative h-8 w-8 rounded-full"
//                 >
//                   <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
//                     {user?.firstName[0]}
//                     {user?.lastName[0]}
//                   </span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {user?.firstName} {user?.lastName}
//                     </p>
//                     <p className="text-xs leading-none text-muted-foreground">
//                       {user?.email}
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/dashboard/profile">Profile</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/dashboard/settings">Settings</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   className="cursor-pointer"
//                   onSelect={() => logout()}
//                 >
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/contexts/auth.context";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface DashboardNavProps {
  onMenuClick?: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b bg-hairsby-dark text-white shadow-sm">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:text-white hover:bg-hairsby-orange/40 mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 " />
        </Button>

        <div className="flex flex-1 items-center justify-between">
          <div className="hidden md:flex items-center">
            <span className="text-lg font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <span></span>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-hairsby-orange/40 hover:text-white relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hairsby-orange"></span>
            </Button>

            {/* <ModeToggle /> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full hover:bg-hairsby-orange/40 p-0"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hairsby-orange text-hairsby-dark font-bold">
                    {user?.firstName[0]}
                    {user?.lastName[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-hairsby-dark border border-[#1e293b] text-white"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#1e293b]" />
                <DropdownMenuItem className="hover:bg-hairsby-orange/40 hover:text-gray-300 focus:bg-hairsby-orange/40">
                  <Link href="/dashboard/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-hairsby-orange/40 hover:text-gray-300 focus:bg-hairsby-orange/40">
                  <Link href="/dashboard/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1e293b]" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-400 focus:bg-red-500/20 text-red-500  hover:text-white"
                  onSelect={() => logout()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
