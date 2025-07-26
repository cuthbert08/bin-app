'use server';

/**
 * @fileOverview Analyzes the sentiment of user input using Genkit.
 *
 * - analyzeSentiment - A function that analyzes the sentiment of the input text.
 * - AnalyzeSentimentInput - The input type for the analyzeSentiment function.
 * - AnalyzeSentimentOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentimentInputSchema = z.object({
  text: z.string().describe('The text to analyze for sentiment.'),
});
export type AnalyzeSentimentInput = z.infer<typeof AnalyzeSentimentInputSchema>;

const AnalyzeSentimentOutputSchema = z.object({
  sentiment: z.string().describe('The sentiment of the text (positive, negative, or neutral).'),
  confidence: z.number().describe('The confidence level of the sentiment analysis (0 to 1).'),
  keyThemes: z.array(z.string()).describe('Key themes or topics identified in the text.'),
});
export type AnalyzeSentimentOutput = z.infer<typeof AnalyzeSentimentOutputSchema>;

export async function analyzeSentiment(input: AnalyzeSentimentInput): Promise<AnalyzeSentimentOutput> {
  return analyzeSentimentFlow(input);
}

const analyzeSentimentPrompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: {schema: AnalyzeSentimentInputSchema},
  output: {schema: AnalyzeSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following text and identify key themes.\n\nText: {{{text}}}\n\nRespond in JSON format with the sentiment (positive, negative, or neutral), a confidence level (0 to 1), and a list of key themes.\n`,
});

const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: AnalyzeSentimentInputSchema,
    outputSchema: AnalyzeSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeSentimentPrompt(input);
    return output!;
  }
);
