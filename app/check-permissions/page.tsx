"use client"

import { useEffect, useState } from "react"
import { checkBranchPermissions } from "@/lib/check-permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckPermissionsPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runPermissionCheck = async () => {
    setLoading(true)
    setError(null)

    try {
      const permissionResults = await checkBranchPermissions()
      setResults(permissionResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runPermissionCheck()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-700">Database Permissions Check</h1>

      <Card>
        <CardHeader>
          <CardTitle>Branches Table Permissions</CardTitle>
          <CardDescription>
            This page checks if your Supabase account has the necessary permissions to manage branches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>
          ) : results ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">SELECT Permission</h3>
                  <div
                    className={`p-2 rounded-md ${results.select?.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {results.select?.success ? "Allowed" : `Denied: ${results.select?.error}`}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">INSERT Permission</h3>
                  <div
                    className={`p-2 rounded-md ${results.insert?.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {results.insert?.success ? "Allowed" : `Denied: ${results.insert?.error}`}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">UPDATE Permission</h3>
                  <div
                    className={`p-2 rounded-md ${results.update?.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {results.update?.success ? "Allowed" : `Denied: ${results.update?.error}`}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">DELETE Permission</h3>
                  <div
                    className={`p-2 rounded-md ${results.delete?.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {results.delete?.success ? "Allowed" : `Denied: ${results.delete?.error}`}
                  </div>
                </div>
              </div>

              {!results.insert?.success && (
                <div className="p-4 bg-amber-100 text-amber-800 rounded-md">
                  <h3 className="font-medium mb-2">How to Fix INSERT Permission Issues</h3>
                  <p className="text-sm">
                    You need to update your Supabase Row Level Security (RLS) policies to allow branch creation. Go to
                    your Supabase dashboard, select the "branches" table, and add a policy that allows inserts.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <div className="mt-4 flex justify-end">
            <Button onClick={runPermissionCheck} disabled={loading} className="bg-brand-500 hover:bg-brand-600">
              {loading ? "Checking..." : "Re-Check Permissions"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

