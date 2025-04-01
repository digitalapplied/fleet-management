import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
          <Car className="h-10 w-10 text-brand-600 dark:text-brand-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-brand-800 dark:text-brand-100 sm:text-5xl">
          Fleet Management System
        </h1>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          Efficiently manage your vehicle fleet across multiple branches with our comprehensive fleet management
          solution.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com/yourusername/fleet-management" target="_blank" rel="noopener noreferrer">
              View Documentation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

