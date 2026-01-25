'use server';

import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Zod Schema for the AI response
const ScrapedProfileSchema = z.object({
    username: z.string(),
    title: z.string(),
    bio: z.string(),
    theme_color: z.string(),
    avatar_url: z.string().optional(),
    fonts: z.array(z.string()),
    brand_colors: z.array(z.string()),
    social_links: z.array(
        z.object({
            platform: z.enum(['instagram', 'tiktok', 'youtube', 'generic']),
            url: z.string(),
            label: z.string(),
        })
    ),
});

export type ScrapedProfile = z.infer<typeof ScrapedProfileSchema>;

export async function scrapeProfileFromUrl(url: string) {
    try {
        // 1. Fetch HTML
        // Add headers to mimic a browser to avoid some 403s
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept:
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache',
            },
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            // If 403/404/500, throw specific error to catch below and fallback
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // 2. Load into Cheerio and Clean
        const $ = cheerio.load(html);

        // Remove heavy/irrelevant elements to save tokens
        $('script').remove();
        $('style').remove();
        $('svg').remove();
        $('iframe').remove();
        $('noscript').remove();
        $('path').remove(); // often in inline SVGs

        // Clean up base64 images from img tags
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && src.startsWith('data:image')) {
                $(el).remove();
            }
        });

        // Extract relevant metadata directly to help the AI (optional but good for context)
        const ogTitle = $('meta[property="og:title"]').attr('content') || $('title').text();
        const ogDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
        const ogImage = $('meta[property="og:image"]').attr('content');

        // Get the body text, collapsed
        const bodyText = $('body').text().replace(/\s+/g, ' ').substring(0, 15000); // Limit context size
        // Also include the cleaned HTML structure for structure analysis (links etc)
        const bodyHtml = $('body').html()?.replace(/\s+/g, ' ').substring(0, 20000) || '';

        // 3. Analyze with OpenAI
        const prompt = `
      You are a Brand Expert. Analyze this HTML content from ${url}.
      
      Start with these hints found in meta tags:
      Title: ${ogTitle}
      Description: ${ogDescription}
      Image: ${ogImage}

      HTML Content Snippet:
      ${bodyHtml.slice(0, 15000)}... (truncated)

      Return a strict JSON object with:
      - username: A clean handle derived from the URL or title (no spaces, lowercase).
      - title: The display name (e.g., 'Taylor's Art').
      - bio: A witty, inviting bio (max 100 chars). If the existing description is boring, WRITE A BETTER ONE based on the vibe.
      - theme_color: The single most dominant brand hex color found (look for background colors, button colors, etc). Default to #000000 if unsure.
      - brand_colors: An array of 3-5 distinct hex colors including the theme color, accents, and text colors.
      - fonts: An array of 1-2 font family names used (e.g., "Inter", "Playfair Display"). Check inline styles or css links.
      - avatar_url: The best URL for a profile picture. Prioritize high-res. If you found an og:image, use that unless it looks like a generic banner.
      - social_links: An array of { platform: 'instagram' | 'tiktok' | 'youtube' | 'generic', url: string, label: string }. Look for hrefs in the <a> tags.
    `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a precise JSON extractor. You only return valid JSON matching the schema.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7, // Little creativity for the bio
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content from OpenAI');

        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            throw new Error('Failed to parse JSON from OpenAI');
        }

        // Validate with Zod
        const validatedData = ScrapedProfileSchema.parse(data);
        return validatedData;

    } catch (error: any) {
        console.error('Magic Scrape Error:', error);

        // FALLBACK: Return partial success instead of crashing the UI
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');

            // Return a safe fallback object
            return {
                username: hostname.split('.')[0], // e.g. 'shopify' from 'shopify.com'
                title: hostname,
                bio: "Could not auto-scrape details. Please fill manually.",
                theme_color: "#000000",
                brand_colors: ["#000000", "#ffffff"],
                fonts: ["Inter"],
                avatar_url: "",
                social_links: []
            };
        } catch (e) {
            // If even URL parsing fails (unlikely if valid url passed), throw original
            throw new Error(error.message || 'Failed to scrape profile');
        }
    }
}
