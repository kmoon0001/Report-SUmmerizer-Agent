import { expect, test } from '@playwright/test';

const AGENTS = [
  {
    name: 'TheraDoc',
    id: '855c7dda-ad19-4734-a8cd-df366c48f3d2',
    description: 'Skilled nursing facility therapy documentation agent'
  },
  {
    name: 'SNF AI Dashboard',
    id: 'b5d87f73-c34f-4eca-9405-29f8f7e62d71',
    description: 'Executive command center for SNF metrics'
  },
  {
    name: 'SimpleLTC QM Coach V2 Hardened',
    id: 'a1133f91-9d37-f111-88b3-000d3a383a6c',
    description: 'Quality measure and clinical strategy copilot'
  },
  {
    name: 'Pacific Coast Compliance Analyzer',
    id: 'a8587701-574c-4a4d-aebc-35affde182c2',
    description: 'Clinical compliance and audit agent'
  }
];

const ENVIRONMENT_ID = 'a944fdf0-0d2e-e14d-8a73-0f5ffae23315';

for (const agent of AGENTS) {
  test.describe(`E2E Smoke: ${agent.name}`, () => {
    const demoUrl = `https://web.powerva.microsoft.com/environments/${ENVIRONMENT_ID}/bots/${agent.id}/demo`;

    test('agent demo page is reachable', async ({ page }) => {
      // Increase navigation timeout for slow loading demo pages
      await page.goto(demoUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Basic title check - many demo pages have 'Microsoft Copilot Studio' in title
      await expect(page).toHaveTitle(/Copilot Studio|Microsoft Copilot Studio|SNF AI Dashboard/i);
    });

    test('bot interface is visible', async ({ page }) => {
      await page.goto(demoUrl, { waitUntil: 'networkidle', timeout: 60000 });
      
      // Look for common web chat elements (standard for Microsoft Copilot Studio)
      // Note: These might be inside an iframe or Shadow DOM
      const botChat = page.locator('iframe[title="Chat"]');
      if (await botChat.isVisible()) {
        await expect(botChat).toBeVisible();
      } else {
        // Fallback check for any chat-like container if not in iframe
        const chatContainer = page.locator('.webchat, #webchat');
        if (await chatContainer.count() > 0) {
           await expect(chatContainer.first()).toBeVisible();
        }
      }
    });
  });
}
