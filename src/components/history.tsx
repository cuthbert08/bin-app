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
import { type CommunicationEvent } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
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
} from './ui/alert-dialog';
import { Trash2, CheckCircle, XCircle, ChevronDown, ChevronUp, Send, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'default';
    case 'partial': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'outline';
  }
};

const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
        case 'email': return <Mail className="h-4 w-4" />;
        case 'sms': return <MessageSquare className="h-4 w-4" />;
        case 'whatsapp': return <Send className="h-4 w-4" />;
        default: return null;
    }
}

export function History() {
  const [history, setHistory] = useState<CommunicationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const canPerformAction = hasRole(['superuser', 'editor']);

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
  
  const handleToggleOpen = (id: string) => {
    setOpenItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(history.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (!canPerformAction) return;
    try {
      await deleteHistory(Array.from(selectedItems));
      toast({
        title: 'History Deleted',
        description: 'The selected history events have been deleted.',
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
        {canPerformAction && selectedItems.size > 0 && (
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
                  This will permanently delete {selectedItems.size} history event(s) and all associated records.
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

       <Card>
            <CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[50px]">
                             {canPerformAction && (
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    aria-label="Select all history items"
                                    disabled={!canPerformAction || history.length === 0}
                                />
                            )}
                        </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </CardHeader>
            <CardContent>
                 {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full my-2" />)
                 ) : history.length > 0 ? (
                    <div className="space-y-2">
                    {history.map((item) => (
                        <Collapsible key={item.id} open={openItems.has(item.id)} onOpenChange={() => handleToggleOpen(item.id)}>
                            <div className="border rounded-md">
                                <TableRow className="flex w-full items-center">
                                    <TableCell className="w-[50px] pl-3">
                                        {canPerformAction && (
                                            <Checkbox
                                                checked={selectedItems.has(item.id)}
                                                onCheckedChange={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectItem(item.id)
                                                }}
                                                aria-label={`Select event ${item.id}`}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="flex-1 font-medium">{format(new Date(item.timestamp), 'dd MMM yyyy, HH:mm')}</TableCell>
                                    <TableCell className="flex-1">{item.type}</TableCell>
                                    <TableCell className="flex-1 truncate">{item.subject}</TableCell>
                                    <TableCell className="flex-1">{(item.details || []).length} recipient(s)</TableCell>
                                    <TableCell className="flex-1"><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                                    <TableCell className="w-[50px] pr-3">
                                        <CollapsibleTrigger asChild>
                                             <Button variant="ghost" size="icon">
                                                {openItems.has(item.id) ? <ChevronUp /> : <ChevronDown />}
                                             </Button>
                                        </CollapsibleTrigger>
                                    </TableCell>
                                </TableRow>
                                <CollapsibleContent>
                                    <div className="p-4 bg-muted/50">
                                        <h4 className="font-semibold mb-2">Details for: {item.subject}</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Recipient</TableHead>
                                                    <TableHead>Method</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Notes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(item.details || []).map((detail, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{detail.recipient}</TableCell>
                                                        <TableCell className='flex items-center gap-2'>
                                                            {getMethodIcon(detail.method)} {detail.method}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`flex items-center gap-1 ${detail.status === 'Sent' ? 'text-green-500' : 'text-destructive'}`}>
                                                                {detail.status === 'Sent' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                                                {detail.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className='text-muted-foreground italic'>{detail.content}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    ))}
                    </div>
                ) : (
                <div className="text-center text-muted-foreground py-8">
                    No communication history found.
                </div>
                )}
            </CardContent>
      </Card>
    </div>
  );
}