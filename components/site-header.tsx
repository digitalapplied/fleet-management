"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building, Plus, Settings as SettingsIcon, Truck } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branchId");

  // Determine the title based on the current path
  let title = "Dashboard"; // Default title
  let pageIcon = <Truck className="h-5 w-5 text-brand-600" />; // Default icon

  if (pathname === "/dashboard") {
    title = branchId ? "Branch Vehicles" : "All Vehicles";
    pageIcon = branchId ? (
      <Building className="h-5 w-5 text-brand-600" />
    ) : (
      <Truck className="h-5 w-5 text-brand-600" />
    );
  } else if (pathname.startsWith("/dashboard/vehicles/new")) {
    title = "Create Vehicle";
    pageIcon = <Plus className="h-5 w-5 text-brand-600" />;
  } else if (
    pathname.startsWith("/dashboard/vehicles/") &&
    pathname.endsWith("/edit")
  ) {
    title = "Edit Vehicle";
    pageIcon = <Truck className="h-5 w-5 text-brand-600" />; // Or maybe Pencil icon
  } else if (pathname.startsWith("/dashboard/settings")) {
    title = "Settings";
    pageIcon = <SettingsIcon className="h-5 w-5 text-brand-600" />;
  }
  // Add more conditions here for other dashboard sections if needed

  // Only show Create Vehicle button on the main dashboard or branch vehicle views
  const showAddButton = pathname === "/dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-6" />
          {pageIcon}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {showAddButton && (
            <Button asChild className="bg-brand-500 hover:bg-brand-600">
              <Link
                href="/dashboard/vehicles/new"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Vehicle
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
