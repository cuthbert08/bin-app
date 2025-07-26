'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized responses based on sentiment analysis.
 *
 * It includes:
 * - `generatePersonalizedResponse`: The main function to generate personalized responses.
 * - `GeneratePersonalizedResponseInput`: The input type for the `generatePersonalizedResponse` function.
 * - `GeneratePersonalizedResponseOutput`: The output type for the `generatePersonalizedResponse` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedResponseInputSchema = z.object({
  sentiment: z
    .string()
    .describe("The sentiment of the user's input (e.g., positive, negative, neutral)."),
  themes: z
    .string()
    .describe('Key themes or topics extracted from the user input.'),
  userInput: z.string().describe('The original input from the user.'),
});
export type GeneratePersonalizedResponseInput = z.infer<
  typeof GeneratePersonalizedResponseInputSchema
>;

const GeneratePersonalizedResponseOutputSchema = z.object({
  response: z
    .string()
    .describe('A personalized response based on the sentiment and themes.'),
});
export type GeneratePersonalizedResponseOutput = z.infer<
  typeof GeneratePersonalizedResponseOutputSchema
>;

export async function generatePersonalizedResponse(
  input: GeneratePersonalizedResponseInput
): Promise<GeneratePersonalizedResponseOutput> {
  return generatePersonalizedResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedResponsePrompt',
  input: {schema: GeneratePersonalizedResponseInputSchema},
  output: {schema: GeneratePersonalizedResponseOutputSchema},
  prompt: `You are an empathetic chatbot designed to provide personalized responses based on user input sentiment and key themes.

  Sentiment: {{{sentiment}}}
  Themes: {{{themes}}}
  User Input: {{{userInput}}}

  Generate a response that addresses the user's input, taking into account the sentiment and themes identified. The response should be personalized and relevant to the user's specific input.
  `,
});

const generatePersonalizedResponseFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedResponseFlow',
    inputSchema: GeneratePersonalizedResponseInputSchema,
    outputSchema: GeneratePersonalizedResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
