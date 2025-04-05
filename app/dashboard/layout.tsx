import { type ReactNode, Suspense } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { BranchesNavLoader } from "@/components/nav-branches-loader";
import { BranchesNavSkeleton } from "@/components/nav-branches-skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar
        branchNav={
          <Suspense fallback={<BranchesNavSkeleton />}>
            <BranchesNavLoader />
          </Suspense>
        }
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="flex-1 p-4 md:p-6 bg-background rounded-b-lg">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
