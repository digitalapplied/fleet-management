"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addVehicle } from "@/lib/api"
import VehicleForm from "@/components/vehicles/vehicle-form"
import type { Vehicle } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddVehiclePage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: Partial<Vehicle>) => {
    try {
      // Ensure required fields are present
      if (!data.branch_id) {
        setError("Branch is required")
        toast({
          title: "Error",
          description: "Branch is required",
          variant: "destructive",
        })
        return false
      }

      if (!data.fleet_number) {
        setError("Fleet Number is required")
        toast({
          title: "Error",
          description: "Fleet Number is required",
          variant: "destructive",
        })
        return false
      }

      setError(null)
      await addVehicle(data as Omit<Vehicle, "id" | "created_at" | "updated_at">)
      toast({
        title: "Success",
        description: "Vehicle added successfully",
        className: "bg-brand-50 border-brand-200 text-brand-700",
      })
      router.push("/")
    } catch (err) {
      console.error("Failed to add vehicle:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to add vehicle"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-700">Add New Vehicle</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VehicleForm onSubmit={handleSubmit} submitLabel="Add Vehicle" />
    </div>
  )
}

