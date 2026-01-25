import { test, expect } from '@playwright/test';

test('Critical Path: Magic Import', async ({ page }) => {
    // 1. Navigate to the Home Page
    await page.goto('/');

    // 2. Find the "Magic Import" input
    // We look for the placeholder or the button that opens it if it's inside a modal/expandable
    // Based on code, MagicImporter starts with a button "Magic Import from URL"
    const openImportButton = page.getByRole('button', { name: /magic import from url/i });

    // If the button is visible, click it to reveal input
    if (await openImportButton.isVisible()) {
        await openImportButton.click();
    }

    // Find the input (placeholder "https://linktr.ee/yourname")
    const urlInput = page.getByPlaceholder(/https:\/\/linktr.ee\/yourname/i);
    await expect(urlInput).toBeVisible();

    // 3. Type a test URL and click Import
    await urlInput.fill('https://github.com/taylor'); // Use a generic URL
    await page.getByRole('button', { name: 'Import', exact: true }).click();

    // 4. Wait for the "Scanning..." animation to finish
    // The code shows steps like "Connecting to the neural network..."
    // We can wait for the loading state to disappear
    await expect(page.getByText('Connecting to the neural network...')).toBeVisible();
    await expect(page.getByText('Connecting to the neural network...')).toBeHidden({ timeout: 30000 });

    // 5. Assertion: Verify that the Profile Name and Avatar appear
    // The profile name input has value bound to profile.title
    // In builder, it's an input with value. In preview, it's h1.
    // We should check if we are in builder or public page. 
    // If import works, we expect to be in builder context likely.
    // Let's check for the input with value matching the imported data or non-empty.
    // Or simply check for "Branding" section which is in builder.

    // Actually the prompt says: "Verify that the Profile Name and Avatar appear on the screen."
    // In `app/builder/page.tsx`, we have an input for "Display Name" (profile.title) and ImageUpload for Avatar.
    // We can check if the "Display Name" input has a value.
    const nameInput = page.getByPlaceholder('Your Name');
    await expect(nameInput).not.toHaveValue('');

    // 6. Assertion: Verify that the "Save Profile" button is visible
    // Wait, I don't see a "Save Profile" button in `app/builder/page.tsx` snippet I read?
    // I saw "Changes Saved!" toast logic in `saveProfile` and `handleImageUpload` auto-saves.
    // Is there a manual "Save" button?
    // Let's check `app/builder/page.tsx` again for "Save". 
    // If not, maybe the "Fix" involves adding one? Or the prompt assumes one exists?
    // The prompt says: "Verify that the 'Save Profile' button is visible."
    // If it's absent, the test will fail.

    // I will check for text "Save" or "Save Changes".
    // If not found, I will fail.
    const saveButton = page.getByRole('button', { name: /save/i });
    // Just checking visibility as requested.
    // Use a catch to avoid immediate failure if I want to debug, but playright test should just fail.
    if (await saveButton.count() > 0) {
        await expect(saveButton).toBeVisible();
    } else {
        // If no save button, we might need to rely on the auto-save or finding the button code.
        // User requirement is robust: "Assertion: Verify that the 'Save Profile' button is visible."
        // So I will write this assertion.
        await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    }
});
