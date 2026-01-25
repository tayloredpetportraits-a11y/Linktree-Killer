import { NextResponse } from 'next/server';

// Simple in-memory cache (60 minute TTL)
// For production, use Redis or similar
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes in milliseconds

// Fallback demo data - "Taylored Pet Portraits" stunt double
const FALLBACK_DATA = {
    success: true,
    data: {
        markdown: `# Taylored Pet Portraits\n\nCustom AI-generated pet portraits with magical transformations.\n\n## Services\n- Custom Pet Portraits\n- AI Art Generation\n- Digital Downloads\n\n## Social Media\n- Instagram: @tayloredpets\n- TikTok: @tayloredpets`,
        metadata: {
            title: 'Taylored Pet Portraits - Custom AI Art',
            description: 'Transform your pet photos into stunning AI-generated artwork',
            ogImage: '',
            sourceURL: '',
        },
        brand_analysis: {
            primary_color: '#3b82f6',
            secondary_color: '#8b5cf6',
            accent_colors: ['#ec4899', '#06b6d4'],
        },
    },
};

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'Invalid URL provided' },
                { status: 400 }
            );
        }

        console.log('🧬 Server Proxy: Analyzing', url);

        // Check cache first
        const cached = cache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log('✅ Serving from cache');
            return NextResponse.json(cached.data);
        }

        // Validate API Key
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ Missing FIRECRAWL_API_KEY - Serving fallback data');
            return NextResponse.json(FALLBACK_DATA);
        }

        // Call Firecrawl API (Server-to-Server = NO CORS!)
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                formats: ['markdown', 'links'], // Request structured links explicitly
                pageOptions: {
                    onlyMainContent: true,
                },
            }),
        });

        if (!firecrawlResponse.ok) {
            throw new Error(`Firecrawl API Error: ${firecrawlResponse.status} ${firecrawlResponse.statusText}`);
        }

        const data = await firecrawlResponse.json();

        // Cache the successful response
        cache.set(url, {
            data,
            timestamp: Date.now(),
        });

        console.log('✅ Firecrawl scrape successful');
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('❌ Scrape Failed:', error.message);
        console.log('⚠️ Serving Fallback Data');

        // Silent fallback - Return demo data instead of erroring
        return NextResponse.json(FALLBACK_DATA);
    }
}
