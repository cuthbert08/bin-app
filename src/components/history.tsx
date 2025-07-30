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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getHistory, deleteHistory } from '@/lib/api';
import { type CommunicationHistory } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

const getBadgeVariant = (type: string) => {
  if (type.toLowerCase().includes('reminder')) return 'default';
  if (type.toLowerCase().includes('announcement')) return 'secondary';
  if (type.toLowerCase().includes('issue')) return 'destructive';
  return 'outline';
};


export function History() {
  const [history, setHistory] = useState<CommunicationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      toast({
        title: 'Error fetching history',
        description: 'Could not load the communication history.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSelectItem = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(history.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteHistory(Array.from(selectedItems));
      toast({
        title: 'History Deleted',
        description: 'The selected history items have been deleted.',
      });
      setSelectedItems(new Set());
      fetchHistory();
    } catch (error) {
      toast({
        title: 'Error Deleting History',
        description: 'Could not delete the selected items.',
        variant: 'destructive',
      });
    }
  };

  const isAllSelected = history.length > 0 && selectedItems.size === history.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Communication History</h1>
        {selectedItems.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2" />
                Delete ({selectedItems.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedItems.size} history item(s).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

       {/* Desktop View */}
      <Card className='hidden md:block'>
          <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">
                    <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        aria-label="Select all history items"
                    />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Content</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                ))
                ) : history.length > 0 ? (
                history.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell>
                        <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        />
                    </TableCell>
                    <TableCell>{format(new Date(item.timestamp), 'dd MMM yyyy, HH:mm')}</TableCell>
                    <TableCell><Badge variant={getBadgeVariant(item.type)}>{item.type}</Badge></TableCell>
                    <TableCell>{item.recipient}</TableCell>
                    <TableCell className='max-w-md truncate'>{item.content}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                    No communication history found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
          </CardContent>
      </Card>
      
       {/* Mobile View */}
       <div className="grid gap-4 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))
        ) : history.length > 0 ? (
          history.map(item => (
            <Card key={item.id}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                         <CardTitle className="text-lg">{item.recipient}</CardTitle>
                         <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                        />
                    </div>
                    <CardDescription>{format(new Date(item.timestamp), 'dd MMM yyyy, HH:mm')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Badge variant={getBadgeVariant(item.type)}>{item.type}</Badge>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                </CardContent>
            </Card>
          ))
        ) : (
             <div className="text-center text-muted-foreground py-8">
                No communication history found.
            </div>
        )}

       </div>
    </div>
  );
}
