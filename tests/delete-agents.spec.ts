import { test, chromium } from '@playwright/test';
import * as path from 'path';

const ENVIRONMENTS = [
  { name: 'Ensign Default', id: '03cc92c3-986c-4cf4-ae27-1478cf99d17f' },
  { name: 'PCCA Package', id: '077422cf-d088-e3d7-917e-5c9a9b64710c' },
  { name: 'Therapy AI Agents Dev', id: 'a944fdf0-0d2e-e14d-8a73-0f5ffae23315' }
];

// Target names to delete:
// 1. Agent 1, Agent 2, Agent
// 2. PCCA Rebuild 2026..., PCCA Clean..., PCCA Fix...
// 3. BROKEN_Escalation...
// 4. SNF AI Dashboard Recovery... (copies)
const TARGET_PATTERN = /^(Agent(\s+\d+)?|PCCA\s+(Rebuild|Clean|Fix)|BROKEN_|SNF AI Dashboard Recovery)/i;

test('Delete placeholder agents', async () => {
    const profilePath = path.join(process.cwd(), '.playwright-mcp', 'profile');
    // Launching with a persistent context to use any existing session
    const context = await chromium.launchPersistentContext(profilePath, {
        headless: true, // Headless for the environment
        viewport: { width: 1280, height: 720 },
    });
    
    const page = await context.newPage();

    for (const env of ENVIRONMENTS) {
        console.log(`Starting cleanup in: ${env.name}`);
        const envUrl = `https://web.powerva.microsoft.com/environments/${env.id}/bots`;
        await page.goto(envUrl, { waitUntil: 'networkidle', timeout: 60000 });

        // Wait for grid loading
        try {
            await page.waitForSelector('role=grid', { timeout: 30000 });
        } catch (e) {
            console.log(`Grid not found in ${env.name}, skipping.`);
            continue;
        }

        // Loop to re-scan after each deletion to handle DOM refreshes
        let foundCandidate = true;
        while (foundCandidate) {
            const rows = page.locator('role=row');
            const rowCount = await rows.count();
            foundCandidate = false;

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                // The name is typically in the first gridcell or a link
                const nameText = await row.locator('role=gridcell').first().innerText();
                
                if (TARGET_PATTERN.test(nameText.trim())) {
                    console.log(`Identified candidate: "${nameText.trim()}" in ${env.name}`);

                    // Click More command
                    const moreButton = row.locator('button[aria-label*="More"], .ms-DetailsRow-cellIcon > button');
                    if (await moreButton.count() > 0) {
                        try {
                            await moreButton.click();
                            
                            // Find Delete in the menu
                            const deleteItem = page.locator('role=menuitem, .ms-ContextualMenu-item >> text=/Delete/i');
                            if (await deleteItem.isVisible()) {
                                await deleteItem.click();
                                
                                // Confirm Dialog
                                const confirmBtn = page.locator('button.ms-Button--primary:has-text("Delete"), button:has-text("Delete")');
                                await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
                                await confirmBtn.click();
                                
                                console.log(`Successfully triggered deletion for: ${nameText.trim()}`);
                                await page.waitForTimeout(5000); // UI stabilization
                                foundCandidate = true; // Refresh scan
                                break; // Break for-loop to restart while-loop
                            }
                        } catch (err) {
                            console.error(`Failed to delete bot "${nameText.trim()}": ${err.message}`);
                        }
                    }
                }
            }
        }
    }
    
    await context.close();
});
