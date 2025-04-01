"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, Building, ChevronDown, ChevronRight } from "lucide-react";
import { fetchBranches } from "@/lib/api";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import type { Branch } from "@/lib/supabase";

export function NavBranches() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(true);
  const currentBranchId = searchParams.get("branchId");

  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("NavBranches: Loading branches...");
        const data = await fetchBranches();
        console.log("NavBranches: Branches loaded:", data.length);
        setBranches(data);
      } catch (err) {
        console.error("NavBranches: Failed to load branches:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load branches"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
            className="w-full justify-between font-semibold"
            aria-expanded={isBranchMenuOpen}
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Branches</span>
            </div>
            {isBranchMenuOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {isBranchMenuOpen && (
        <SidebarMenu className="ml-3 mt-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SidebarMenuItem key={`skeleton-${index}`}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))
          ) : error ? (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-destructive text-xs" disabled>
                <AlertCircle className="h-4 w-4" />
                <span>Error loading</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="All Branches"
                  isActive={!currentBranchId && pathname === "/dashboard"}
                  size="sm"
                >
                  <Link href="/dashboard">
                    <Building className="h-4 w-4" />
                    <span>All Branches</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {branches.map((branch) => (
                <SidebarMenuItem key={branch.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={branch.name}
                    isActive={currentBranchId === branch.id}
                    size="sm"
                  >
                    <Link href={`/dashboard?branchId=${branch.id}`}>
                      <Building className="h-4 w-4" />
                      <span>{branch.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          )}
          {branches.length === 0 && !loading && !error && (
            <SidebarMenuItem>
              <SidebarMenuButton disabled size="sm">
                <span className="text-muted-foreground">No branches</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      )}
    </SidebarGroup>
  );
}
