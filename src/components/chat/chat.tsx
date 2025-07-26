'use client';

import { useChat } from '@/hooks/use-chat';
import { RadioTower } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChatList } from './chat-list';
import { ChatForm } from './chat-form';

export function Chat() {
  const { messages, loading, sendMessage, handleFeedback } = useChat();

  const handleSubmit = (input: string) => {
    sendMessage(input);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background p-2 sm:p-4">
      <Card className="w-full max-w-2xl h-full flex flex-col shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <RadioTower className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Echo Chamber</CardTitle>
            <CardDescription>A space for reflection and understanding.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ChatList messages={messages} loading={loading} onFeedback={handleFeedback} />
          <div className="mt-4 border-t pt-4">
            <ChatForm onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
