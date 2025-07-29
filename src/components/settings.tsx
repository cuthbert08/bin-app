'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from './ProtectedLayout';

function AdminManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Users</CardTitle>
        <CardDescription>Manage administrator accounts.</CardDescription>
      </CardHeader>
      <CardContent className='text-center text-muted-foreground'>
        <p>Admin user management is not yet available.</p>
      </CardContent>
    </Card>
  );
}

function SystemSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure system-wide settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" placeholder="Property Owner" disabled />
        </div>
         <div className="space-y-2">
            <Label htmlFor="ownerContact">Owner Contact</Label>
            <Input id="ownerContact" placeholder="+123456789" disabled />
        </div>
        <div className="space-y-2">
            <Label htmlFor="reportLink">Report Issue Link</Label>
            <Input id="reportLink" placeholder="https://example.com/report" disabled />
        </div>
        <div className="space-y-2">
            <Label htmlFor="reminderTemplate">Reminder Template</Label>
            <Textarea id="reminderTemplate" placeholder="Reminder message template..." disabled/>
        </div>
        <Button disabled>Save Changes</Button>
      </CardContent>
    </Card>
  )
}


export function Settings() {
  const { hasRole } = useAuth();

  if (!hasRole(['superuser'])) {
    return (
        <ProtectedLayout>
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <div className="grid gap-8 md:grid-cols-2">
                <AdminManagement />
                <SystemSettings />
            </div>
        </div>
    </ProtectedLayout>
  );
}
