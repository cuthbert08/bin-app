'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function Dashboard() {
  // Placeholder data - will be replaced with API calls
  const dashboardData = {
    current_duty: { name: 'Loading...' },
    next_in_rotation: { name: 'Loading...' },
    system_status: { last_reminder_run: 'Loading...' },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Bin Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dashboardData.current_duty.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next in Rotation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dashboardData.next_in_rotation.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Last reminder run:</p>
            <p className="text-lg font-semibold">{dashboardData.system_status.last_reminder_run}</p>
          </CardContent>
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
            <Button>Send Reminder</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send Custom Reminder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Textarea placeholder="Enter your custom reminder message here..." />
            <Button>Send Custom Reminder</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
