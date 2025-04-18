"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function DashboardNav({
  items,
  className,
  ...props
}: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
