import dotenv from 'dotenv';
import FirecrawlApp from '@mendable/firecrawl-js';

dotenv.config({ path: '.env.local' });

async function verifyFix() {
    console.log("🕵️  AGENT SKILL: SYSTEMATIC DEBUGGING - VERIFICATION PHASE");
    console.log("---------------------------------------------------------");

    // 1. Verify Environment Variables
    const key = process.env.FIRECRAWL_API_KEY || process.env.FIRECRAWL_KEY;
    if (!key) {
        console.error("❌ FAILED: API Key missing.");
        return;
    }
    console.log("✅ CHECK 1: API Key Found");

    // 2. Verify SDK Import & Instantiation
    try {
        const app = new FirecrawlApp({ apiKey: key });
        console.log("✅ CHECK 2: SDK Initialized (Default Import)");

        // 3. Verify Scrape Method
        console.log("🔄 CHECK 3: Attempting Scrape (stripe.com)...");

        let success = false;

        // Try the method that supposedly works now
        try {
            const result = await app.scrapeUrl('https://stripe.com', { formats: ['markdown'] });
            if (result.success) {
                console.log("✅ CHECK 3: .scrapeUrl() method SUCCESS");
                success = true;
            }
        } catch (e) {
            console.log("⚠️ .scrapeUrl() failed (" + e.message + ")");
            console.log("🔄 Retrying with .scrape()...");
            try {
                const result = await app.scrape('https://stripe.com', { formats: ['markdown'] });
                if (result.success) {
                    console.log("✅ CHECK 3: .scrape() method SUCCESS");
                    success = true;
                }
            } catch (e2) {
                console.error("❌ Both methods failed.");
            }
        }

        if (success) console.log("\n🎉 VERIFICATION COMPLETE: SYSTEM OPERATIONAL");

    } catch (error) {
        console.error("❌ VERIFICATION FAILED:", error);
    }
}

verifyFix();
