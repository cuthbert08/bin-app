'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendAnnouncement } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function Announcements() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const handleSendAnnouncement = async () => {
    if (!subject || !message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both the subject and message fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await sendAnnouncement(subject, message);
      toast({
        title: 'Announcement Sent!',
        description: 'Your message has been sent to all residents.',
      });
      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error Sending Announcement',
        description: 'Could not send the announcement.',
        variant: 'destructive',
      });
      console.error('Failed to send announcement:', error);
    }
  };

  const canPerformAction = hasRole(['superuser', 'editor']);

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
            <Input
              id="subject"
              placeholder="e.g., Water Outage"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!canPerformAction}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your announcement message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!canPerformAction}
            />
          </div>
          {canPerformAction && (
            <Button onClick={handleSendAnnouncement} disabled={!subject || !message}>
              Send Announcement to All
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
