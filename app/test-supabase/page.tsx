"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("Testing Supabase connection...")

      // Test branches table
      const branchesResult = await supabase.from("branches").select("count").single()

      // Test vehicles table
      const vehiclesResult = await supabase.from("vehicles").select("count").single()

      setResult({
        branches: branchesResult.data,
        vehicles: vehiclesResult.data,
        timestamp: new Date().toISOString(),
      })

      console.log("Connection test results:", { branchesResult, vehiclesResult })
    } catch (err) {
      console.error("Supabase connection test failed:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : result ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              <p className="font-medium">Connection Successful</p>
              <p className="text-sm">Branches count: {result.branches?.count || "N/A"}</p>
              <p className="text-sm">Vehicles count: {result.vehicles?.count || "N/A"}</p>
              <p className="text-xs mt-2">Tested at: {result.timestamp}</p>
            </div>
          ) : null}

          <Button onClick={testConnection} disabled={loading} className="w-full bg-brand-500 hover:bg-brand-600">
            {loading ? "Testing..." : "Test Connection Again"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

