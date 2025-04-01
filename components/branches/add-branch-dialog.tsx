"use client"

import type React from "react"

import { useState, useRef } from "react"
import { addBranch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Branch } from "@/lib/supabase"

interface AddBranchDialogProps {
  onBranchAdded: (branch?: Branch) => void
}

export function AddBranchDialog({ onBranchAdded }: AddBranchDialogProps) {
  const [open, setOpen] = useState(false)
  const [branchName, setBranchName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when the dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      // Use setTimeout to ensure the dialog is fully rendered before focusing
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      // Reset form when closing
      setBranchName("")
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!branchName.trim()) {
      setError("Branch name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const newBranch = await addBranch(branchName.trim())

      toast({
        title: "Success",
        description: `Branch "${branchName}" added successfully`,
        className: "bg-brand-50 border-brand-200 text-brand-700",
      })

      // Close dialog and reset form
      setOpen(false)
      setBranchName("")

      // Call the callback with the new branch
      onBranchAdded(newBranch)
    } catch (err) {
      console.error("Error in AddBranchDialog:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to add branch"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1 text-brand-600 border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Branch
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>Enter the name for the new branch location.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name" className="text-right">
                Branch Name
              </Label>
              <Input
                id="branch-name"
                ref={inputRef}
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter branch name"
                className={error ? "border-destructive" : ""}
                autoComplete="off"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-500 hover:bg-brand-600">
              {isSubmitting ? "Adding..." : "Add Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

