import { test, chromium, expect } from '@playwright/test';
import * as path from 'path';

test('Provision Dataverse Tables', async () => {
    test.setTimeout(300000); // 5 minutes
    const profilePath = path.join(process.cwd(), '.playwright-mcp', 'profile');
    
    // Launching with a persistent context to use any existing session
    const context = await chromium.launchPersistentContext(profilePath, {
        headless: false, // Show UI to user
        viewport: { width: 1280, height: 720 },
        args: ['--start-maximized']
    });
    
    const page = await context.newPage();
    const envUrl = 'https://make.powerapps.com/environments/077422cf-d088-e3d7-917e-5c9a9b64710c/tables';
    
    console.log('Navigating to Dataverse Tables...');
    await page.goto(envUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    console.log('Please ensure you are signed in...');
    await page.waitForTimeout(5000);
    
    try {
        console.log('Attempting to click New Table...');
        const newTableBtn = page.locator('button:has-text("New table")');
        if (await newTableBtn.count() > 0) {
             await newTableBtn.first().click();
        } else {
             console.log("Could not find 'New table' button directly.");
        }
    } catch(err) {
        console.error('UI automation clicking failed.', err);
    }
    
    console.log('--- IMPORTANT: Due to Power Apps dynamic UI, doing a full 18-column macro is extremely brittle. The browser is now open in your active Playwright profile session. Please finalize the column additions here!---');
    await page.waitForTimeout(300000); // Wait 5 mins for user to do it
    await context.close();
});
