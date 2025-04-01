"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchBranches } from "@/lib/api"

export function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const branchId = searchParams.get("branchId")
  const [branchName, setBranchName] = useState<string>("")

  useEffect(() => {
    const getBranchName = async () => {
      if (!branchId) {
        setBranchName("")
        return
      }

      try {
        const branches = await fetchBranches()
        const branch = branches.find((b) => b.id === branchId)
        if (branch) {
          setBranchName(branch.name)
        }
      } catch (error) {
        console.error("Failed to fetch branch name:", error)
      }
    }

    getBranchName()
  }, [branchId])

  // Determine the title based on the current path and branch
  let title = "Dashboard"
  let pageTitle = "All Vehicles"

  if (branchId && branchName) {
    pageTitle = (
      <div className="flex items-center gap-2">
        <Building className="h-4 w-4" />
        <span>{branchName} Vehicles</span>
      </div>
    )
  }

  if (pathname.includes("/vehicles/add")) {
    title = "Add Vehicle"
    pageTitle = "Add Vehicle"
  } else if (pathname.includes("/settings")) {
    title = "Settings"
    pageTitle = "Settings"
  } else if (pathname.includes("/dashboard")) {
    title = "Dashboard"
  }

  // Only show Add Vehicle button on the dashboard page
  const showAddButton = pathname === "/dashboard"

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-6" />
          <h1 className="text-xl font-semibold">{title}</h1>
          {pathname === "/dashboard" && (
            <>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <h2 className="text-xl font-semibold text-brand-700">{pageTitle}</h2>
            </>
          )}
        </div>

        {showAddButton && (
          <Button asChild className="bg-brand-500 hover:bg-brand-600">
            <Link href="/vehicles/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}

