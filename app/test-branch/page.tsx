"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestBranchPage() {
  const [branchName, setBranchName] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Direct Supabase call to test permissions
      const { data, error } = await supabase.from("branches").insert({ name: branchName.trim() }).select().single()

      if (error) {
        console.error("Supabase error:", error)
        setError(`Error: ${error.code} - ${error.message}`)
      } else {
        setResult(data)
        console.log("Branch created:", data)
      }
    } catch (err) {
      console.error("Exception:", err)
      setError(`Exception: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Test Branch Creation</CardTitle>
          <CardDescription>
            This page directly tests Supabase branch creation to diagnose permission issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="branch-name" className="text-sm font-medium">
                Branch Name
              </label>
              <Input
                id="branch-name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter branch name"
              />
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

            {result && (
              <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
                Branch created successfully: {JSON.stringify(result)}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || !branchName.trim()}
            className="w-full bg-brand-500 hover:bg-brand-600"
          >
            {loading ? "Creating..." : "Create Branch"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

