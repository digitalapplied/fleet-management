"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building, Plus, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBranches } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branchId");
  const [branchName, setBranchName] = useState<string>("");

  useEffect(() => {
    const getBranchName = async () => {
      if (!branchId) {
        setBranchName("");
        return;
      }

      try {
        const branches = await fetchBranches();
        const branch = branches.find((b) => b.id === branchId);
        if (branch) {
          setBranchName(branch.name);
        } else {
          setBranchName("Unknown Branch"); // Handle case where branch ID is invalid
        }
      } catch (error) {
        console.error("Failed to fetch branch name:", error);
        setBranchName("Error Loading Branch");
      }
    };

    getBranchName();
  }, [branchId]);

  // Determine the title based on the current path and branch
  let title = "Dashboard"; // Default title
  let pageTitle: React.ReactNode | null = null; // Page specific title/context

  if (pathname === "/dashboard") {
    title = "Dashboard";
    if (branchId && branchName) {
      pageTitle = (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-brand-600" />
          <span>{branchName} Vehicles</span>
        </div>
      );
    } else {
      pageTitle = "All Vehicles";
    }
  } else if (pathname.startsWith("/dashboard/vehicles/new")) {
    title = "Vehicles";
    pageTitle = "Create New Vehicle";
  } else if (
    pathname.startsWith("/dashboard/vehicles/") &&
    pathname.endsWith("/edit")
  ) {
    title = "Vehicles";
    pageTitle = "Edit Vehicle";
  } else if (pathname.startsWith("/dashboard/settings")) {
    title = "Settings"; // Set main title for settings section
    pageTitle = null; // No specific subtitle needed here, the page content handles sections
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
          <h1 className="text-xl font-semibold">{title}</h1>
          {pageTitle && ( // Only show pageTitle if it's set
            <>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <h2 className="text-lg font-medium text-brand-700">
                {pageTitle}
              </h2>
            </>
          )}
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
