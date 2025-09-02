'use server';
/**
 * @fileOverview Generates a digital business card background based on a company's website.
 *
 * - generateCardBackgroundFromWebsite - A function that generates a card background from a website URL.
 * - GenerateCardBackgroundFromWebsiteInput - The input type for the generateCardBackgroundFromWebsite function.
 * - GenerateCardBackgroundFromWebsiteOutput - The return type for the generateCardBackgroundFromWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { JSDOM } from 'jsdom';

const GenerateCardBackgroundFromWebsiteInputSchema = z.object({
  websiteUrl: z.string().describe('The URL of the company website.'),
});
export type GenerateCardBackgroundFromWebsiteInput = z.infer<typeof GenerateCardBackgroundFromWebsiteInputSchema>;

const GenerateCardBackgroundFromWebsiteOutputSchema = z.object({
  backgroundDataUri: z.string().describe("The generated background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateCardBackgroundFromWebsiteOutput = z.infer<typeof GenerateCardBackgroundFromWebsiteOutputSchema>;

async function extractWebsiteDetails(websiteUrl: string): Promise<string> {
    try {
        const response = await fetch(websiteUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Extract brand-relevant information: title, meta description, keywords, etc.
        const title = document.title || '';
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';

        // Attempt to extract primary colors from CSS styles (very basic).
        let primaryColor = '';
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach(styleElement => {
            const cssText = styleElement.textContent || '';
            const colorMatches = cssText.match(/#[0-9a-f]{3,6}/gi);
            if (colorMatches && colorMatches.length > 0) {
                primaryColor = colorMatches[0]; // Take the first color found.
            }
        });

        return `Website Title: ${title}\nDescription: ${description}\nKeywords: ${keywords}\nPrimary Color: ${primaryColor}`;

    } catch (error) {
        console.error('Error extracting website details:', error);
        return 'Error extracting website details. Please check the URL and try again.';
    }
}

export async function generateCardBackgroundFromWebsite(input: GenerateCardBackgroundFromWebsiteInput): Promise<GenerateCardBackgroundFromWebsiteOutput> {
  return generateCardBackgroundFromWebsiteFlow(input);
}

const generateCardBackgroundPrompt = ai.definePrompt({
  name: 'generateCardBackgroundPrompt',
  input: {schema: GenerateCardBackgroundFromWebsiteInputSchema},
  output: {schema: GenerateCardBackgroundFromWebsiteOutputSchema},
  prompt: `You are an AI that generates prompts for a stable diffusion image generation service.

  Based on the following website details, create a prompt that will generate a background image suitable for a digital business card. The background should be professional, visually appealing, and aligned with the brand.
  Website Details: {{{websiteDetails}}}

  The prompt should be detailed and specific, describing the colors, patterns, and overall style of the background.
  Ensure the prompt is suitable for generating high-quality images.
  The generated image will be used as a background, so ensure it is subtle and not too distracting.
  Output should be a single sentence.`,
});

const generateCardBackgroundFromWebsiteFlow = ai.defineFlow(
  {
    name: 'generateCardBackgroundFromWebsiteFlow',
    inputSchema: GenerateCardBackgroundFromWebsiteInputSchema,
    outputSchema: GenerateCardBackgroundFromWebsiteOutputSchema,
  },
  async input => {
    const websiteDetails = await extractWebsiteDetails(input.websiteUrl);
    const {text} = await generateCardBackgroundPrompt({
      websiteDetails: websiteDetails,
    });

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: text,
    });

    return {
      backgroundDataUri: media.url,
    };
  }
);
