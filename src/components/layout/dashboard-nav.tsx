"use client";

import Link from "next/link";
import {
  Bell,
  LucideShoppingBasket,
  Menu,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
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
import { useCart } from "../cart/cart-provider";
import { useFavorite } from "../favorite/favorite-provider";
import { NotificationDropdown } from "../notifications/notification-dropdown";
import { ChatSupportDropdown } from "../chat-support/chat-support-dropdown";
import ProfilePhoto from "../general/profile-photo";
import { Avatar } from "../ui/avatar";

interface DashboardNavProps {
  onMenuClick?: () => void;
}

// export function DashboardNav({ onMenuClick }: DashboardNavProps) {
//   const { user, logout } = useAuth();
//   const { cartCount, cartAmount } = useCart();
//   const { favoriteCount } = useFavorite();
//   return (
//     <header className="w-full border-b bg-muted text-foreground shadow-sm">
//       <div className="container flex h-16 items-center px-4">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="lg:hidden text-foreground hover:text-foreground hover:bg-hairsby-orange/40 mr-2"
//           onClick={onMenuClick}
//         >
//           <Menu className="h-5 w-5 " />
//         </Button>

//         <div className="flex flex-1 items-center justify-between">
//           <div className="hidden md:flex items-center">
//             <span className="text-lg font-medium">Hello {user?.firstName}</span>
//           </div>
//           <span></span>

//           <nav className="flex items-center gap-2">
//             <NotificationDropdown />
//             <ChatSupportDropdown />
//             <Link
//               href="/dashboard/cart"
//               className="flex items-center text-gray-white hover:text-hairsby-orange transition-colors duration-200 rounded-sm"
//               title="My Cart"
//             >
//               <div className="relative p-2">
//                 <ShoppingCart size={20} />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-hairsby-orange text-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200">
//                     {cartCount}
//                   </span>
//                 )}
//               </div>
//               <div className="hidden md:block text-left px-2">
//                 <p className="text-xs text-muted-foreground">My Cart</p>
//                 <p className="text-xs font-medium">
//                   £{cartAmount.toFixed(2) || "0.00"}
//                 </p>
//               </div>
//             </Link>
//             {/* <ModeToggle /> */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 {user && <ProfilePhoto user={user} />}
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-56 bg-muted border border-border text-foreground"
//                 align="end"
//                 forceMount
//               >
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {user?.firstName} {user?.lastName}
//                     </p>
//                     <p className="text-xs leading-none text-gray-400 truncate">
//                       {user?.email}
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator className="bg-muted" />
//                 <DropdownMenuItem className="hover:bg-hairsby-orange/40 hover:text-gray-300 focus:bg-hairsby-orange/40">
//                   <Link href="/dashboard/profile" className="w-full">
//                     Profile
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="hover:bg-hairsby-orange/40 hover:text-gray-300 focus:bg-hairsby-orange/40">
//                   <Link href="/dashboard/settings" className="w-full">
//                     Settings
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator className="bg-muted" />
//                 <DropdownMenuItem
//                   className="cursor-pointer hover:bg-red-600 text-red-600 font-bold hover:text-foreground"
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

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { user, logout } = useAuth();
  const { cartCount, cartAmount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b bg-sidebar-background text-sidebar-foreground ">
      <div className="container flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <div className="hidden lg:flex items-center">
            <span className="text-sm font-medium">
              Welcome back, {user?.firstName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <nav className="flex items-center gap-2">
            <NotificationDropdown />
            <ChatSupportDropdown />

            <Link
              href="/dashboard/cart"
              className="flex items-center hover:text-hairsby-orange transition-colors"
              title="My Cart"
            >
              <div className="relative p-2">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left px-2">
                <p className="text-xs text-sidebar-muted">My Cart</p>
                <p className="text-xs font-medium">£{cartAmount.toFixed(2)}</p>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  {user && (
                    <Avatar
                      size="sm"
                      src={user?.photo}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      fallback={
                        <>
                          {user?.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </>
                      }
                      className="cursor-pointer"
                    />
                  )}{" "}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-sidebar-background border-sidebar-border text-sidebar-foreground"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-sidebar-muted">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem
                  className="text-red-600 focus:text-white focus:bg-red-600"
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
