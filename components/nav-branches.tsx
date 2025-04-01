"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { AlertCircle, Building } from "lucide-react"
import { fetchBranches } from "@/lib/api"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import type { Branch } from "@/lib/supabase"

export function NavBranches() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const currentBranchId = searchParams.get("branchId") || ""

  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log("NavBranches: Loading branches...")
        const data = await fetchBranches()
        console.log("NavBranches: Branches loaded:", data)
        setBranches(data)
      } catch (err) {
        console.error("NavBranches: Failed to load branches:", err)
        setError(err instanceof Error ? err.message : "Failed to load branches")
      } finally {
        setLoading(false)
      }
    }

    loadBranches()
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Branches</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {loading ? (
            // Show loading skeletons while branches are loading
            Array.from({ length: 3 }).map((_, index) => (
              <SidebarMenuItem key={`skeleton-${index}`}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))
          ) : error ? (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Error loading branches</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : branches.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <span className="text-muted-foreground">No branches found</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            branches.map((branch) => (
              <SidebarMenuItem key={branch.id}>
                <SidebarMenuButton asChild tooltip={branch.name} isActive={currentBranchId === branch.id}>
                  <Link href={`${pathname}?branchId=${branch.id}`}>
                    <Building className="h-4 w-4" />
                    <span>{branch.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

