import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions for our database tables
export type Branch = {
  id: string
  name: string
  created_at: string
}

export type Vehicle = {
  id: string
  branch_id: string
  fleet_number: string
  registration_number: string | null
  make: string | null
  engine_model: string | null
  vin: string | null
  manufacture_year: number | null
  year_details: string | null
  vehicle_type: string | null
  tare_weight_kg: number | null
  permission_weight: number | null
  permission_unit: string | null
  volume_litres: number | null
  pallet_capacity: number | null
  tyre_specification: string | null
  wheel_count: number | null
  value_zar: number | null
  notes: string | null
  created_at: string
  updated_at: string
  status: string | null
  branch?: Branch
}

