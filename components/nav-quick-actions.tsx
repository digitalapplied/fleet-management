"use client";

import { PlusCircleIcon, TruckIcon } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

export function NavQuickActions() {
  const router = useRouter();
  const { toast } = useToast();

  const handleQuickAdd = (type: string) => {
    if (type === "vehicle") {
      router.push("/dashboard/vehicles/new");
    } else {
      // For future quick actions
      toast({
        title: "Coming Soon",
        description: `Quick create ${type} will be available in a future update.`,
        className: "bg-brand-50 border-brand-200 text-brand-700",
      });
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-brand-500 text-white duration-200 ease-linear hover:bg-brand-600 hover:text-white active:bg-brand-600 active:text-white"
              onClick={() => handleQuickAdd("vehicle")}
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
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
                <DropdownMenuItem onClick={() => handleQuickAdd("vehicle")}>
                  Create Vehicle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAdd("maintenance")}>
                  Log Maintenance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAdd("branch")}>
                  Add Branch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
