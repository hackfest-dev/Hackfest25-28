"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
} from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isShopkeeper = pathname.includes("/shopkeeper")
  const isManufacturer = pathname.includes("/manufacturer")

  const commonItems = [
    {
      title: "Dashboard",
      href: isShopkeeper ? "/dashboard/shopkeeper" : "/dashboard/manufacturer",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      href: isShopkeeper ? "/dashboard/shopkeeper/analytics" : "/dashboard/manufacturer/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: isShopkeeper ? "/dashboard/shopkeeper/settings" : "/dashboard/manufacturer/settings",
      icon: Settings,
    },
  ]

  const shopkeeperItems = [
    {
      title: "Inventory",
      href: "/dashboard/shopkeeper/inventory",
      icon: Package,
    },
    {
      title: "Sales",
      href: "/dashboard/shopkeeper/sales",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      href: "/dashboard/shopkeeper/customers",
      icon: Users,
    },
  ]

  const manufacturerItems = [
    {
      title: "Products",
      href: "/dashboard/manufacturer/products",
      icon: Package,
    },
    {
      title: "Retailers",
      href: "/dashboard/manufacturer/retailers",
      icon: Store,
    },
    {
      title: "Distribution",
      href: "/dashboard/manufacturer/distribution",
      icon: Truck,
    },
  ]

  const items = [...commonItems, ...(isShopkeeper ? shopkeeperItems : []), ...(isManufacturer ? manufacturerItems : [])]

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div
        className={cn(
          "flex h-screen flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-14 items-center border-b px-3 py-4">
          <Link href="/" className={cn("flex items-center gap-2 font-semibold", collapsed && "justify-center")}>
            {isShopkeeper ? (
              <Store className="h-6 w-6 text-emerald-500" />
            ) : (
              <Truck className="h-6 w-6 text-emerald-500" />
            )}
            {!collapsed && <span>RetailIQ</span>}
          </Link>
          <Button variant="ghost" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed && "h-5 w-5")} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-4">
          <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", collapsed && "justify-center px-0")}>
            <div className="h-8 w-8 rounded-full bg-emerald-100">
              <span className="flex h-full w-full items-center justify-center text-sm font-medium text-emerald-700">
                {isShopkeeper ? "S" : "M"}
              </span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{isShopkeeper ? "Shopkeeper" : "Manufacturer"}</span>
                <span className="text-xs text-muted-foreground">{isShopkeeper ? "Store Admin" : "Brand Manager"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileSidebar items={items} isShopkeeper={isShopkeeper} />
    </div>
  )
}

interface MobileSidebarProps {
  items: {
    title: string
    href: string
    icon: React.ElementType
  }[]
  isShopkeeper: boolean
}

function MobileSidebar({ items, isShopkeeper }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {isShopkeeper ? (
              <Store className="h-6 w-6 text-emerald-500" />
            ) : (
              <Truck className="h-6 w-6 text-emerald-500" />
            )}
            <span>RetailIQ</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)] py-2">
          <nav className="grid gap-1 px-2">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
