"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  const currentBranchId = searchParams.get("branchId");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Branches</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="mt-1">
          <>
            {branches.map((branch) => (
              <SidebarMenuItem key={branch.id}>
                <SidebarMenuButton
                  asChild
                  tooltip={branch.name}
                  isActive={currentBranchId === branch.id}
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
