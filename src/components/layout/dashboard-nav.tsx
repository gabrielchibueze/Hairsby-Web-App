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

interface DashboardNavProps {
  onMenuClick?: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { favoriteCount } = useFavorite();
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
              title="My Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hairsby-orange"></span>
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-hairsby-orange/40 hover:text-white relative"
              title="My Cart"
            >
              <Link href="/dashboard/cart">
                <LucideShoppingBasket className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hairsby-orange"></span>
              </Link>
            </Button> */}

            <Link
              href="/dashboard/cart"
              className="flex items-center text-gray-white hover:text-hairsby-orange hover:bg-hairsby-orange/40 transition-colors duration-200 rounded-sm"
              title="My Cart"
            >
              <div className="relative p-2">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left px-2">
                <p className="text-xs text-gray-100">My Cart</p>
                <p className="text-xs font-medium">£0.00</p>
              </div>
            </Link>
            {/* <ModeToggle /> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full hover:bg-hairsby-orange/40 p-0"
                  title="My Profile"
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
                  className="cursor-pointer hover:bg-red-600 text-red-600 font-bold hover:text-white"
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
