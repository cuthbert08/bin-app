'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function Announcements() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Announcements</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Send a New Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="e.g., Water Outage" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your announcement message here..." />
          </div>
          <Button>Send Announcement to All</Button>
        </CardContent>
      </Card>
    </div>
  );
}
