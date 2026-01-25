// Vercel Serverless Function: GenAI Auto-Build
// Analyzes a website URL and generates a Linktree profile using OpenAI + FireCrawl
import OpenAI from 'openai';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        // --- Step A: Scrape with FireCrawl ---
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.FIRECRAWL_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: targetUrl,
                pageOptions: {
                    onlyMainContent: true
                }
            })
        });

        if (!firecrawlResponse.ok) {
            console.error('FireCrawl error:', await firecrawlResponse.text());
            return res.status(400).json({ error: `Failed to scrape URL: ${firecrawlResponse.statusText}` });
        }

        const firecrawlData = await firecrawlResponse.json();
        const markdown = firecrawlData.data?.markdown || '';

        if (!markdown) {
            console.warn('FireCrawl returned no markdown, falling back to basic extraction or failing.');
            // Proceeding hoping OpenAI can halluncinate good defaults or using empty string
        }


        // --- Step B & C: Analyze & Extract with OpenAI ---
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Using mini for cost efficiency
            messages: [
                {
                    role: 'system',
                    content: `You are a branding expert. Analyze this website content (provided as markdown) and extract the brand identity for a Linktree-style profile.

Return ONLY valid JSON with this exact structure:
{
  "business_name": "Name of the entity",
  "slogan": "Marketing tagline or 1-sentence value prop",
  "bio": "2-sentence summary of what they do (use slogan if available)",
  "brand_colors": ["#primary", "#secondary", "#background"],
  "fonts": ["Font1", "Font2"],
  "font_style": "One of: 'modern' (sans-serif), 'luxury' (serif), 'playful' (rounded/display), or 'tech' (mono)",
  "logo_url": "Absolute URL of logo if found, else null",
  "socials": [
    {"platform": "instagram", "url": "https://instagram.com/..."},
    {"platform": "tiktok", "url": "https://tiktok.com/..."},
    {"platform": "linkedin", "url": "https://linkedin.com/..."}
  ],
  "links": [
    {"label": "Link label", "url": "https://url.com", "icon": "fa-globe"}
  ]
}

Instructions:
1. **Colors**: Find the top 3 dominant colors.
2. **Socials**: rigorously search for Instagram, TikTok, LinkedIn, Twitter, YouTube links.
3. **Fonts**: Guess the font style based on the vibe (Luxury=Serif, Tech=Mono, etc).
4. **Icons**: Use Font Awesome icon names (e.g., fa-globe, fa-envelope).
5. **Links**: Generate up to 5 key action links (Shop, Contact, Services).`
                },
                {
                    role: 'user',
                    content: `Analyze this website markdown:\n\n${markdown.substring(0, 15000)}`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const aiResponse = completion.choices[0].message.content.trim();

        // Parse JSON response (handle markdown code blocks)
        let jsonData;
        try {
            // Remove markdown code blocks if present
            const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, aiResponse];
            jsonData = JSON.parse(jsonMatch[1] || aiResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response:', aiResponse);
            return res.status(500).json({ error: 'Failed to parse AI response', raw: aiResponse });
        }

        // Validate and return the response
        if (!jsonData.business_name) {
            return res.status(500).json({ error: 'Invalid AI response format', data: jsonData });
        }

        // Process Colors
        const colors = jsonData.brand_colors || [];
        const primary = colors[0] || jsonData.theme_color || '#3b82f6';
        const secondary = colors[1] || '#2563eb';
        const background = colors[2] || '#eff6ff';

        // Merge explicit socials into links if not already present
        const links = jsonData.links || [];
        if (jsonData.socials && Array.isArray(jsonData.socials)) {
            jsonData.socials.forEach(soc => {
                // Check if already in links to avoid dupes
                if (!links.some(l => l.url.includes(soc.platform))) {
                    links.push({
                        label: soc.platform.charAt(0).toUpperCase() + soc.platform.slice(1),
                        url: soc.url,
                        icon: `fa-${soc.platform}` // fa-instagram, fa-tiktok etc.
                    });
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                name: jsonData.business_name,
                bio: jsonData.slogan || jsonData.bio, // Prefer slogan for impact
                bg1: background,
                bg2: secondary,
                btn: primary,
                btnText: '#ffffff', // Default to white text on colored buttons
                links: links,
                logo: jsonData.logo_url,
                fontStyle: jsonData.font_style || 'modern'
            }
        });

    } catch (error) {
        console.error('Error in generate API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
