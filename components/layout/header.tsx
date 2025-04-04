"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBranches } from "@/lib/api";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
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
        }
      } catch (error) {
        console.error("Failed to fetch branch name:", error);
      }
    };

    getBranchName();
  }, [branchId]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold text-brand-700">
          {branchId ? `${branchName} Vehicles` : "All Vehicles"}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="h-9 bg-brand-500 hover:bg-brand-600 text-white">
            <Link
              href="/dashboard/vehicles/new"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Vehicle</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
