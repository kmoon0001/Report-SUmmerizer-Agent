import { chromium } from 'playwright';
import path from 'path';

(async () => {
    console.log("Starting Playwright automation for Copilot Studio Knowledge Sync...");
    
    // Connect to the persistent MCP profile to reuse authentication
    const userDataDir = path.resolve('D:\\my agents copilot studio\\.playwright-mcp\\profile');
    const browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Run headed so the user can see it!
        args: ['--start-maximized'],
        noViewport: true
    });
    
    const page = await browser.newPage();
    
    // Array of the agents we need to update
    const agents = [
        { name: "AgentTheraDoc Hardened", id: "09b002b6-ec3c-f111-88b5-000d3a5b0d6c" },
        { name: "SimpleLTC QM Coach V2", id: "ee5ef79d-073d-f111-88b5-000d3a5b0d6c" },
        { name: "SNF Rehab Agent", id: "60a37e9b-0e3d-f111-88b5-000d3a5b0d6c" }
    ];
    
    const fileToUpload = path.resolve('D:\\my agents copilot studio\\TheraDoc\\src\\KnowledgeBase\\PLATINUM_XAI_GOVERNANCE.md');
    
    for (const agent of agents) {
        console.log(`\nNavigating to ${agent.name}...`);
        try {
            await page.goto(`https://web.powerva.microsoft.com/environments/077422cf-d088-e3d7-917e-5c9a9b64710c/copilots/${agent.id}`, { waitUntil: 'domcontentloaded' });
            
            // Wait for standard load
            await page.waitForTimeout(5000); 
            
            console.log("Clicking 'Knowledge' tab...");
            // Click the Knowledge tab. Copilot UI uses fluent UI pivots.
            const knowledgeTab = page.locator('button[name="Knowledge"], [role="tab"]:has-text("Knowledge")').first();
            await knowledgeTab.waitFor({ state: 'visible', timeout: 15000 });
            await knowledgeTab.click();
            
            await page.waitForTimeout(3000);
            
            console.log("Looking for '+ Add knowledge' button...");
            // Let's try multiple common selectors for the add button
            const addBtn = page.locator('button:has-text("Add knowledge"), button[aria-label="Add knowledge"], button:has-text("Add source")').first();
            
            if (await addBtn.isVisible()) {
                await addBtn.click();
                await page.waitForTimeout(2000);
                
                // If it's a dropdown, select 'File upload'
                const fileOpt = page.locator('span:has-text("File upload"), span:has-text("Files"), button:has-text("File upload")').first();
                if (await fileOpt.isVisible()) await fileOpt.click();
                
                await page.waitForTimeout(2000);
            }
            
            console.log(`Uploading XAI file to ${agent.name}...`);
            // Target the hidden file input
            const fileInput = page.locator('input[type="file"]').first();
            await fileInput.waitFor({ state: 'attached', timeout: 10000 });
            await fileInput.setInputFiles(fileToUpload);
            
            // If there's an 'Add' or 'Save' button in the dialog
            const saveBtn = page.locator('button:has-text("Add"), button:has-text("Save"), button:has-text("Upload")').locator('visible=true').first();
            if (await saveBtn.isVisible()) {
                await saveBtn.click();
            }
            
            console.log(`Successfully completed attempt for ${agent.name}`);
            await page.waitForTimeout(3000);
            
        } catch (error) {
            console.error(`Error processing ${agent.name}: ${error.message}`);
        }
    }
    
    console.log("\nAutomation complete. Keeping browser open for final review...");
})();
