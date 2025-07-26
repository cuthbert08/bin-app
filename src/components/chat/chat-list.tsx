'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import type { Message } from '@/lib/types';

interface ChatListProps {
  messages: Message[];
  loading: boolean;
  onFeedback: (messageId: string, feedback: 'good' | 'bad') => void;
}

export function ChatList({ messages, loading, onFeedback }: ChatListProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <ScrollArea className="flex-1 -mx-6" ref={scrollAreaRef}>
      <div className="px-6 space-y-6 py-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onFeedback={onFeedback} />
        ))}
        {loading && <ChatMessage message={{ id: 'loading', role: 'assistant', content: '...' }} />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
