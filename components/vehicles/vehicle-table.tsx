"use client"

import { useState } from "react"
import Link from "next/link"
import type { Vehicle } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Pencil, Trash2 } from "lucide-react"
import DeleteConfirmDialog from "./delete-confirm-dialog"
import { useSearchParams } from "next/navigation"

interface VehicleTableProps {
  vehicles: Vehicle[]
  onDelete: (id: string) => Promise<void>
  loading: boolean
}

export default function VehicleTable({ vehicles, onDelete, loading }: VehicleTableProps) {
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("search")

  const handleDelete = async () => {
    if (!vehicleToDelete) return

    setIsDeleting(true)
    try {
      await onDelete(vehicleToDelete.id)
    } catch (error) {
      console.error("Failed to delete vehicle:", error)
    } finally {
      setIsDeleting(false)
      setVehicleToDelete(null)
    }
  }

  // Function to get status badge color
  const getStatusBadgeClass = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-amber-100 text-amber-800"
      case "out of service":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to highlight search matches
  const highlightMatch = (text: string | null | number) => {
    if (!text || !searchTerm) return text

    const textStr = String(text)
    const index = textStr.toLowerCase().indexOf(searchTerm.toLowerCase())

    if (index === -1) return textStr

    return (
      <>
        {textStr.substring(0, index)}
        <span className="bg-yellow-200 text-black px-0.5 rounded">
          {textStr.substring(index, index + searchTerm.length)}
        </span>
        {textStr.substring(index + searchTerm.length)}
      </>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 rounded-md border bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          <p className="text-muted-foreground">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-white">
        <div className="bg-brand-50 text-brand-500 p-3 rounded-full mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-brand-700 mb-1">No vehicles found</h3>
        <p className="text-muted-foreground max-w-md">
          There are no vehicles matching your criteria. Try adjusting your filters or add a new vehicle.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-brand-50">
              <TableRow>
                <TableHead className="w-[100px]">Fleet #</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{highlightMatch(vehicle.fleet_number)}</TableCell>
                  <TableCell>{highlightMatch(vehicle.registration_number) || "-"}</TableCell>
                  <TableCell>{highlightMatch(vehicle.make) || "-"}</TableCell>
                  <TableCell>{highlightMatch(vehicle.vehicle_type) || "-"}</TableCell>
                  <TableCell>{highlightMatch(vehicle.manufacture_year) || "-"}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                      {vehicle.branch?.name || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {vehicle.status ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(vehicle.status)}`}
                      >
                        {highlightMatch(vehicle.status)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/vehicles/${vehicle.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setVehicleToDelete(vehicle)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!vehicleToDelete}
        isDeleting={isDeleting}
        vehicle={vehicleToDelete}
        onConfirm={handleDelete}
        onCancel={() => setVehicleToDelete(null)}
      />
    </>
  )
}

