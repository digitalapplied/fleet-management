"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Vehicle } from "@/lib/supabase";
import { fetchVehiclesByBranch, deleteVehicle } from "@/lib/api";
import { VehicleDataTable } from "@/components/vehicles/vehicle-data-table";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branchId");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      console.log(`Dashboard Effect: Running for branchId = ${branchId}`);

      try {
        console.log(
          "Dashboard: Fetching vehicles for branchId:",
          branchId || "all branches"
        );
        const data = await fetchVehiclesByBranch(branchId);
        console.log("Dashboard: Vehicles loaded:", data.length);
        setVehicles(data);
      } catch (err) {
        console.error("Dashboard: Failed to load data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
        console.log("Dashboard Effect: Finished loading.");
      }
    };

    loadData();
  }, [branchId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete vehicle"
      );
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <div className="rounded-md border">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full border-t" />
        ))}
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <VehicleDataTable data={vehicles} onDelete={handleDelete} />
      )}
    </div>
  );
}
