"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchBranches } from "@/lib/api"
import type { Branch } from "@/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

export default function BranchSelector() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentBranchId = searchParams.get("branchId") || ""

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches()
        setBranches(data)
      } catch (error) {
        console.error("Failed to load branches:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBranches()
  }, [])

  const handleBranchChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set("branchId", value)
    } else {
      params.delete("branchId")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px] border-brand-200 bg-white">
          <SelectValue placeholder="Loading branches..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={currentBranchId} onValueChange={handleBranchChange}>
      <SelectTrigger className="w-[200px] border-brand-200 bg-white">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-500" />
          <SelectValue placeholder="All Branches" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Branches</SelectItem>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

