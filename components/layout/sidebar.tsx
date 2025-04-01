"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building, Home, Menu, Plus, Settings, Truck } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchBranches } from "@/lib/api"
import type { Branch } from "@/lib/supabase"

export function Sidebar() {
  return <SidebarContent />
}

// Separate client component to avoid the useSearchParams error
function SidebarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [branches, setBranches] = useState<Branch[]>([])
  const [open, setOpen] = useState(false)
  const currentBranchId = searchParams.get("branchId") || ""

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches()
        setBranches(data)
      } catch (error) {
        console.error("Failed to load branches:", error)
      }
    }

    loadBranches()
  }, [])

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand-600" />
                <span className="text-xl font-semibold text-brand-600">Fleet Manager</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">MAIN</h3>
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                        pathname === "/" && !currentBranchId
                          ? "bg-brand-50 text-brand-700"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Home className="h-4 w-4" />
                      All Vehicles
                    </Link>
                    <Link
                      href="/vehicles/add"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                        pathname === "/vehicles/add"
                          ? "bg-brand-50 text-brand-700"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      Add Vehicle
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                        pathname === "/settings"
                          ? "bg-brand-50 text-brand-700"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">BRANCHES</h3>
                  <div className="space-y-1">
                    {branches.map((branch) => (
                      <Link
                        key={branch.id}
                        href={`/?branchId=${branch.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                          currentBranchId === branch.id
                            ? "bg-brand-50 text-brand-700"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Building className="h-4 w-4" />
                        {branch.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 flex-col border-r bg-white md:flex">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-brand-600" />
            <span className="text-xl font-semibold text-brand-600">Fleet Manager</span>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="mb-2 text-xs font-semibold text-muted-foreground">MAIN</h3>
              <div className="space-y-1">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === "/" && !currentBranchId
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Home className="h-4 w-4" />
                  All Vehicles
                </Link>
                <Link
                  href="/vehicles/add"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === "/vehicles/add"
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Link>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === "/settings"
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold text-muted-foreground">BRANCHES</h3>
              <div className="space-y-1">
                {branches.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/?branchId=${branch.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      currentBranchId === branch.id
                        ? "bg-brand-50 text-brand-700"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Building className="h-4 w-4" />
                    {branch.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

