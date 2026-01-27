import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// ... imports
import * as cheerio from 'cheerio';

// 🛠️ HELPER: Aggressive Link Extractor
function extractLinks($: any) {
    const links: any[] = [];
    const seenUrls = new Set();

    $('a').each((_: any, element: any) => {
        const href = $(element).attr('href');
        const text = $(element).text().trim().toLowerCase();

        if (!href || href.startsWith('#') || href.startsWith('javascript')) return;

        // Normalize URL
        let fullUrl = href;
        if (href.startsWith('/')) {
            // We might not have the base, but we can try to reconstruct or ignore relative if critical
            // For now, let's keep it if we can; logic below checks 'contains' which handles full URLs best
        }

        const urlLower = fullUrl.toLowerCase();
        let type = '';
        let label = '';

        // RULE A: Social Media (Strict Domain Match)
        if (urlLower.includes('instagram.com')) { type = 'instagram'; label = 'Instagram'; }
        else if (urlLower.includes('facebook.com')) { type = 'facebook'; label = 'Facebook'; }
        else if (urlLower.includes('tiktok.com')) { type = 'tiktok'; label = 'TikTok'; }
        else if (urlLower.includes('linkedin.com')) { type = 'linkedin'; label = 'LinkedIn'; }
        else if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) { type = 'twitter'; label = 'X'; }
        else if (urlLower.includes('youtube.com')) { type = 'youtube'; label = 'YouTube'; }

        // RULE B: Booking Engines (Keyword Match)
        else if (
            urlLower.includes('squareup.com') ||
            urlLower.includes('vagaro.com') ||
            urlLower.includes('glossgenius.com') ||
            urlLower.includes('calendly.com') ||
            urlLower.includes('acuityscheduling.com') ||
            urlLower.includes('booksy.com') ||
            urlLower.includes('fresha.com')
        ) {
            type = 'booking';
            label = 'Book Now';
        }

        // RULE C: Generic Booking (Text Match)
        else if (text.includes('book') || text.includes('schedule') || text.includes('appointment')) {
            type = 'booking';
            label = 'Book Now';
        }

        // Add to list if valid and unique
        if (type && !seenUrls.has(fullUrl)) {
            seenUrls.add(fullUrl);
            links.push({ type, label, url: fullUrl });
        }
    });

    return links;
}

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        const targetUrl = url.trim().startsWith('http') ? url : `https://${url}`;

        // 1. SETUP KEYS
        const firecrawlKey = process.env.FIRECRAWL_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;

        // 2. DEFINE THE OUTPUT STRUCTURE
        let record = {
            name: "Brand Name",
            description: "Welcome to my page",
            industry: "Brand",
            vibe: "Modern",
            colors: { primary: "#000000", background: "#ffffff" },
            links: [] as any[],
            image: ""
        };

        let markdown = "";

        // 3. EXECUTE SCAN (Firecrawl Preferred)
        if (firecrawlKey) {
            try {
                const fcResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${firecrawlKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: targetUrl, pageOptions: { onlyMainContent: false } })
                });

                if (fcResponse.ok) {
                    const fcData = await fcResponse.json();
                    markdown = fcData.data.markdown;
                    record.image = fcData.data.metadata.ogImage || "";
                    record.name = fcData.data.metadata.title || "";
                    record.description = fcData.data.metadata.description || "";
                }
            } catch (e) {
                console.error("Firecrawl skipped.");
            }
        }

        // 4. AGGRESSIVE EXTRACTOR (Always run manual fetch to catch Buttons/Links)
        try {
            const res = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const html = await res.text();
            const $ = cheerio.load(html);

            // Run the new Aggressive Parser
            const manualLinks = extractLinks($);
            if (manualLinks.length > 0) {
                record.links = manualLinks;
            }

            // Fallback for metadata if Firecrawl failed
            if (!markdown) {
                record.name = $('title').text().split('|')[0].trim();
                record.description = $('meta[name="description"]').attr('content') || "";
                record.image = $('meta[property="og:image"]').attr('content') || "";
                markdown = $('body').text().substring(0, 3000);
            }
        } catch (e) {
            console.error("Manual fetch failed", e);
        }

        // 5. THE BRAIN (OpenAI - Enforcing "Industry" detection)
        if (openaiKey && markdown) {
            const openai = new OpenAI({ apiKey: openaiKey });
            try {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are a Brand Expert. Analyze the content.
              Rules:
              1. "industry": Be specific (e.g., "Hair Salon", "SaaS", "Pet Services"). DO NOT use generic terms like "Business".
              2. "colors": Extract the dominant hex code.
              3. "links": Find social/booking links.

              Return JSON ONLY:
              {
                "name": "Clean Brand Name",
                "description": "Short bio (max 120 chars)",
                "industry": "Specific Niche",
                "vibe": "One word (e.g. Luxury)",
                "colors": { "primary": "#hex", "background": "#hex" },
                "links": [ { "label": "Instagram", "url": "...", "type": "instagram" } ]
              }`
                        },
                        { role: "user", content: `URL: ${targetUrl}\nContent: ${markdown.substring(0, 4000)}` }
                    ],
                    model: "gpt-3.5-turbo",
                    response_format: { type: "json_object" }
                });

                const aiData = JSON.parse(completion.choices[0].message.content || '{}');

                // Merge AI data (AI wins)
                record.name = aiData.name || record.name;
                record.description = aiData.description || record.description;
                record.industry = aiData.industry || "Brand"; // This fixes the "Business detected" issue
                record.colors = aiData.colors || record.colors;
                record.links = aiData.links || [];

            } catch (e) {
                console.error("AI Analysis failed", e);
            }
        }

        return NextResponse.json(record);

    } catch (error) {
        return NextResponse.json({ error: 'Scan Failed' }, { status: 500 });
    }
}
