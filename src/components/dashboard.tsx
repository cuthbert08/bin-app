'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getDashboardInfo, triggerReminder, skipTurn } from '@/lib/api';
import { type DashboardData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, nextWednesday, addDays } from 'date-fns';

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const loadDashboardData = useCallback(async () => {
    try {
      const dashboardData = await getDashboardInfo();
      setData(dashboardData);
    } catch (error) {
      toast({
        title: 'Error fetching dashboard data',
        description: 'Could not load dashboard information from the server.',
        variant: 'destructive',
      });
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSendReminder = async (message?: string) => {
    try {
      await triggerReminder(message);
      toast({
        title: 'Reminder Sent!',
        description: 'The reminder has been successfully sent.',
      });
      if (message) {
        setCustomMessage('');
      }
    } catch (error) {
      toast({
        title: 'Error Sending Reminder',
        description: 'Could not send the reminder.',
        variant: 'destructive',
      });
      console.error('Failed to send reminder:', error);
    }
  };

  const handleSkipTurn = async () => {
    try {
        await skipTurn();
        toast({
            title: 'Turn Skipped',
            description: 'The current turn has been skipped successfully.',
        });
        await loadDashboardData();
    } catch (error) {
        toast({
            title: 'Error Skipping Turn',
            description: 'Could not skip the current turn.',
            variant: 'destructive',
        });
        console.error('Failed to skip turn:', error);
    }
  };

  const currentDutyDate = nextWednesday(new Date());
  const nextDutyDate = addDays(currentDutyDate, 7);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Bin Duty</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold">{data?.current_duty?.name || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">{format(currentDutyDate, 'dd-MM-yyyy')}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next in Rotation</CardTitle>
          </CardHeader>
          <CardContent>
             {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold">{data?.next_in_rotation?.name || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">{format(nextDutyDate, 'dd-MM-yyyy')}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Last reminder run:</p>
            {loading ? (
               <Skeleton className="h-6 w-1/2" />
            ) : (
             <p className="text-lg font-semibold">{data?.system_status?.last_reminder_run || 'N/A'}</p>
            )}
          </CardContent>
           <CardFooter>
                <Button variant="outline" onClick={handleSkipTurn} disabled={loading || !data}>
                    Skip Current Turn
                </Button>
            </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Weekly Reminder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Send the standard weekly reminder to the person currently on duty.
            </p>
            <Button onClick={() => handleSendReminder()} disabled={loading || !data}>Send Reminder</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send Custom Reminder</CardTitle>
          </Header>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Enter your custom reminder message here..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              disabled={loading || !data}
            />
            <Button onClick={() => handleSendReminder(customMessage)} disabled={!customMessage || loading || !data}>Send Custom Reminder</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
