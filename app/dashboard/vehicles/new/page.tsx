"use client";

import { useEffect, useState, Suspense } from "react";
import { fetchBranches } from "@/lib/api";
import { VehicleForm } from "@/components/vehicles/vehicle-form";
import type { Branch } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading Skeleton for the form page
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
function NewVehicleContent() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoadingBranches(true);
      setError(null);
      try {
        const branchesData = await fetchBranches();
        setBranches(branchesData);
      } catch (err) {
        console.error("Failed to load branches:", err);
        setError(
          "Failed to load necessary data (branches). Please try again later."
        );
      } finally {
        setLoadingBranches(false);
      }
    };
    loadData();
  }, []);

  if (loadingBranches) {
    return <FormLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-semibold text-brand-700">
          Create New Vehicle
        </h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-700">
          Create New Vehicle
        </h1>
      </div>

      {/* Render the new form, passing branches */}
      <VehicleForm branches={branches} />
    </div>
  );
}

// Page Component using Suspense
export default function CreateVehiclePage() {
  return (
    <Suspense fallback={<FormLoadingSkeleton />}>
      <NewVehicleContent />
    </Suspense>
  );
}
