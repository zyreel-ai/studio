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

        const title = document.title || '';
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        
        const extractedText: string[] = [];
        const headers = document.querySelectorAll('h1, h2, h3');
        headers.forEach(header => extractedText.push(header.textContent || ''));

        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => extractedText.push(p.textContent || ''));
        
        const shortText = extractedText.join(' ').substring(0, 1500);


        return `Website Title: ${title}\nMeta Description: ${description}\nContent: ${shortText}`;

    } catch (error) {
        console.error('Error extracting website details:', error);
        return 'Error extracting website details. Please check the URL and try again.';
    }
}

export async function generateCardBackgroundFromWebsite(input: GenerateCardBackgroundFromWebsiteInput): Promise<GenerateCardBackgroundFromWebsiteOutput> {
  return generateCardBackgroundFromWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCardBackgroundPrompt',
  input: {schema: GenerateCardBackgroundFromWebsiteInputSchema},
  output: {schema: z.object({ prompt: z.string() })},
  prompt: `You are an AI that generates prompts for an image generation service.

  Based on the following website details, create a prompt that will generate a background image suitable for a digital business card. The background should be professional, visually appealing, and aligned with the brand.
  Website Details: {{{websiteDetails}}}

  The prompt should be detailed and specific, describing the colors, patterns, and overall style of the background.
  Ensure the prompt is suitable for generating high-quality images.
  The generated image will be used as a background, so ensure it is subtle and not too distracting. It should be abstract and not contain any text.
  Output should be a single sentence describing the image to generate.`,
});

const generateCardBackgroundFromWebsiteFlow = ai.defineFlow(
  {
    name: 'generateCardBackgroundFromWebsiteFlow',
    inputSchema: GenerateCardBackgroundFromWebsiteInputSchema,
    outputSchema: GenerateCardBackgroundFromWebsiteOutputSchema,
  },
  async input => {
    const websiteDetails = await extractWebsiteDetails(input.websiteUrl);
    const {output} = await prompt({
      websiteDetails: websiteDetails,
    });
    
    if (!output?.prompt) {
        throw new Error("Could not generate a prompt from the website details.");
    }

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: output.prompt,
    });

    return {
      backgroundDataUri: media.url,
    };
  }
);
