"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addVehicle } from "@/lib/api";
import VehicleForm from "@/components/vehicles/vehicle-form";
import type { Vehicle } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

export default function CreateVehiclePage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBranchId = searchParams.get("branchId");
  const { toast } = useToast();

  const handleSubmit = async (
    data: Partial<Vehicle>
  ): Promise<boolean | void> => {
    try {
      // Ensure required fields are present
      if (!data.branch_id) {
        setError("Branch is required");
        toast({
          title: "Error",
          description: "Branch is required",
          variant: "destructive",
        });
        return false;
      }

      if (!data.fleet_number) {
        setError("Fleet Number is required");
        toast({
          title: "Error",
          description: "Fleet Number is required",
          variant: "destructive",
        });
        return false;
      }

      setError(null);
      await addVehicle(
        data as Omit<Vehicle, "id" | "created_at" | "updated_at">
      );
      toast({
        title: "Success",
        description: "Vehicle created successfully",
        className: "bg-brand-50 border-brand-200 text-brand-700",
      });

      const returnUrl = currentBranchId
        ? `/dashboard?branchId=${currentBranchId}`
        : "/dashboard";
      router.push(returnUrl);
      router.refresh();
    } catch (err) {
      console.error("Failed to create vehicle:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create vehicle";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-700">
          Create New Vehicle
        </h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-brand-100">
        <VehicleForm onSubmit={handleSubmit} submitLabel="Create Vehicle" />
      </Card>
    </div>
  );
}
