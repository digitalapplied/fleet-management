import { Building } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton, // For the header toggle
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"; // Ensure correct path

export function BranchesNavSkeleton() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          {/* Skeleton for the collapsible header */}
          <SidebarMenuButton
            disabled
            className="w-full justify-between font-semibold"
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="h-4 w-20 bg-muted rounded animate-pulse"></span>{" "}
              {/* Skeleton text */}
            </div>
            <span className="h-4 w-4 bg-muted rounded animate-pulse"></span>{" "}
            {/* Skeleton chevron */}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu className="ml-3 mt-1">
        {/* Skeleton for "All Branches" */}
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
        {/* Render a few skeleton items */}
        {Array.from({ length: 3 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
