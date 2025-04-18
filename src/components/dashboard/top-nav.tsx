"use client";

import { usePathname } from "next/navigation";
import { Bell, HelpCircle, Search, Settings, Store, Truck } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

export function TopNav() {
  const pathname = usePathname();
  const isShopkeeper = pathname.includes("/shopkeeper");
  const isManufacturer = pathname.includes("/manufacturer");

  return (
    <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:px-6">
      <div className="hidden lg:block">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {isShopkeeper ? (
            <>
              <Store className="h-5 w-5 text-emerald-500" />
              <span>Shopkeeper Dashboard</span>
            </>
          ) : (
            <>
              <Truck className="h-5 w-5 text-emerald-500" />
              <span>Manufacturer Dashboard</span>
            </>
          )}
        </div>
      </div>
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <form>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-8 w-8 rounded-full"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-medium text-white">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid gap-1">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start">
                  <div className="text-sm font-medium">
                    {isShopkeeper
                      ? `New inventory alert: Item #${i}00 is low`
                      : `Retailer #${i}00 placed a new order`}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {i * 10} minutes ago
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-emerald-100"
            >
              <span className="text-sm font-medium text-emerald-700">
                {isShopkeeper ? "S" : "M"}
              </span>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
