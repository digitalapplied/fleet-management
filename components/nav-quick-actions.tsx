"use client";

import { PlusCircleIcon, TruckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function NavQuickActions() {
  const router = useRouter();

  const handleOtherQuickAdd = (type: string) => {
    toast.info("Coming Soon", {
      description: `Quick create ${type} will be available in a future update.`,
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create Vehicle"
              className="min-w-8 bg-brand-500 text-white duration-200 ease-linear hover:bg-brand-600 hover:text-white active:bg-brand-600 active:text-white"
              asChild
            >
              <Link href="/dashboard/vehicles/new">
                <PlusCircleIcon />
                <span>Quick Create</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                  variant="outline"
                >
                  <TruckIcon className="h-4 w-4" />
                  <span className="sr-only">Quick Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/vehicles/new">Create Vehicle</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOtherQuickAdd("maintenance")}
                >
                  Log Maintenance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOtherQuickAdd("branch")}>
                  Add Branch (Soon)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
