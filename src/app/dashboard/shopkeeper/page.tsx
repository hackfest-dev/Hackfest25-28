import Link from "next/link";
import {
  ReceiptText,
  BarChart2,
  Package,
  Store,
  BadgePercent,
  ArrowRight,
} from "lucide-react";

export default function ShopkeeperDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Shopkeeper Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Select a module to manage your retail operations.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Billing Module */}
        <Link
          href="/dashboard/shopkeeper/billing"
          className="group bg-card text-card-foreground flex h-[180px] flex-col overflow-hidden rounded-xl border shadow transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-md dark:hover:bg-emerald-950/10"
        >
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                <ReceiptText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Billing</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              Create invoices, manage transactions, and process customer
              payments
            </p>
            <div className="mt-auto flex items-center pt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Open Billing
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Analytics Module */}
        <Link
          href="/dashboard/shopkeeper/analytics"
          className="group bg-card text-card-foreground flex h-[180px] flex-col overflow-hidden rounded-xl border shadow transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md dark:hover:bg-blue-950/10"
        >
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Analytics</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              View sales trends, product performance, and business insights
            </p>
            <div className="mt-auto flex items-center pt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
              Open Analytics
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Inventory Module */}
        <Link
          href="/dashboard/shopkeeper/inventory"
          className="group bg-card text-card-foreground flex h-[180px] flex-col overflow-hidden rounded-xl border shadow transition-all hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-md dark:hover:bg-purple-950/10"
        >
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Inventory</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              Manage stock levels, track products, and handle inventory
              operations
            </p>
            <div className="mt-auto flex items-center pt-4 text-sm font-medium text-purple-600 dark:text-purple-400">
              Open Inventory
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Manufacturers Module */}
        <Link
          href="/dashboard/shopkeeper/manufacturers"
          className="group bg-card text-card-foreground flex h-[180px] flex-col overflow-hidden rounded-xl border shadow transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-md dark:hover:bg-amber-950/10"
        >
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Manufacturers</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              Browse products from manufacturers and place orders for your store
            </p>
            <div className="mt-auto flex items-center pt-4 text-sm font-medium text-amber-600 dark:text-amber-400">
              Open Manufacturers
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Loyalty Module */}
        <Link
          href="/dashboard/shopkeeper/loyalty"
          className="group bg-card text-card-foreground flex h-[180px] flex-col overflow-hidden rounded-xl border shadow transition-all hover:border-rose-200 hover:bg-rose-50/50 hover:shadow-md dark:hover:bg-rose-950/10"
        >
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400">
                <BadgePercent className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Loyalty</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              Manage customer loyalty programs, rewards, and member benefits
            </p>
            <div className="mt-auto flex items-center pt-4 text-sm font-medium text-rose-600 dark:text-rose-400">
              Open Loyalty
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
