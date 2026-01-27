# Testing Guide: Magic Import + SocialFootprint Integration

## Quick Start Testing

### 1. Start the Development Server

```bash
npm run dev
```

The app should start at `http://localhost:3000`

### 2. Manual Testing Steps

#### Step 1: Navigate to Builder Page
- Go to `http://localhost:3000/builder`
- You should be redirected to `/login` if not authenticated
- Log in with your Supabase credentials

#### Step 2: Test Magic Import Flow
1. **Find the Magic Import Button**
   - Look for the purple gradient button labeled "Magic Import from URL" with BETA badge
   - Should be at the top of the sidebar

2. **Open the Import Modal**
   - Click the button
   - A modal should appear with an input field
   - Placeholder: "https://linktr.ee/yourname"

3. **Test with a Real URL**
   - Try a business website that has social links
   - **Good test URLs:**
     - `https://linktr.ee/taylor` (if exists)
     - `https://www.glossgenius.com` (has social links)
     - `https://www.calendly.com` (has social links)
     - Any local business website with Instagram/Facebook links

4. **Watch the Loading Animation**
   - Click "Import" button
   - You should see:
     - Loading steps cycling: "Connecting to the neural network...", "Scanning pixel data...", etc.
     - Progress bar with gradient animation
     - **CRITICAL**: The "Let Him Cook" animation should play smoothly

5. **Verify Success**
   - After import completes (10-30 seconds), check:
     - ✅ Toast notification: "Magic Import Successful! ✨"
     - ✅ Profile fields auto-populated:
       - Display Name (title)
       - Bio/Description
       - Theme color
       - Social links added to Links section

#### Step 3: Verify SocialFootprint Component (Intel Card)

**What to Look For:**
- After successful import, a new card should appear below the Magic Import section
- Card title: "Digital Footprint Verified" with green checkmark icon
- Should show:
  - ✅ Instagram (green checkmark if detected)
  - ✅ Facebook (green checkmark if detected)
  - ✅ LinkedIn (green checkmark if detected)
  - ✅ Booking System (green checkmark if detected)
- Business name and industry displayed at bottom

**Expected Behavior:**
- Card only appears when `scrapedData` exists (after import)
- Green checkmarks for detected channels
- Red X for missing channels
- Card disappears if you clear data and import again

#### Step 4: Test Edge Cases

1. **Invalid URL**
   - Try: `not-a-url`
   - Should show error: "Please enter a valid URL (start with http:// or https://)"

2. **URL with No Social Links**
   - Try a simple website without social media
   - Should still import basic info (title, bio)
   - SocialFootprint should show mostly X marks

3. **Network Error**
   - Disconnect internet temporarily
   - Should show error toast
   - Animation should stop gracefully

4. **Clear and Re-import**
   - Import one URL
   - Import a different URL
   - SocialFootprint should update with new data

### 3. Browser Console Checks

Open DevTools (F12) and watch for:

**Expected Logs:**
```
🧹 Clearing stale data for new import...
🚀 Launching Magic Scrape for: [URL]
✨ Magic Import started: [data object]
📝 Updating state with magic data...
💾 Auto-saving magic profile...
✅ Saved to database successfully
```

**Error Indicators:**
- ❌ Any red errors in console
- ❌ "Failed to analyze brand"
- ❌ Network errors (CORS, 404, etc.)

### 4. Verify No Duplicate Route Conflicts

**Check:**
- Open `app/api/analyze/` folder
- Should only see `route.ts` (NOT `route 2.ts`)
- If duplicate exists, delete it manually

### 5. Component Integration Check

**Verify in Code:**
1. `app/builder/page.tsx` should have:
   - ✅ `import { SocialFootprint } from '@/components/SocialFootprint'`
   - ✅ `const [scrapedData, setScrapedData] = useState<...>(null)`
   - ✅ `<SocialFootprint />` component rendered conditionally

2. `components/SocialFootprint.tsx` should exist and export correctly

3. `handleMagicImport` function should:
   - ✅ Call `setScrapedData(data)` (line ~240)
   - ✅ NOT modify `setIsLoading` logic
   - ✅ Preserve animation flow

## Automated Testing (Playwright)

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run the critical path test
npx playwright test e2e/critical-path.spec.ts

# Run with UI mode (interactive)
npx playwright test --ui
```

### What the Test Checks

The `critical-path.spec.ts` test verifies:
1. ✅ Magic Import button is visible
2. ✅ Can open import modal
3. ✅ Can enter URL and click Import
4. ✅ Loading animation appears
5. ✅ Profile data populates after import
6. ✅ Save button is visible

**Note:** The test may need updating to check for SocialFootprint component specifically.

## Troubleshooting

### Issue: SocialFootprint Not Appearing

**Check:**
1. Browser console for errors
2. `scrapedData` state is being set: `console.log(scrapedData)` in component
3. Component is imported correctly
4. Props match expected format:
   ```typescript
   {
     businessName: string,
     industry?: string,
     socials?: { instagram?, facebook?, linkedin? },
     bookingSystem?: string
   }
   ```

### Issue: Import Fails with 500 Error

**Check:**
1. `.env` file has valid API keys:
   - `FIRECRAWL_KEY` or `FIRECRAWL_API_KEY`
   - `OPENAI_API_KEY`
2. API keys are not expired
3. Check server logs for detailed error

### Issue: Animation Breaks

**Check:**
1. `handleMagicImport` function wasn't modified
2. `setIsLoading` logic is intact in `magic-importer.tsx`
3. No console errors during import

### Issue: Duplicate Route Error

**Fix:**
```bash
# Verify only one route file exists
ls app/api/analyze/

# Should only show: route.ts
# If route 2.ts exists, delete it:
rm "app/api/analyze/route 2.ts"
```

## Success Criteria ✅

The integration is working correctly if:

1. ✅ Magic Import completes without errors
2. ✅ "Let Him Cook" animation plays smoothly
3. ✅ SocialFootprint card appears after import
4. ✅ Green checkmarks show for detected social channels
5. ✅ No duplicate route file conflicts
6. ✅ Profile data saves to database
7. ✅ Preview updates automatically
8. ✅ No console errors

## Next Steps

Once testing passes:
1. Test with real customer URLs
2. Verify data accuracy (are social links correct?)
3. Test on mobile viewport
4. Performance check (import time < 30 seconds)
5. Add Playwright test for SocialFootprint component visibility
