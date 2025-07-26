'use client';

import type { Message } from '@/lib/types';
import { analyzeSentiment } from '@/ai/flows/analyze-sentiment';
import { generatePersonalizedResponse } from '@/ai/flows/generate-personalized-response';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'echo-chamber-messages';

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm here to listen. Share what's on your mind, and I'll do my best to understand and respond.",
  },
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error('Failed to parse messages from localStorage', error);
      setMessages(initialMessages);
    }
  }, []);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const isInitial = messages.length === 1 && messages[0].id === '1';
      if(!isInitial) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
      }
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const sentimentResult = await analyzeSentiment({ text });

        const responseResult = await generatePersonalizedResponse({
          userInput: text,
          sentiment: sentimentResult.sentiment,
          themes: sentimentResult.keyThemes.join(', '),
        });

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseResult.response,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: 'Failed to get a response. Please try again.',
        });
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, I seem to be having trouble connecting. Please try again in a moment.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleFeedback = useCallback((messageId: string, feedback: 'good' | 'bad') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: msg.feedback === feedback ? undefined : feedback } : msg
      )
    );
  }, []);

  return { messages, loading, sendMessage, handleFeedback };
}
