/**
 * Client utility for scraping URLs using the cached API route
 * 
 * Benefits:
 * - 60-minute cache saves API credits during testing
 * - Silent fallback to demo data on errors (seamless UX)
 * - No CORS issues (server-side proxy)
 */

export interface ScrapeResult {
    success: boolean;
    data: {
        markdown?: string;
        metadata?: {
            title: string;
            description: string;
            ogImage?: string;
            sourceURL: string;
        };
        brand_analysis?: {
            primary_color: string;
            secondary_color: string;
            accent_colors: string[];
        };
    };
}

/**
 * Scrape a URL using the Firecrawl API (cached, with fallback)
 * 
 * @param url - The URL to scrape
 * @returns Promise with scrape results or fallback demo data
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
    try {
        console.log('🔌 Calling Local Backend API...');

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ REAL DATA RECEIVED:', data);

        return data;
    } catch (error) {
        console.error('💥 Scrape Error:', error);

        // This shouldn't happen since the API has its own fallback
        // but just in case, return a minimal fallback
        return {
            success: false,
            data: {
                metadata: {
                    title: 'Error',
                    description: 'Failed to scrape site',
                    sourceURL: url,
                },
            },
        };
    }
}
