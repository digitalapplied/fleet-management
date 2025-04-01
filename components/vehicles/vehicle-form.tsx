"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Branch, Vehicle } from "@/lib/supabase";
import { fetchBranches } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: Partial<Vehicle>) => Promise<boolean | void>;
  submitLabel: string;
  returnPath?: string;
}

export default function VehicleForm({
  initialData = {},
  onSubmit,
  submitLabel,
  returnPath = "/dashboard",
}: VehicleFormProps) {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>(initialData);

  const loadBranches = async () => {
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches:", error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? null : Number(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch Selection */}
              <div className="space-y-2">
                <Label htmlFor="branch_id">
                  Branch <span className="text-destructive">*</span>
                </Label>
                <Select
                  name="branch_id"
                  value={formData.branch_id || ""}
                  onValueChange={(value) =>
                    handleSelectChange("branch_id", value)
                  }
                  required
                >
                  <SelectTrigger id="branch_id">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fleet Number */}
              <div className="space-y-2">
                <Label htmlFor="fleet_number">
                  Fleet Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fleet_number"
                  name="fleet_number"
                  value={formData.fleet_number || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  value={formData.registration_number || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Make */}
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Engine Model */}
              <div className="space-y-2">
                <Label htmlFor="engine_model">Engine Model</Label>
                <Input
                  id="engine_model"
                  name="engine_model"
                  value={formData.engine_model || ""}
                  onChange={handleChange}
                />
              </div>

              {/* VIN */}
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  name="vin"
                  value={formData.vin || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Manufacture Year */}
              <div className="space-y-2">
                <Label htmlFor="manufacture_year">Manufacture Year</Label>
                <Input
                  id="manufacture_year"
                  name="manufacture_year"
                  type="number"
                  value={formData.manufacture_year || ""}
                  onChange={handleNumberChange}
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select
                  name="vehicle_type"
                  value={formData.vehicle_type || ""}
                  onValueChange={(value) =>
                    handleSelectChange("vehicle_type", value)
                  }
                >
                  <SelectTrigger id="vehicle_type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Trailer">Trailer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(returnPath)}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand-500 hover:bg-brand-600"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {submitLabel}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
