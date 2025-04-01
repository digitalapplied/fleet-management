"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import BranchesSettings from "@/components/settings/branches-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branches")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-brand-600" />
        <h1 className="text-2xl font-semibold text-brand-700">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="general" disabled>
            General
          </TabsTrigger>
          <TabsTrigger value="users" disabled>
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branch Management</CardTitle>
              <CardDescription>Add, edit, or remove branches for your fleet management system.</CardDescription>
            </CardHeader>
            <CardContent>
              <BranchesSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">General settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

