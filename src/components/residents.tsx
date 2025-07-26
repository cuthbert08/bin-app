'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getResidents, addResident, updateResident, deleteResident, setCurrentTurn } from '@/lib/api';
import { type Resident } from '@/lib/types';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const emptyResident: Omit<Resident, 'id'> = {
  name: '',
  contact: {
    whatsapp: '',
    sms: '',
    email: '',
  },
};

export function Residents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Partial<Resident> | null>(null);
  const { toast } = useToast();

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getResidents();
      setResidents(data);
    } catch (error) {
      toast({
        title: 'Error fetching residents',
        description: 'Could not load the list of residents.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const handleOpenDialog = (resident?: Resident) => {
    setEditingResident(resident || emptyResident);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingResident(null);
    setIsDialogOpen(false);
  };

  const handleSaveResident = async () => {
    if (!editingResident?.name) {
      toast({
        title: 'Validation Error',
        description: 'Resident name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      if ('id' in editingResident && editingResident.id) {
        // We are editing an existing resident
        const { id, ...updateData } = editingResident;
        await updateResident(id, updateData);
        toast({
          title: 'Resident Updated',
          description: 'The resident\'s details have been successfully updated.',
        });
      } else {
        // We are adding a new resident
        const { id, ...newData } = editingResident;
        await addResident(newData as Omit<Resident, 'id'>);
        toast({
          title: 'Resident Added',
          description: 'The new resident has been successfully added.',
        });
      }
      fetchResidents();
      handleCloseDialog();
    } catch (error) {
      toast({
        title: 'Error Saving Resident',
        description: 'Could not save the resident\'s details.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };
  
  const handleDeleteResident = async (id: string) => {
    try {
        await deleteResident(id);
        toast({
            title: 'Resident Deleted',
            description: 'The resident has been successfully deleted.',
        });
        fetchResidents();
    } catch (error) {
        toast({
            title: 'Error Deleting Resident',
            description: 'Could not delete the resident.',
            variant: 'destructive',
        });
        console.error(error);
    }
  };

  const handleSetCurrent = async (resident: Resident) => {
      try {
          await setCurrentTurn(resident.id);
          toast({
              title: 'Current Turn Updated',
              description: `${resident.name} is now set as the current person on duty.`
          });
      } catch (error) {
          toast({
              title: 'Error Setting Current Turn',
              description: 'Could not update the current turn.',
              variant: 'destructive',
          });
          console.error(error);
      }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Residents</h1>
        <Button onClick={() => handleOpenDialog()}>Add New Resident</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>SMS</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-32" /></TableCell>
              </TableRow>
            ))
          ) : residents.length > 0 ? (
            residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.name}</TableCell>
                <TableCell>{resident.contact.whatsapp || 'N/A'}</TableCell>
                <TableCell>{resident.contact.sms || 'N/A'}</TableCell>
                <TableCell>{resident.contact.email || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-1">
                    <Button variant="outline" size="sm" onClick={() => handleSetCurrent(resident)}>
                        <CheckCircle className="mr-2 h-4 w-4"/>
                        Set as Current
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(resident)}>
                        <Pencil />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the resident.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteResident(resident.id)}>
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No residents found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>{editingResident && 'id' in editingResident ? 'Edit Resident' : 'Add New Resident'}</DialogTitle>
            <DialogDescription>
                Fill in the details below. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={editingResident?.name || ''} onChange={(e) => setEditingResident({...editingResident, name: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="whatsapp" className="text-right">WhatsApp</Label>
                    <Input id="whatsapp" value={editingResident?.contact?.whatsapp || ''} onChange={(e) => setEditingResident({...editingResident, contact: {...editingResident?.contact, whatsapp: e.target.value}})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sms" className="text-right">SMS</Label>
                    <Input id="sms" value={editingResident?.contact?.sms || ''} onChange={(e) => setEditingResident({...editingResident, contact: {...editingResident?.contact, sms: e.target.value}})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" value={editingResident?.contact?.email || ''} onChange={(e) => setEditingResident({...editingResident, contact: {...editingResident?.contact, email: e.target.value}})} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleSaveResident}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
