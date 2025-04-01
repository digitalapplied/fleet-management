"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { fetchBranches, addBranch, updateBranch, deleteBranch } from "@/lib/api"
import type { Branch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Building, Edit, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BranchesSettings() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchName, setBranchName] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadBranches = async () => {
    setLoading(true)
    try {
      const data = await fetchBranches()
      setBranches(data)
    } catch (error) {
      console.error("Failed to load branches:", error)
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBranches()
  }, [])

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!branchName.trim()) {
      setError("Branch name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await addBranch(branchName.trim())

      toast({
        title: "Success",
        description: `Branch "${branchName}" added successfully`,
        className: "bg-brand-50 border-brand-200 text-brand-700",
      })

      // Close dialog and reset form
      setAddDialogOpen(false)
      setBranchName("")

      // Reload branches
      loadBranches()
    } catch (err) {
      console.error("Error adding branch:", err)
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

  const handleEditBranch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!branchName.trim() || !selectedBranch) {
      setError("Branch name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await updateBranch(selectedBranch.id, branchName.trim())

      toast({
        title: "Success",
        description: `Branch updated successfully`,
        className: "bg-brand-50 border-brand-200 text-brand-700",
      })

      // Close dialog and reset form
      setEditDialogOpen(false)
      setBranchName("")
      setSelectedBranch(null)

      // Reload branches
      loadBranches()
    } catch (err) {
      console.error("Error updating branch:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update branch"
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

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return

    setIsSubmitting(true)

    try {
      await deleteBranch(selectedBranch.id)

      toast({
        title: "Success",
        description: `Branch deleted successfully`,
        className: "bg-brand-50 border-brand-200 text-brand-700",
      })

      // Close dialog and reset
      setDeleteDialogOpen(false)
      setSelectedBranch(null)

      // Reload branches
      loadBranches()
    } catch (err) {
      console.error("Error deleting branch:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete branch"

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (branch: Branch) => {
    setSelectedBranch(branch)
    setBranchName(branch.name)
    setError(null)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (branch: Branch) => {
    setSelectedBranch(branch)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Branches</h3>
        <Button
          onClick={() => {
            setBranchName("")
            setError(null)
            setAddDialogOpen(true)
          }}
          className="bg-brand-500 hover:bg-brand-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            <p className="text-muted-foreground">Loading branches...</p>
          </div>
        </div>
      ) : branches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border">
          <div className="bg-brand-50 text-brand-500 p-3 rounded-full mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-brand-700 mb-1">No branches found</h3>
          <p className="text-muted-foreground max-w-md">
            There are no branches in the system. Add a new branch to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-brand-500" />
                    {branch.name}
                  </TableCell>
                  <TableCell>{new Date(branch.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                        onClick={() => openEditDialog(branch)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Branch</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => openDeleteDialog(branch)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Branch</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Branch Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddBranch}>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>Enter the name for the new branch location.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-branch-name" className="text-right">
                  Branch Name
                </Label>
                <Input
                  id="add-branch-name"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddDialogOpen(false)
                  setBranchName("")
                  setError(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-500 hover:bg-brand-600">
                {isSubmitting ? "Adding..." : "Add Branch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditBranch}>
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>Update the branch name.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-branch-name" className="text-right">
                  Branch Name
                </Label>
                <Input
                  id="edit-branch-name"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setBranchName("")
                  setSelectedBranch(null)
                  setError(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-500 hover:bg-brand-600">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Branch Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Branch
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the branch "{selectedBranch?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false)
                setSelectedBranch(null)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBranch}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

