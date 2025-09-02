'use server';
/**
 * @fileOverview Generates a digital business card background based on user-provided keywords.
 *
 * - generateBusinessCardBackground - A function that generates a card background from keywords.
 * - GenerateBusinessCardBackgroundInput - The input type for the generateBusinessCardBackground function.
 * - GenerateBusinessCardBackgroundOutput - The return type for the generateBusinessCardBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessCardBackgroundInputSchema = z.object({
  prompt: z.string().describe('A description of the desired background image.'),
});
export type GenerateBusinessCardBackgroundInput = z.infer<typeof GenerateBusinessCardBackgroundInputSchema>;

const GenerateBusinessCardBackgroundOutputSchema = z.object({
  backgroundDataUri: z.string().describe("The generated background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateBusinessCardBackgroundOutput = z.infer<typeof GenerateBusinessCardBackgroundOutputSchema>;

export async function generateBusinessCardBackground(input: GenerateBusinessCardBackgroundInput): Promise<GenerateBusinessCardBackgroundOutput> {
  return generateBusinessCardBackgroundFlow(input);
}

const generateBusinessCardBackgroundFlow = ai.defineFlow(
  {
    name: 'generateBusinessCardBackgroundFlow',
    inputSchema: GenerateBusinessCardBackgroundInputSchema,
    outputSchema: GenerateBusinessCardBackgroundOutputSchema,
  },
  async input => {
    
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A subtle, professional, and visually appealing background for a digital business card. The background should not be too distracting. The prompt is: ${input.prompt}`,
    });

    return {
      backgroundDataUri: media.url,
    };
  }
);
