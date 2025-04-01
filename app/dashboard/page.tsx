"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Vehicle } from "@/lib/supabase"
import { fetchVehiclesByBranch, deleteVehicle, fetchBranches } from "@/lib/api"
import { VehicleDataTable } from "@/components/vehicles/vehicle-data-table"
import { AlertCircle, Building } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [branchName, setBranchName] = useState<string>("")
  const searchParams = useSearchParams()
  const branchId = searchParams.get("branchId")

  // Load vehicles when branchId changes
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log("Dashboard: Fetching vehicles for branchId:", branchId || "all branches")
        const data = await fetchVehiclesByBranch(branchId)
        console.log("Dashboard: Vehicles loaded:", data.length)
        setVehicles(data)

        if (branchId) {
          const branches = await fetchBranches()
          const branch = branches.find((b) => b.id === branchId)
          if (branch) {
            setBranchName(branch.name)
            console.log("Dashboard: Filtered by branch:", branch.name)
          } else {
            console.warn("Dashboard: Branch not found for ID:", branchId)
            setBranchName("")
          }
        } else {
          setBranchName("")
        }
      } catch (err) {
        console.error("Dashboard: Failed to load vehicles:", err)
        setError(err instanceof Error ? err.message : "Failed to load vehicles")
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [branchId])

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id)
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id))
    } catch (error) {
      console.error("Failed to delete vehicle:", error)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {branchId && branchName && (
        <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
          <h2 className="text-lg font-medium text-brand-700 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Showing vehicles for: {branchName}
          </h2>
        </div>
      )}

      <VehicleDataTable data={vehicles} onDelete={handleDelete} loading={loading} />
    </div>
  )
}

