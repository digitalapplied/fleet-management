"use client"

import type React from "react"

import { Car } from "lucide-react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavBranches } from "@/components/nav-branches"
import { NavQuickActions } from "@/components/nav-quick-actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <Car className="h-5 w-5 text-brand-600" />
                <span className="text-base font-semibold">Fleet Manager</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavQuickActions />
        <SidebarSeparator />
        <NavMain />
        <SidebarSeparator />
        <NavBranches />
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">Fleet Management System v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

