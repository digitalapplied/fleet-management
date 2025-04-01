import { supabase } from "./supabase"

export async function checkBranchPermissions() {
  const results = {
    select: null as any,
    insert: null as any,
    update: null as any,
    delete: null as any,
    error: null as string | null,
  }

  try {
    // Test SELECT permission
    const selectResult = await supabase.from("branches").select("*").limit(1)
    results.select = {
      success: !selectResult.error,
      error: selectResult.error?.message || null,
    }

    // Test INSERT permission (with a unique name to avoid conflicts)
    const testName = `test-${Date.now()}`
    const insertResult = await supabase.from("branches").insert({ name: testName }).select()

    results.insert = {
      success: !insertResult.error,
      error: insertResult.error?.message || null,
    }

    // If insert succeeded, test UPDATE and DELETE on the created record
    if (insertResult.data && insertResult.data.length > 0) {
      const testId = insertResult.data[0].id

      // Test UPDATE
      const updateResult = await supabase
        .from("branches")
        .update({ name: `${testName}-updated` })
        .eq("id", testId)
        .select()

      results.update = {
        success: !updateResult.error,
        error: updateResult.error?.message || null,
      }

      // Test DELETE
      const deleteResult = await supabase.from("branches").delete().eq("id", testId)

      results.delete = {
        success: !deleteResult.error,
        error: deleteResult.error?.message || null,
      }
    }
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
  }

  return results
}

