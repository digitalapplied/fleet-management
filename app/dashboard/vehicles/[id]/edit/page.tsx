"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { getVehicleById, updateVehicle } from "@/lib/api";
import VehicleForm from "@/components/vehicles/vehicle-form";
import type { Vehicle } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const currentBranchId = searchParams.get("branchId"); // Read branchId if present
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true); // Ensure loading state is set
      setError(null); // Reset error on load
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        console.error("Failed to load vehicle:", error);
        setError("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVehicle();
    } else {
      setError("Vehicle ID is missing");
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (
    data: Partial<Vehicle>
  ): Promise<boolean | void> => {
    try {
      await updateVehicle(id, data);
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
        className: "bg-brand-50 border-brand-200 text-brand-700",
      });

      // --- UPDATE RETURN LOGIC ---
      const returnUrl = currentBranchId
        ? `/dashboard?branchId=${currentBranchId}`
        : "/dashboard";
      router.push(returnUrl);
      router.refresh(); // Ensure data re-fetches on the dashboard page
    } catch (err) {
      // ... existing code ...
      return false;
    }
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="container mx-auto py-6 space-y-6">
      <Skeleton className="h-8 w-1/4" />
      <Card className="border-brand-100">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-between border-t p-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error && !vehicle) {
    // Show specific error if vehicle loading failed
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-destructive/10 text-destructive p-3 rounded-full mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-destructive mb-1">
            Error Loading Vehicle
          </h3>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    // Generic not found after loading (should ideally not happen if ID is valid)
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-destructive/10 text-destructive p-3 rounded-full mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-destructive mb-1">
            Vehicle not found
          </h3>
          <p className="text-muted-foreground max-w-md">
            The vehicle you're looking for could not be found. It may have been
            deleted or the ID is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-700">Edit Vehicle</h1>
      </div>

      {error && ( // Display submission errors separately
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-brand-100">
        {/* Pass the currentBranchId if needed, or handle return here */}
        <VehicleForm
          initialData={vehicle}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          // Remove returnPath prop if handling return here
          // returnPath="/dashboard" // Or adjust based on logic
        />
      </Card>
    </div>
  );
}
