import { supabase, type Branch, type Vehicle } from "./supabase"

// Fetch all branches
export async function fetchBranches(): Promise<Branch[]> {
  console.log("Fetching branches...")

  try {
    const { data, error } = await supabase.from("branches").select("*").order("name")

    if (error) {
      console.error("Error fetching branches:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} branches:`, data)
    return data || []
  } catch (error) {
    console.error("Exception in fetchBranches:", error)
    throw error
  }
}

// Fetch vehicles by branch
export async function fetchVehiclesByBranch(branchId: string | null): Promise<Vehicle[]> {
  console.log("Fetching vehicles for branchId:", branchId || "all branches")

  try {
    let query = supabase
      .from("vehicles")
      .select(`
        id,
        branch_id,
        fleet_number,
        registration_number,
        make,
        engine_model,
        vin,
        manufacture_year,
        vehicle_type,
        created_at,
        updated_at,
        branch:branches(id, name)
      `)
      .order("fleet_number")

    if (branchId) {
      query = query.eq("branch_id", branchId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching vehicles:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} vehicles`)
    return data || []
  } catch (error) {
    console.error("Exception in fetchVehiclesByBranch:", error)
    throw error
  }
}

// Add a new vehicle
export async function addVehicle(vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">): Promise<Vehicle> {
  const { data, error } = await supabase.from("vehicles").insert(vehicle).select().single()

  if (error) {
    console.error("Error adding vehicle:", error)

    // Check for unique constraint violations
    if (error.code === "23505") {
      if (error.message.includes("registration_number")) {
        throw new Error("A vehicle with this registration number already exists.")
      } else if (error.message.includes("vin")) {
        throw new Error("A vehicle with this VIN already exists.")
      } else {
        throw new Error("This vehicle conflicts with an existing record.")
      }
    }

    throw error
  }

  return data
}

// Update an existing vehicle
export async function updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
  const { data, error } = await supabase.from("vehicles").update(vehicle).eq("id", id).select().single()

  if (error) {
    console.error("Error updating vehicle:", error)
    throw error
  }

  return data
}

// Delete a vehicle
export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase.from("vehicles").delete().eq("id", id)

  if (error) {
    console.error("Error deleting vehicle:", error)
    throw error
  }
}

// Get a single vehicle by ID
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      branch:branches(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching vehicle:", error)
    throw error
  }

  return data
}

// Add a new branch
export async function addBranch(name: string): Promise<Branch> {
  console.log("Adding branch with name:", name)

  // Check if name is provided
  if (!name || name.trim() === "") {
    throw new Error("Branch name is required")
  }

  const { data, error } = await supabase.from("branches").insert({ name: name.trim() }).select().single()

  if (error) {
    console.error("Error adding branch:", error)

    // Check for unique constraint violations
    if (error.code === "23505") {
      throw new Error("A branch with this name already exists.")
    } else if (error.code === "42501" || error.code === "42503") {
      throw new Error("You don't have permission to add branches. Please check your database permissions.")
    }

    throw new Error(`Failed to add branch: ${error.message}`)
  }

  console.log("Branch added successfully:", data)
  return data
}

// Update an existing branch
export async function updateBranch(id: string, name: string): Promise<Branch> {
  console.log("Updating branch:", id, name)

  // Check if name is provided
  if (!name || name.trim() === "") {
    throw new Error("Branch name is required")
  }

  const { data, error } = await supabase.from("branches").update({ name: name.trim() }).eq("id", id).select().single()

  if (error) {
    console.error("Error updating branch:", error)

    // Check for unique constraint violations
    if (error.code === "23505") {
      throw new Error("A branch with this name already exists.")
    } else if (error.code === "42501" || error.code === "42503") {
      throw new Error("You don't have permission to update branches. Please check your database permissions.")
    }

    throw new Error(`Failed to update branch: ${error.message}`)
  }

  console.log("Branch updated successfully:", data)
  return data
}

// Delete a branch
export async function deleteBranch(id: string): Promise<void> {
  console.log("Deleting branch:", id)

  // First check if there are any vehicles associated with this branch
  const { data: vehicles, error: vehiclesError } = await supabase.from("vehicles").select("id").eq("branch_id", id)

  if (vehiclesError) {
    console.error("Error checking vehicles for branch:", vehiclesError)
    throw new Error(`Failed to check vehicles: ${vehiclesError.message}`)
  }

  if (vehicles && vehicles.length > 0) {
    throw new Error(
      `Cannot delete branch because it has ${vehicles.length} vehicle(s) associated with it. Please reassign or delete these vehicles first.`,
    )
  }

  // If no vehicles are associated, proceed with deletion
  const { error } = await supabase.from("branches").delete().eq("id", id)

  if (error) {
    console.error("Error deleting branch:", error)

    if (error.code === "42501" || error.code === "42503") {
      throw new Error("You don't have permission to delete branches. Please check your database permissions.")
    }

    throw new Error(`Failed to delete branch: ${error.message}`)
  }

  console.log("Branch deleted successfully")
}

