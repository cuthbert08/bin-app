'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from './ProtectedLayout';
import { getSettings, updateSettings, getAdmins, addAdmin, updateAdmin, deleteAdmin } from '@/lib/api';
import { type SystemSettings, type AdminUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Partial<AdminUser> & { password?: string } | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      toast({ title: 'Error fetching admins', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleOpenDialog = (admin?: AdminUser) => {
    setEditingAdmin(admin ? { ...admin } : { email: '', role: 'editor', password: '' });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingAdmin) return;
    try {
      if (editingAdmin.id) {
        await updateAdmin(editingAdmin.id, { email: editingAdmin.email, role: editingAdmin.role });
        toast({ title: 'Admin updated' });
      } else {
        await addAdmin(editingAdmin);
        toast({ title: 'Admin added' });
      }
      fetchAdmins();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error saving admin', variant: 'destructive' });
    }
  };

  const handleDelete = async (adminId: string) => {
    try {
      await deleteAdmin(adminId);
      toast({ title: 'Admin deleted' });
      fetchAdmins();
    } catch (error) {
      toast({ title: 'Error deleting admin', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Users</CardTitle>
        <CardDescription>Manage administrator accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
            ) : (
              admins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell><Badge variant={admin.role === 'superuser' ? 'default' : 'secondary'}>{admin.role}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(admin)} disabled={admin.id === currentUser?.id}>
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive" disabled={admin.id === currentUser?.id}>
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete the admin user.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(admin.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2"/>Add New Admin</Button>
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdmin?.id ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={editingAdmin?.email || ''} onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editingAdmin?.role || ''} onValueChange={(value: 'superuser' | 'editor' | 'viewer') => setEditingAdmin({...editingAdmin, role: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="superuser">Superuser</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingAdmin?.id && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={editingAdmin?.password || ''} onChange={(e) => setEditingAdmin({...editingAdmin, password: e.target.value})} />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      toast({ title: 'Error fetching settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      toast({ title: 'Settings saved successfully!' });
    } catch (error) {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    }
  };

  const handleChange = (key: keyof SystemSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure system-wide settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" value={settings.owner_name || ''} onChange={e => handleChange('owner_name', e.target.value)} disabled={loading} />
        </div>
         <div className="space-y-2">
            <Label htmlFor="ownerContact">Owner Contact (WhatsApp)</Label>
            <Input id="ownerContact" value={settings.owner_contact_whatsapp || ''} onChange={e => handleChange('owner_contact_whatsapp', e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="reportLink">Report Issue Link</Label>
            <Input id="reportLink" value={settings.report_issue_link || ''} onChange={e => handleChange('report_issue_link', e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="reminderTemplate">Reminder Template</Label>
            <Textarea id="reminderTemplate" value={settings.reminder_template || ''} onChange={e => handleChange('reminder_template', e.target.value)} disabled={loading}/>
             <p className="text-xs text-muted-foreground">
                Use {'{first_name}'} and {'{flat_number}'}.
            </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>Save Changes</Button>
      </CardContent>
    </Card>
  );
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
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <AdminManagement />
                <SystemSettings />
            </div>
        </div>
    </ProtectedLayout>
  );
}
