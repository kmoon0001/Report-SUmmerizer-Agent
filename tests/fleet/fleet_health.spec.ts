import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * GLOBAL FLEET TEST SUITE
 * Purpose: Validates that all agents in the workspace can correctly reference
 * the shared knowledge base and maintain the Ironclad Branding standards.
 */

const WORKSPACE_ROOT = path.join(__dirname, '../../');
const AGENT_FOLDERS = fs.readdirSync(WORKSPACE_ROOT, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && /Agent|Assistant|Analyzer|TheraDoc|Dashboard|Portal/i.test(dirent.name))
    .map(dirent => dirent.name);

test.describe('Ensign AI Fleet: Cross-Agent Sanity Suite', () => {

    for (const agentName of AGENT_FOLDERS) {
        const agentPath = path.join(WORKSPACE_ROOT, agentName);

        test(`${agentName}: Documentation Lifecycle Validation`, async () => {
            const agentMdPath = path.join(agentPath, 'AGENT.md');
            
            // 1. Ensure AGENT.md exists (Governance Requirement)
            expect(fs.existsSync(agentMdPath)).toBeTruthy();
            
            const content = fs.readFileSync(agentMdPath, 'utf8');
            
            // 2. Ensure agent is referencing the new "Pac Coast" or "Ensign" standards
            expect(content).toMatch(/Pac Coast|Ensign|QM|TheraDoc/i);
        });

        test(`${agentName}: Shared Knowledge Integration`, async () => {
            const knowledgeRef = path.join(WORKSPACE_ROOT, 'SharedKnowledge/GLOBAL_CMS_COMPLIANCE.md');
            expect(fs.existsSync(knowledgeRef)).toBeTruthy();
            
            // Check if agent prompts have been hardened to reference global knowledge
            const promptDir = path.join(agentPath, 'src/PromptTools');
            if (fs.existsSync(promptDir)) {
                const prompts = fs.readdirSync(promptDir).filter(f => f.endsWith('.md'));
                if (prompts.length > 0) {
                    const firstPrompt = fs.readFileSync(path.join(promptDir, prompts[0]), 'utf8');
                    expect(firstPrompt).toContain('GLOBAL SAFETY GUARDRAILS');
                    expect(firstPrompt).toContain('GLOBAL_CMS_COMPLIANCE.md');
                }
            }
        });
    }
});
