import fs from 'fs';
import path from 'path';
import { ENSIGN_SLP_CORNER_DATA } from '../src/data/ensign-slp-data.ts';
import { SUBSPECIALTY_DATA } from '../src/data/subspecialty-data.ts';
import { MEDICARE_KNOWLEDGE_BASE } from '../src/data/medicare-knowledge-base.ts';
import { CODING_DATA } from '../src/data/coding-data.ts';

const OUTPUT_DIR = './knowledge-base';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

function convertToMarkdown(data: any, title: string): string {
    let md = `# ${title}\n\n`;
    
    if (Array.isArray(data)) {
        data.forEach(item => {
            md += `## ${item.title || item.name || 'Untitled'}\n`;
            if (item.category) md += `**Category**: ${item.category}\n\n`;
            if (item.reference) md += `**Reference**: ${item.reference}\n\n`;
            
            if (item.sections) {
                item.sections.forEach((section: any) => {
                    md += `### ${section.title}\n`;
                    if (Array.isArray(section.content)) {
                        section.content.forEach((bullet: string) => md += `- ${bullet}\n`);
                    } else if (typeof section.content === 'object') {
                        Object.entries(section.content).forEach(([k, v]) => md += `- **${k}**: ${v}\n`);
                    } else {
                        md += `${section.content}\n`;
                    }
                    md += `\n`;
                });
            }

            if (item.overview) {
                md += `### Overview\n${item.overview.whatItIs || ''}\n\n`;
            }

            if (item.assessments) {
                md += `### Assessments\n`;
                item.assessments.forEach((ass: any) => {
                    if (ass.isPlaceholder) return;
                    md += `#### ${ass.name}\n${ass.description}\n\n`;
                });
            }

            md += `---\n\n`;
        });
    } else if (typeof data === 'object') {
        Object.entries(data).forEach(([key, val]: [string, any]) => {
            md += `## ${val.title || key}\n\n`;
            if (val.overview) {
                md += `### Overview\n`;
                md += `**What it is**: ${val.overview.whatItIs || 'N/A'}\n\n`;
                md += `**Symptoms**: ${val.overview.symptoms?.join(', ') || 'N/A'}\n\n`;
                md += `**Clinical Pearl**: ${val.overview.clinicalPearl || 'N/A'}\n\n`;
            }
            if (val.assessments) {
                md += `### Key Assessments\n`;
                val.assessments.forEach((ass: any) => {
                    if (ass.isPlaceholder) return;
                    md += `- **${ass.name}**: ${ass.description} (Target: ${ass.population})\n`;
                });
                md += `\n`;
            }
            if (val.treatments) {
                md += `### Treatments\n`;
                val.treatments.forEach((t: any) => {
                    md += `#### ${t.name}\n${t.description}\n- **Instructions**: ${t.instructions || 'See guide'}\n\n`;
                });
            }
            md += `---\n\n`;
        });
    }

    return md;
}

// Process Ensign SLP Corner
fs.writeFileSync(path.join(OUTPUT_DIR, 'Ensign_SLP_Guidelines.md'), convertToMarkdown(ENSIGN_SLP_CORNER_DATA, 'Ensign SLP Guidelines'));

// Process Subspecialties
fs.writeFileSync(path.join(OUTPUT_DIR, 'Clinical_Subspecialties.md'), convertToMarkdown(SUBSPECIALTY_DATA, 'Clinical Subspecialty Reference'));

// Process Medicare
fs.writeFileSync(path.join(OUTPUT_DIR, 'Medicare_Knowledge_Base.md'), convertToMarkdown(MEDICARE_KNOWLEDGE_BASE, 'Medicare Compliance & Guidelines'));

console.log('Knowledge extraction complete!');
