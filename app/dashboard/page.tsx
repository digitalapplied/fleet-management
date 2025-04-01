"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Vehicle, Branch } from "@/lib/supabase";
import { fetchVehiclesByBranch, deleteVehicle, fetchBranches } from "@/lib/api";
import { VehicleDataTable } from "@/components/vehicles/vehicle-data-table";
import { AlertCircle, Building, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string>("");
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branchId");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setBranchName("");

      console.log(`Dashboard Effect: Running for branchId = ${branchId}`);

      try {
        console.log(
          "Dashboard: Fetching vehicles for branchId:",
          branchId || "all branches"
        );
        const data = await fetchVehiclesByBranch(branchId);
        console.log("Dashboard: Vehicles loaded:", data.length);
        setVehicles(data);

        if (branchId) {
          console.log("Dashboard: Fetching branch name for ID:", branchId);
          const branches: Branch[] = await fetchBranches();
          const branch = branches.find((b) => b.id === branchId);
          if (branch) {
            setBranchName(branch.name);
            console.log("Dashboard: Set branch name:", branch.name);
          } else {
            console.warn("Dashboard: Branch not found for ID:", branchId);
            setError(`Branch with ID ${branchId} not found.`);
          }
        } else {
          console.log("Dashboard: No branchId, showing all vehicles.");
        }
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

      {branchId && branchName && !loading && !error && (
        <div className="bg-brand-50 p-3 rounded-lg border border-brand-100">
          <h2 className="text-lg font-medium text-brand-700 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Showing vehicles for:{" "}
            <span className="font-semibold">{branchName}</span>
          </h2>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <VehicleDataTable data={vehicles} onDelete={handleDelete} />
      )}
    </div>
  );
}
