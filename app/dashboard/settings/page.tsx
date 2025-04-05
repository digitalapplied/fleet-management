"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BranchesSettings from "@/components/settings/branches-settings";
import { Building, Users, Wrench } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branches");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="branches">
            <Building className="mr-2 h-4 w-4" /> Branches
          </TabsTrigger>
          <TabsTrigger value="general" disabled>
            <Wrench className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="users" disabled>
            <Users className="mr-2 h-4 w-4" /> Users & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="space-y-4">
          <Card className="border-brand-100 shadow-sm">
            <CardHeader>
              <CardTitle>Branch Management</CardTitle>
              <CardDescription>
                Add, edit, or remove branches used across the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BranchesSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure application-wide settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                General application settings will be available in a future
                update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and their permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                User management features will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
