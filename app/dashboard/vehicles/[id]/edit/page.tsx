"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVehicleById, fetchBranches } from "@/lib/api";
import { VehicleForm } from "@/components/vehicles/vehicle-form";
import type { Vehicle, Branch } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading Skeleton for the form page (can be reused)
const FormLoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-1/3" /> {/* Title Skeleton */}
    <Card className="border-brand-100">
      <CardContent className="pt-6 space-y-6">
        <Skeleton className="h-10 w-1/2" /> {/* Branch Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          ))}
        </div>
        <h3 className="text-lg font-medium pt-4 border-t">
          <Skeleton className="h-6 w-1/4" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={`tech-${i}`} className="space-y-2">
              <Skeleton className="h-4 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          ))}
        </div>
        <div className="pt-4 border-t space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Label */}
          <Skeleton className="h-24 w-full" /> {/* Textarea */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-4 px-6">
        <Skeleton className="h-10 w-24" /> {/* Cancel Button */}
        <Skeleton className="h-10 w-32" /> {/* Submit Button */}
      </CardFooter>
    </Card>
  </div>
);

// Main Content Component
function EditVehicleContent({ id }: { id: string }) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both vehicle and branches in parallel
        const [vehicleData, branchesData] = await Promise.all([
          getVehicleById(id),
          fetchBranches(),
        ]);

        if (!vehicleData) {
          throw new Error("Vehicle not found.");
        }

        setVehicle(vehicleData);
        setBranches(branchesData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load vehicle details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    } else {
      setError("Vehicle ID is missing.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <FormLoadingSkeleton />;
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-semibold text-brand-700">Edit Vehicle</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Vehicle</AlertTitle>
          <AlertDescription>
            {error || "The vehicle could not be found or loaded."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-700">
          Edit Vehicle{" "}
          <span className="text-muted-foreground font-normal">
            ({vehicle.fleet_number})
          </span>
        </h1>
      </div>

      {/* Render the updated form, passing vehicle and branches */}
      <VehicleForm vehicle={vehicle} branches={branches} />
    </div>
  );
}

// Page Component using Suspense
export default function EditVehiclePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Suspense fallback={<FormLoadingSkeleton />}>
      <EditVehicleContent id={id} />
    </Suspense>
  );
}
