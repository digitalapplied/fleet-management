"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { fetchBranches } from "@/lib/api"
import type { Branch } from "@/lib/supabase"
import { Filter, Search, X } from "lucide-react"

// Vehicle types for filtering
const VEHICLE_TYPES = ["Truck", "Van", "Sedan", "SUV", "Pickup", "Bus", "Trailer", "Other"]

interface VehicleFiltersProps {
  onLiveSearch?: (searchTerm: string) => void
}

export function VehicleFilters({ onLiveSearch }: VehicleFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString() // Create a string representation for dependency
  const [branches, setBranches] = useState<Branch[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [liveSearchTerm, setLiveSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<{
    branches: string[]
    types: string[]
  }>({
    branches: [],
    types: [],
  })
  const [tempFilters, setTempFilters] = useState({
    branches: [] as string[],
    types: [] as string[],
  })
  const [filterCount, setFilterCount] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const initializedRef = useRef(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load branches for filter options
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches()
        setBranches(data)
      } catch (error) {
        console.error("Failed to load branches for filters:", error)
      }
    }
    loadBranches()
  }, [])

  // Initialize filters from URL params only once on mount
  useEffect(() => {
    if (initializedRef.current) return

    const branchParams = searchParams.getAll("branch")
    const typeParams = searchParams.getAll("type")
    const searchParam = searchParams.get("search")

    const initialActiveFilters = {
      branches: branchParams,
      types: typeParams,
    }

    setActiveFilters(initialActiveFilters)
    setTempFilters(initialActiveFilters)

    if (searchParam) {
      setSearchTerm(searchParam)
      setLiveSearchTerm(searchParam)
    }

    initializedRef.current = true
  }, [searchParamsString])

  // Calculate active filter count
  useEffect(() => {
    const count = activeFilters.branches.length + activeFilters.types.length
    setFilterCount(count)
  }, [activeFilters])

  // Debounced live search handler
  const debouncedSearch = useCallback(
    (term: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        if (onLiveSearch) {
          onLiveSearch(term)
        }
      }, 300) // 300ms debounce delay
    },
    [onLiveSearch],
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLiveSearchTerm(value)
    debouncedSearch(value)
  }

  // Handle search submission (for URL persistence)
  const handleSearchSubmit = () => {
    setSearchTerm(liveSearchTerm)
    const params = new URLSearchParams(searchParamsString)

    if (liveSearchTerm) {
      params.set("search", liveSearchTerm)
    } else {
      params.delete("search")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  // Apply filters from the filter panel
  const applyFilters = () => {
    setActiveFilters({ ...tempFilters })
    setSheetOpen(false)

    const params = new URLSearchParams(searchParamsString)

    // Clear existing filter params
    params.delete("branch")
    params.delete("type")

    // Add branch filters
    tempFilters.branches.forEach((branchId) => {
      params.append("branch", branchId)
    })

    // Add type filters
    tempFilters.types.forEach((type) => {
      params.append("type", type)
    })

    // Keep search term if exists
    if (liveSearchTerm) {
      params.set("search", liveSearchTerm)
      setSearchTerm(liveSearchTerm)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Reset all filters
  const resetFilters = () => {
    setTempFilters({
      branches: [],
      types: [],
    })
  }

  // Remove a specific filter
  const removeFilter = (type: "branch" | "type", value: string) => {
    const newActiveFilters = { ...activeFilters }

    if (type === "branch") {
      newActiveFilters.branches = newActiveFilters.branches.filter((b) => b !== value)
    } else if (type === "type") {
      newActiveFilters.types = newActiveFilters.types.filter((t) => t !== value)
    }

    setActiveFilters(newActiveFilters)
    setTempFilters(newActiveFilters)

    const params = new URLSearchParams(searchParamsString)

    // Clear existing filter params of this type
    params.delete(type)

    // Add remaining filters
    if (type === "branch") {
      newActiveFilters.branches.forEach((branchId) => {
        params.append("branch", branchId)
      })
    } else if (type === "type") {
      newActiveFilters.types.forEach((t) => {
        params.append("type", t)
      })
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Toggle a filter option in the temp filters
  const toggleFilter = (type: "branches" | "types", value: string) => {
    setTempFilters((prev) => {
      const newFilters = { ...prev }

      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter((item) => item !== value)
      } else {
        newFilters[type] = [...newFilters[type], value]
      }

      return newFilters
    })
  }

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId)
    return branch ? branch.name : "Unknown Branch"
  }

  // Clear all filters
  const clearAllFilters = () => {
    const newFilters = { branches: [], types: [] }
    setActiveFilters(newFilters)
    setTempFilters(newFilters)
    setLiveSearchTerm("")
    setSearchTerm("")

    if (onLiveSearch) {
      onLiveSearch("")
    }

    const params = new URLSearchParams(searchParamsString)
    params.delete("branch")
    params.delete("type")
    params.delete("search")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Filter Button with Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 relative">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {filterCount > 0 && (
                <Badge className="ml-1 bg-brand-500 hover:bg-brand-600 absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filter Vehicles</SheetTitle>
              <SheetDescription>Narrow down vehicles by applying filters</SheetDescription>
            </SheetHeader>

            <div className="py-4 flex flex-col gap-6">
              {/* Branch Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Branch</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`branch-${branch.id}`}
                        checked={tempFilters.branches.includes(branch.id)}
                        onCheckedChange={() => toggleFilter("branches", branch.id)}
                      />
                      <Label htmlFor={`branch-${branch.id}`} className="text-sm cursor-pointer">
                        {branch.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Type Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Vehicle Type</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {VEHICLE_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={tempFilters.types.includes(type)}
                        onCheckedChange={() => toggleFilter("types", type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-2 sm:justify-between">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <Button onClick={applyFilters} className="flex-1 bg-brand-500 hover:bg-brand-600">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            placeholder="Search vehicles..."
            value={liveSearchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="pr-20"
          />
          <div className="absolute right-0 top-0 h-full flex">
            {liveSearchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="h-full"
                onClick={() => {
                  setLiveSearchTerm("")
                  if (onLiveSearch) onLiveSearch("")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-full" onClick={handleSearchSubmit}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filterCount > 0 || searchTerm) && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.branches.map((branchId) => (
            <Badge
              key={branchId}
              variant="outline"
              className="flex items-center gap-1 bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              {getBranchName(branchId)}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("branch", branchId)} />
            </Badge>
          ))}

          {activeFilters.types.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="flex items-center gap-1 bg-muted text-muted-foreground hover:bg-muted/80"
            >
              {type}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("type", type)} />
            </Badge>
          ))}

          {searchTerm && (
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearchTerm("")
                  setLiveSearchTerm("")
                  if (onLiveSearch) onLiveSearch("")

                  const params = new URLSearchParams(searchParamsString)
                  params.delete("search")
                  router.push(`${pathname}?${params.toString()}`)
                }}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

