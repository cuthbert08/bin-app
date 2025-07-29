'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from './ui/badge';

export function Settings() {
  const { user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is not a superuser
    if (!hasRole(['superuser'])) {
      router.push('/');
    }
  }, [hasRole, router]);
  
  // This is a placeholder. In a real app, this data would come from the API.
  const admins = [
      { id: '1', email: 'cutberndikudze@gmail.com', role: 'superuser'},
      { id: '2', email: 'editor@example.com', role: 'editor'},
      { id: '3', email: 'viewer@example.com', role: 'viewer'},
  ];

  if (!hasRole(['superuser'])) {
    return null; // or a loading/access denied component
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
          <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage administrator accounts for the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
               <div className="flex justify-end mb-4">
                  <Button disabled>Add New Admin</Button>
              </div>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admins.map(admin => (
                        <TableRow key={admin.id}>
                            <TableCell>{admin.email}</TableCell>
                            <TableCell><Badge>{admin.role}</Badge></TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" disabled>Edit</Button>
                                <Button variant="destructive" size="sm" disabled>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-4">Admin management functionality is coming soon.</p>
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and message templates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input id="ownerName" defaultValue="Property Owner" disabled />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="ownerContact">Owner Contact Number</Label>
                  <Input id="ownerContact" defaultValue="+27123456789" disabled />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="reportLink">Report an Issue Link</Label>
                  <Input id="reportLink" defaultValue="https://your-frontend-url/report" disabled />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="reminderTemplate">Reminder Template</Label>
                  <Textarea id="reminderTemplate" defaultValue="Hi {first_name}! {flat_number}\nJust a friendly reminder that it's your turn to take out the dustbin today. Thank you!" disabled />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="announcementTemplate">Announcement Template</Label>
                  <Textarea id="announcementTemplate" defaultValue="Hi {first_name},\n{message}" disabled />
              </div>
              <div className="flex justify-end">
                  <Button disabled>Save Changes</Button>
              </div>
              <p className="text-xs text-muted-foreground text-right">Editing settings functionality is coming soon.</p>
          </CardContent>
      </Card>

    </div>
  );
}
