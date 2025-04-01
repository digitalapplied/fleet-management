import type React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { cookies } from "next/headers"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get sidebar state from cookie
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

