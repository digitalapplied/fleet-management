"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

import { addVehicle, updateVehicle } from "@/lib/api";
import type { Vehicle, Branch } from "@/lib/supabase";

const vehicleFormSchema = z.object({
  branch_id: z.string().uuid({ message: "Branch is required" }),
  fleet_number: z.string().min(1, { message: "Fleet number is required" }),
  registration_number: z.string().optional().nullable(),
  make: z.string().optional().nullable(),
  engine_model: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  manufacture_year: z.coerce
    .number()
    .int()
    .gte(1900)
    .lte(new Date().getFullYear() + 1)
    .optional()
    .nullable(),
  year_details: z.string().optional().nullable(),
  vehicle_type: z.string().optional().nullable(),
  tare_weight_kg: z.coerce.number().positive().optional().nullable(),
  permission_weight: z.coerce.number().positive().optional().nullable(),
  permission_unit: z.string().optional().nullable(),
  volume_litres: z.coerce.number().positive().optional().nullable(),
  pallet_capacity: z.coerce.number().int().positive().optional().nullable(),
  tyre_specification: z.string().optional().nullable(),
  wheel_count: z.coerce.number().int().positive().optional().nullable(),
  value_zar: z.coerce.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  branches: Branch[];
}

export function VehicleForm({ vehicle, branches }: VehicleFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBranchId = searchParams.get("branchId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      branch_id: vehicle?.branch_id || "",
      fleet_number: vehicle?.fleet_number || "",
      registration_number: vehicle?.registration_number || null,
      make: vehicle?.make || null,
      engine_model: vehicle?.engine_model || null,
      vin: vehicle?.vin || null,
      manufacture_year:
        vehicle?.manufacture_year === 0 ? null : vehicle?.manufacture_year,
      year_details: vehicle?.year_details || null,
      vehicle_type: vehicle?.vehicle_type || null,
      tare_weight_kg: vehicle?.tare_weight_kg || null,
      permission_weight: vehicle?.permission_weight || null,
      permission_unit: vehicle?.permission_unit || null,
      volume_litres: vehicle?.volume_litres || null,
      pallet_capacity: vehicle?.pallet_capacity || null,
      tyre_specification: vehicle?.tyre_specification || null,
      wheel_count: vehicle?.wheel_count || null,
      value_zar: vehicle?.value_zar || null,
      notes: vehicle?.notes || null,
    },
  });

  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true);
    try {
      // Ensure empty strings for optional fields become null
      const dataToSubmit = Object.entries(data).reduce(
        (acc: any, [key, value]) => {
          if (typeof value === "string" && value === "") {
            acc[key] = null;
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      ); // Start with plain object, type accumulator as any

      if (vehicle?.id) {
        // For update, only send changed fields. We might need a different approach if Partial update is not supported by API
        // For now, sending all fields as derived from the form.
        await updateVehicle(vehicle.id, dataToSubmit as any); // Use the processed data
        toast.success("Vehicle updated successfully");
      } else {
        await addVehicle(dataToSubmit as any); // Use the processed data
        toast.success("Vehicle created successfully");
      }

      const returnUrl = currentBranchId
        ? `/dashboard?branchId=${currentBranchId}`
        : "/dashboard";
      router.push(returnUrl);
      router.refresh();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to save vehicle: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const vehicleTypes = [
    "Truck",
    "Van",
    "Pickup",
    "Sedan",
    "SUV",
    "Bus",
    "Trailer",
    "Other",
  ];

  return (
    <Form {...form}>
      <Card className="border-brand-100 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Branch <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fleet_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fleet Number <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter fleet number"
                        {...field}
                        disabled={isSubmitting}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter registration number"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter make"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engine_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter engine model"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter VIN"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? ""}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacture_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacture Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 2023"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Details</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Mid-year"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-medium pt-4 border-t">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tare_weight_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tare Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter tare weight"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permission_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter permission weight"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permission_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission Unit</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., kg, tons"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volume_litres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (litres)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter volume"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pallet_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pallet Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter pallet capacity"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tyre_specification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tyre Specification</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tyre specification"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wheel_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wheel Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter wheel count"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value_zar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (ZAR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter value"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="pt-4 border-t">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notes about the vehicle"
                      className="min-h-24"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4 pb-4 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {vehicle ? "Save Changes" : "Create Vehicle"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
