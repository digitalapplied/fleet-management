"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getVehicleById, updateVehicle } from "@/lib/api"
import VehicleForm from "@/components/vehicles/vehicle-form"
import type { Vehicle } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EditVehiclePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await getVehicleById(id)
        setVehicle(data)
      } catch (error) {
        console.error("Failed to load vehicle:", error)
        setError("Failed to load vehicle details")
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [id])

  const handleSubmit = async (data: Partial<Vehicle>) => {
    try {
      await updateVehicle(id, data)
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
        className: "bg-brand-50 border-brand-200 text-brand-700",
      })
      router.push("/")
    } catch (err) {
      console.error("Failed to update vehicle:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update vehicle"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-destructive/10 text-destructive p-3 rounded-full">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-destructive">Vehicle not found</h3>
        <p className="text-muted-foreground max-w-md">
          The vehicle you're looking for could not be found. It may have been deleted or the ID is incorrect.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-700">Edit Vehicle</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VehicleForm initialData={vehicle} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  )
}

