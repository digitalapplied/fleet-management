import { fetchBranches } from "@/lib/api"; // Use your API function
import { NavBranches } from "./nav-branches"; // Import the presentation component

// This is an async Server Component
export async function BranchesNavLoader() {
  // No need for try-catch here if errors are handled globally or on the page
  // Let errors propagate to the nearest Error Boundary
  const branches = await fetchBranches();
  return <NavBranches items={branches} />;
}
