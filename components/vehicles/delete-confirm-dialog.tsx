"use client"

import type { Vehicle } from "@/lib/supabase"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  isDeleting: boolean
  vehicle: Vehicle | null
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export default function DeleteConfirmDialog({
  isOpen,
  isDeleting,
  vehicle,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!vehicle) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete the vehicle <span className="font-semibold">{vehicle.fleet_number}</span>
            {vehicle.registration_number && ` (${vehicle.registration_number})`}?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="border-brand-200 text-brand-700">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

