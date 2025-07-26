'use client';

import React from 'react';
import { SendHorizontal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ChatFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export function ChatForm({ onSubmit, isLoading }: ChatFormProps) {
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <Textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Share what's on your mind..."
        className="flex-1 resize-none overflow-y-auto max-h-32"
        rows={1}
        disabled={isLoading}
        aria-label="Chat input"
      />
      <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </form>
  );
}
