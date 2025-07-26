'use client';

import { ThumbsDown, ThumbsUp, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'good' | 'bad') => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn('flex items-start gap-3 animate-in fade-in', isUser ? 'justify-end' : 'justify-start')}
      data-testid="chat-message"
    >
      {isAssistant && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[80%] space-y-2 rounded-lg px-4 py-3 shadow-sm',
          isUser
            ? 'bg-accent text-accent-foreground rounded-br-none'
            : 'bg-card border rounded-bl-none'
        )}
      >
        {message.id === 'loading' ? (
          <div className="flex items-center gap-2" aria-label="Loading message">
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}

        {isAssistant && onFeedback && message.id !== 'loading' && (
          <div className="flex items-center gap-1 mt-2 -ml-2">
            <Button
              size="icon"
              variant="ghost"
              className={cn('h-7 w-7', message.feedback === 'good' && 'bg-primary/20 text-primary')}
              onClick={() => onFeedback(message.id, 'good')}
              aria-label="Good response"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={cn('h-7 w-7', message.feedback === 'bad' && 'bg-destructive/20 text-destructive')}
              onClick={() => onFeedback(message.id, 'bad')}
              aria-label="Bad response"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="bg-accent/80 text-accent-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
