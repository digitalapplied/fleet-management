"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building, ChevronDown, ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Branch } from "@/lib/supabase";

interface NavBranchesProps {
  items: Branch[];
}

export function NavBranches({ items: branches }: NavBranchesProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(true);
  const currentBranchId = searchParams.get("branchId");

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

          {branches.length === 0 && (
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
