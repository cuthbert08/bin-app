'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getLogs } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const data = await getLogs();
        setLogs(data.reverse()); // Show most recent logs first
      } catch (error) {
        toast({
          title: 'Error fetching logs',
          description: 'Could not load the system logs.',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [toast]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">System Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border p-4">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <p key={index} className="text-sm font-mono">
                    {log}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No log entries found.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
