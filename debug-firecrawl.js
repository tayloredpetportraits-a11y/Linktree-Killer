import dotenv from 'dotenv';
import FirecrawlApp from '@mendable/firecrawl-js';

dotenv.config({ path: '.env.local' });

async function testScrape() {
    console.log("🔍 DIAGNOSTIC: Checking Firecrawl Class...");

    // Check if key exists
    if (!process.env.FIRECRAWL_KEY) {
        console.error("❌ ERROR: FIRECRAWL_KEY is missing in .env.local");
        return;
    }

    try {
        console.log("🛠️ Initializing FirecrawlApp (Default Import)...");
        const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_KEY });

        console.log("📡 Attempting to scrape 'https://stripe.com'...");

        // In v1.0+ (and apparently v4.x), the method is likely .scrapeUrl() or .scrape()
        // based on the source code I read, it has .scrape() in v2 methods.

        const result = await app.scrapeUrl('https://stripe.com', {
            formats: ['markdown']
        });

        if (result.success) {
            console.log("✅ SUCCESS! Scrape worked.");
            console.log("📄 Preview:", result.data?.markdown ? result.data.markdown.substring(0, 50) : "No markdown found");
        } else {
            console.error("❌ Scrape failed:", result);
        }

    } catch (error) {
        console.error("********** ERROR **********");
        console.error(error);
        if (error.message.includes("is not a function")) {
            console.log("💡 Method name mismatch. Trying .scrape() next...");
        }
    }
}

testScrape();
