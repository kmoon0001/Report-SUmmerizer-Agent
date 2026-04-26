import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const SITE_API = '/sites/PacificCoast_SLP/_api';
const SITE_PAGES_ROOT = '/sites/PacificCoast_SLP/SitePages';
const ASSET_FOLDER = '/sites/PacificCoast_SLP/SiteAssets/SLP-Portal-Migration';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge');

const apply = process.argv.includes('--apply');
const skipHome = process.argv.includes('--skip-home');
const skipNav = process.argv.includes('--skip-nav');

const sourceLinks = {
  ashaPortal: 'https://www.asha.org/practice-portal/',
  ashaAac: 'https://www.asha.org/Practice-Portal/Professional-Issues/Augmentative-and-Alternative-Communication/',
  ashaAphasia: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/',
  medicareSlp: 'https://www.medicare.gov/coverage/speech-language-pathology-services',
  cmsBilling: 'https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866',
  cmsManual: 'https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf'
};

const imageAssets = [
  { key: 'background', source: 'public/slp portal background.jpg', fileName: 'slp-portal-background.jpg' },
  { key: 'dysphagia', source: 'public/assets/clinical/dysphagia.png', fileName: 'dysphagia.png' },
  { key: 'aphasia', source: 'public/assets/clinical/aphasia.png', fileName: 'aphasia.png' },
  { key: 'cognitive', source: 'public/assets/clinical/cognitive.png', fileName: 'cognitive.png' },
  { key: 'motor-speech', source: 'public/assets/clinical/motor_speech.png', fileName: 'motor-speech.png' },
  { key: 'voice', source: 'public/assets/clinical/voice.png', fileName: 'voice.png' },
  { key: 'aac', source: 'public/assets/clinical/cranial_nerves.png', fileName: 'aac-cranial-nerves.png' },
  { key: 'medicare', source: 'public/assets/clinical/iddsi_pyramid.png', fileName: 'medicare-iddsi.png' },
  { key: 'documentation', source: 'public/assets/clinical/vfss.png', fileName: 'documentation-vfss.png' },
  { key: 'trach', source: 'public/assets/clinical/trach_valve.png', fileName: 'trach-valve.png' },
  { key: 'fees', source: 'public/assets/clinical/fees.png', fileName: 'fees.png' },
  { key: 'brain', source: 'public/assets/clinical/mri_brain.png', fileName: 'mri-brain.png' },
  { key: 'ct-brain', source: 'public/assets/clinical/ct_brain.png', fileName: 'ct-brain.png' },
  { key: 'chest-xray', source: 'public/assets/clinical/chest_xray.png', fileName: 'chest-xray.png' },
  { key: 'pharyngeal', source: 'public/assets/clinical/pharyngeal_muscles.png', fileName: 'pharyngeal-muscles.png' },
  { key: 'vocal-folds', source: 'public/assets/clinical/vocal_folds.png', fileName: 'vocal-folds.png' }
];

const imageUrlByKey = Object.fromEntries(imageAssets.map((asset) => [
  asset.key,
  `${ASSET_FOLDER}/${asset.fileName}`.replaceAll(' ', '%20')
]));

const pages = [
  {
    fileName: 'SLP-Portal.aspx',
    title: 'Pacific Coast SLP Portal',
    imageKey: 'brain',
    summary: 'PHI-minimized SharePoint launch page for the SLP portal while the SPFx package awaits App Catalog deployment.',
    sections: [
      {
        heading: 'Clinical modules',
        bullets: [
          'Dysphagia: swallowing diagnostics, treatment protocols, instrumental support, and diet management.',
          'Aphasia: language rehabilitation workflows, impairment-based treatment tracks, and communication supports.',
          'Cognitive-Communication: cognitive-linguistic treatment planning, function-oriented tasks, and reasoning supports.',
          'Motor Speech: dysarthria evaluation, cueing hierarchies, and speech subsystem focus.',
          'Voice: voice hygiene, treatment programs, and clinical reference.',
          'AAC Hub: communication boards, access planning, and partner training.'
        ]
      },
      {
        heading: 'Workflow modules',
        bullets: [
          'Documentation Studio, Therapy Studio, Goal Generator, and Three-Way Eval remain SPFx-pending interactive modules.',
          'This bridge provides navigation and authoritative reference links only.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.medicareSlp, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Dysphagia.aspx',
    title: 'SLP Dysphagia',
    imageKey: 'dysphagia',
    summary: 'Reference page for swallowing diagnostics, treatment protocols, instrumental support, and diet-management orientation.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local SPFx Dysphagia module.',
          'Interactive decision support remains SPFx pending.',
          'Use this page as a reference launch point, not as a documentation workspace.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.medicareSlp, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Aphasia.aspx',
    title: 'SLP Aphasia',
    imageKey: 'aphasia',
    summary: 'Reference page for aphasia screening, therapy supports, caregiver communication supports, and AAC coordination.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local AphasiaTools module.',
          'ASHA notes that aphasia screening identifies need for further assessment and should be culturally and linguistically responsive.',
          'Use this page for vetted references; do not enter patient language samples here.'
        ]
      }
    ],
    links: [sourceLinks.ashaAphasia, sourceLinks.ashaAac, sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Cognitive-Communication.aspx',
    title: 'SLP Cognitive-Communication',
    imageKey: 'cognitive',
    summary: 'Reference page for functional cognition, cognitive-linguistic treatment planning, and task-library orientation.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local CognitiveModule.',
          'Interactive task customization remains SPFx pending.',
          'No resident-specific cognition data belongs on this SharePoint page.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.medicareSlp, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Motor-Speech.aspx',
    title: 'SLP Motor Speech',
    imageKey: 'motor-speech',
    summary: 'Reference page for motor speech assessment, treatment cueing, and subsystem-focused clinical reasoning.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local MotorSpeechModule.',
          'Cueing tools and interactive supports remain SPFx pending.',
          'Keep patient-specific performance notes in approved clinical systems only.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Voice.aspx',
    title: 'SLP Voice',
    imageKey: 'voice',
    summary: 'Reference page for voice evaluation, vocal hygiene, treatment-program orientation, and related clinical references.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local VoiceModule.',
          'Interactive therapy-program generation remains SPFx pending.',
          'This page stores no voice samples, recordings, or patient identifiers.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-AAC.aspx',
    title: 'SLP AAC Hub',
    imageKey: 'aac',
    summary: 'Reference page for AAC access planning, partner training, communication supports, and acquired-disability coordination.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local AACModule.',
          'ASHA describes AAC as support that supplements or compensates for speech-language production or comprehension impairments.',
          'Communication-board generation and customization remain SPFx pending.'
        ]
      }
    ],
    links: [sourceLinks.ashaAac, sourceLinks.ashaAphasia, sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Medicare-Compliance.aspx',
    title: 'SLP Medicare and Compliance',
    imageKey: 'medicare',
    summary: 'Reference page for Medicare coverage, medical necessity, skilled-service documentation, and audit-ready framing.',
    sections: [
      {
        heading: 'Compliance anchors',
        bullets: [
          'Medicare Part B covers medically necessary outpatient SLP services for eligible beneficiaries.',
          'Documentation must support medical necessity and the skilled nature of treatment.',
          'Diagnosis alone is not enough to establish whether skilled therapy is needed.'
        ]
      }
    ],
    links: [sourceLinks.medicareSlp, sourceLinks.cmsBilling, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Documentation-Studio.aspx',
    title: 'SLP Documentation Studio',
    imageKey: 'documentation',
    summary: 'SPFx-pending workflow page for documentation drafting and compliance framing.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local DocumentationStudio module.',
          'This SharePoint-native bridge intentionally does not include note entry, AI drafting, or generated documentation persistence.',
          'Use approved clinical documentation systems for patient-specific content.'
        ]
      }
    ],
    links: [sourceLinks.cmsBilling, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-IDDSI.aspx',
    title: 'SLP IDDSI and Diet Texture Hub',
    imageKey: 'medicare',
    summary: 'Read-only bridge page for IDDSI orientation, diet-texture consistency, and SPFx-pending testing/planner workflows.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from IDDSIGuide, IDDSIGourmetGuide, and IDDSIDietRecommender.',
          'The original local module includes testing, lab, planner, and recommender surfaces; those remain SPFx pending.',
          'This SharePoint page provides reference orientation only and does not collect food trials, patient names, or diet orders.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use approved facility policy and treating clinician judgment for diet orders.',
          'Keep patient-specific diet recommendations in approved clinical systems only.',
          'Use the SPFx production app for any interactive testing workflow once deployed.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Instrumentals.aspx',
    title: 'SLP Instrumentals Hub',
    imageKey: 'fees',
    summary: 'Read-only bridge page for VFSS/MBSS, FEES, imaging, referral-process orientation, and instrumental decision support.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from InstrumentalsGuide plus local VFSS, FEES, chest X-ray, and brain-imaging assets.',
          'Comparison, decision guide, and referral-process workflows remain SPFx pending.',
          'This page is a navigation and reference bridge, not a replacement for facility instrumental protocols.'
        ]
      },
      {
        heading: 'Reference images available',
        bullets: [
          'VFSS image asset',
          'FEES image asset',
          'Chest X-ray image asset',
          'MRI and CT brain image assets'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Trach-Vent.aspx',
    title: 'SLP Trach and Vent Hub',
    imageKey: 'trach',
    summary: 'Read-only bridge page for trach/vent communication, airway, swallowing coordination, speaking-valve readiness, and troubleshooting orientation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from TrachVentGuide.',
          'The local module sections include anatomy and basics, assessment, speaking valves, troubleshooting, and evidence/templates.',
          'Interactive readiness workflows remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use interdisciplinary facility protocols for airway and speaking-valve decisions.',
          'Do not document patient-specific respiratory status, ventilator settings, or assessment results on this SharePoint page.',
          'Keep patient-specific clinical information in approved systems only.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Anatomy-Neuro.aspx',
    title: 'SLP Anatomy and Neuro Lab',
    imageKey: 'brain',
    summary: 'Read-only bridge page for head/neck anatomy, larynx, pharynx, brain, cranial nerves, and neuroanatomy orientation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from AnatomyLab and BrainAnatomyExplorer.',
          'The local module includes larynx, pharynx, brain and cranial nerves, and interactive anatomy assets.',
          '3D and interactive exploration remain SPFx pending.'
        ]
      },
      {
        heading: 'Reference images available',
        bullets: [
          'MRI brain',
          'CT brain',
          'Cranial nerves',
          'Pharyngeal muscles',
          'Vocal folds'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Goal-Bank.aspx',
    title: 'SLP Goal Bank Reference',
    imageKey: 'cognitive',
    summary: 'Read-only bridge page for local goal-bank categories and examples, with patient-specific drafting kept out of SharePoint.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/goal-bank.ts and the local GoalGenerator module.',
          'Local categories include Swallowing, Expressive Language, Memory, Motor Speech, and Voice.',
          'Goal generation, editing, and patient-specific wording remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use goal examples as structure references only.',
          'Do not paste patient names, identifiers, dates of birth, facility IDs, or patient-specific status into this SharePoint page.',
          'Final goals belong in approved clinical documentation systems.'
        ]
      }
    ],
    links: [sourceLinks.cmsBilling, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Treatment-Ideas.aspx',
    title: 'SLP Treatment Ideas Library',
    imageKey: 'aphasia',
    summary: 'Read-only bridge page for treatment-idea categories from the local app, with activity customization kept SPFx pending.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/treatment-ideas.ts and TreatmentIdeas.',
          'Local treatment categories include Dysphagia, Aphasia, Cognition, Voice, AAC, and Pediatric.',
          'Activity customization and patient-specific planning remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use the page as an idea index and launch point only.',
          'Do not store session plans, patient responses, or progress notes here.',
          'Use approved systems for individualized treatment documentation.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Quick-Reference.aspx',
    title: 'SLP Quick Reference',
    imageKey: 'vocal-folds',
    summary: 'Read-only bridge page for quick-reference categories from the local SLP cheat sheet.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from SLPCheatSheet.',
          'Local quick-reference categories include Dysphagia, Dysarthria, Aphasia/Language, Cognitive Communication, and Bedside Assessments.',
          'This SharePoint page is a static bridge; searchable/interactive quick-reference behavior remains SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use for orientation and recall support only.',
          'Follow facility policies, payer requirements, and clinician judgment.',
          'Do not enter patient-specific assessment results or clinical notes here.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsBilling]
  }
];

const navLinks = [
  { title: 'SLP Portal', fileName: 'SLP-Portal.aspx' },
  { title: 'SLP Dysphagia', fileName: 'SLP-Dysphagia.aspx' },
  { title: 'SLP Aphasia', fileName: 'SLP-Aphasia.aspx' },
  { title: 'SLP Cognitive-Communication', fileName: 'SLP-Cognitive-Communication.aspx' },
  { title: 'SLP Medicare', fileName: 'SLP-Medicare-Compliance.aspx' },
  { title: 'SLP IDDSI', fileName: 'SLP-IDDSI.aspx' },
  { title: 'SLP Instrumentals', fileName: 'SLP-Instrumentals.aspx' },
  { title: 'SLP Trach/Vent', fileName: 'SLP-Trach-Vent.aspx' },
  { title: 'SLP Quick Reference', fileName: 'SLP-Quick-Reference.aspx' }
];

const navigationCleanupTitles = [
  'Remote learning',
  'Courses',
  'Learn a new language',
  'Learn a new skill',
  'Get involved',
  '/QM_Mock_Data',
  'SLP_Patients',
  'SLP_SessionNotes',
  'SLP_Goals',
  'SLP_ReviewQueue'
];

function htmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderPageHtml(page) {
  const heroImage = imageUrlByKey[page.imageKey] || imageUrlByKey.background;
  const isHome = page.fileName === 'SLP-Portal.aspx';
  const primaryLinks = [
    { label: 'Open Dysphagia', fileName: 'SLP-Dysphagia.aspx' },
    { label: 'Open Aphasia', fileName: 'SLP-Aphasia.aspx' },
    { label: 'Medicare & Compliance', fileName: 'SLP-Medicare-Compliance.aspx' },
    { label: 'Documentation Studio', fileName: 'SLP-Documentation-Studio.aspx' }
  ].map((link) => `<a href="/sites/PacificCoast_SLP/SitePages/${htmlEscape(link.fileName)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 14px;border-radius:6px;background:#0f6cbd;color:#ffffff;text-decoration:none;font-weight:600;">${htmlEscape(link.label)}</a>`).join('');

  const relatedLinks = pages
    .filter((item) => item.fileName !== page.fileName)
    .slice(0, page.fileName === 'SLP-Portal.aspx' ? pages.length : 5)
    .map((item) => `<li><a href="/sites/PacificCoast_SLP/SitePages/${htmlEscape(item.fileName)}">${htmlEscape(item.title)}</a></li>`)
    .join('');

  const moduleCards = pages
    .filter((item) => item.fileName !== 'SLP-Portal.aspx')
    .map((item) => {
      const itemImage = imageUrlByKey[item.imageKey] || imageUrlByKey.background;
      return `
      <div style="border:1px solid #d0d7de;border-radius:8px;margin:0 0 14px 0;overflow:hidden;background:#ffffff;box-shadow:0 1px 2px rgba(0,0,0,0.08);">
        <img src="${htmlEscape(itemImage)}" alt="${htmlEscape(item.title)} module image" style="width:100%;max-height:190px;object-fit:cover;display:block;" />
        <div style="padding:14px 16px;">
          <h3 style="margin:0 0 6px 0;"><a href="/sites/PacificCoast_SLP/SitePages/${htmlEscape(item.fileName)}">${htmlEscape(item.title)}</a></h3>
          <p style="margin:0 0 10px 0;">${htmlEscape(item.summary)}</p>
          <p style="margin:0;"><span style="display:inline-block;padding:3px 8px;border-radius:999px;background:#eef6ff;color:#0f4761;font-size:12px;font-weight:700;">Reference now</span> <span style="display:inline-block;padding:3px 8px;border-radius:999px;background:#fff4ce;color:#5c3b00;font-size:12px;font-weight:700;">SPFx pending</span></p>
        </div>
      </div>
    `;
    }).join('');

  const homepageOnly = isHome ? `
    <div style="border-left:5px solid #107c10;background:#f0f8f0;padding:14px 16px;margin:18px 0;border-radius:6px;">
      <h2 style="margin-top:0;">Launch actions</h2>
      <p style="margin:0 0 10px 0;">Start with a clinical domain, compliance reference, or the SPFx-pending documentation workspace.</p>
      <p style="margin:0;">${primaryLinks}</p>
    </div>
    <h2>SLP service map</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:0 0 20px 0;">
      <div style="border:1px solid #d0d7de;border-radius:8px;padding:16px;background:#ffffff;">
        <h3 style="margin-top:0;">Swallowing and Airway</h3>
        <p>Dysphagia, instrumental references, IDDSI orientation, airway coordination, and trach/vent readiness.</p>
      </div>
      <div style="border:1px solid #d0d7de;border-radius:8px;padding:16px;background:#ffffff;">
        <h3 style="margin-top:0;">Communication and Cognition</h3>
        <p>Aphasia, AAC access, cognitive-communication treatment planning, voice, fluency, and motor speech supports.</p>
      </div>
      <div style="border:1px solid #d0d7de;border-radius:8px;padding:16px;background:#ffffff;">
        <h3 style="margin-top:0;">Documentation and Medicare</h3>
        <p>Medicare coverage anchors, skilled-service language, documentation boundaries, and SPFx-pending draft workflows.</p>
      </div>
    </div>
    <h2>Portal map</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">${moduleCards}</div>
    <h2>Daily-use workflow</h2>
    <ol>
      <li>Start with the relevant clinical module or Medicare/compliance reference.</li>
      <li>Use authoritative references for clinical framing and documentation requirements.</li>
      <li>Keep patient-specific work in approved clinical systems until the SPFx app is deployed.</li>
      <li>Return to the SPFx production package for interactive tools when App Catalog deployment is available.</li>
    </ol>
  ` : '';

  const sections = page.sections.map((section) => `
    <h2>${htmlEscape(section.heading)}</h2>
    <ul>${section.bullets.map((item) => `<li>${htmlEscape(item)}</li>`).join('')}</ul>
  `).join('');

  const links = page.links.map((href) => `<li><a href="${htmlEscape(href)}">${htmlEscape(href)}</a></li>`).join('');

  return `
    <div style="border:1px solid #d0d7de;border-radius:8px;overflow:hidden;background:#ffffff;margin-bottom:18px;box-shadow:0 1px 3px rgba(0,0,0,0.10);">
      <img src="${htmlEscape(heroImage)}" alt="${htmlEscape(page.title)} hero image" style="width:100%;max-height:280px;object-fit:cover;display:block;" />
      <div style="padding:16px 18px;">
    <h1>${htmlEscape(page.title)}</h1>
    <p>${htmlEscape(page.summary)}</p>
    <p style="margin:12px 0 0 0;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef6ff;color:#0f4761;font-weight:700;">SharePoint-native bridge</span> <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#f0f8f0;color:#0b6a0b;font-weight:700;">Non-PHI</span> <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4ce;color:#5c3b00;font-weight:700;">SPFx production pending</span></p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:0 0 18px 0;">
      <div style="border:1px solid #d0d7de;border-radius:8px;padding:14px;background:#ffffff;"><strong>Production path</strong><br />PHI-minimized SPFx full-page portal package.</div>
      <div style="border:1px solid #d0d7de;border-radius:8px;padding:14px;background:#ffffff;"><strong>Bridge purpose</strong><br />SharePoint-native reference and navigation while App Catalog deployment is pending.</div>
      <div style="border:1px solid #d0d7de;border-radius:8px;padding:14px;background:#ffffff;"><strong>Clinical boundary</strong><br />Reference, orientation, and compliance anchors only. No patient-specific data entry.</div>
    </div>
    <div style="border:1px solid #f2c94c;border-left:5px solid #f2c94c;background:#fffdf3;padding:14px 16px;border-radius:6px;margin:0 0 18px 0;">
    <h2>PHI guardrails</h2>
    <ul>
      <li>No patient tracker, resident list, identifiers, or PHI fields belong on this bridge page.</li>
      <li>Do not paste patient-specific notes, evaluation text, recordings, or treatment data into SharePoint page content.</li>
      <li>Interactive drafting and clinical workflow tools remain pending until the SPFx package is deployed.</li>
    </ul>
    </div>
    ${homepageOnly}
    ${sections}
    <h2>Related SLP pages</h2>
    <ul>${relatedLinks}</ul>
    <h2>Authoritative references</h2>
    <ul>${links}</ul>
    <p><strong>Production note:</strong> This page is a SharePoint-native bridge. The production app remains the PHI-minimized SPFx portal package, so interactive workflow behavior is SPFx pending.</p>
  `.replace(/\n\s+/g, '\n').trim();
}

function makeTextCanvas(page) {
  return JSON.stringify([{
    controlType: 4,
    id: crypto.randomUUID(),
    position: {
      zoneIndex: 1,
      sectionIndex: 1,
      controlIndex: 1,
      layoutIndex: 1
    },
    displayMode: 2,
    editorType: 'CKEditor',
    innerHTML: renderPageHtml(page)
  }]);
}

async function getDigest(browserPage) {
  const digest = await browserPage.evaluate(async () => {
    const response = await fetch('/sites/PacificCoast_SLP/_api/contextinfo', {
      method: 'POST',
      headers: { Accept: 'application/json;odata=nometadata' }
    });
    if (!response.ok) {
      throw new Error(`contextinfo failed: ${response.status} ${await response.text()}`);
    }
    const json = await response.json();
    return json.FormDigestValue;
  });
  return digest;
}

async function createOrUpdatePage(browserPage, digest, pageModel) {
  const serverRelativeUrl = `${SITE_PAGES_ROOT}/${pageModel.fileName}`;
  const canvas = makeTextCanvas(pageModel);
  const html = renderPageHtml(pageModel);

  return browserPage.evaluate(async ({ siteApi, serverRelativeUrl, sitePagesRoot, fileName, title, canvas, html, digest }) => {
    const headers = {
      Accept: 'application/json;odata=nometadata',
      'Content-Type': 'application/json;odata=nometadata',
      'X-RequestDigest': digest
    };

    async function request(url, options = {}) {
      const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
      const bodyText = await response.text();
      let body = null;
      try {
        body = bodyText ? JSON.parse(bodyText) : null;
      } catch {
        body = bodyText;
      }
      if (!response.ok) {
        throw new Error(`${options.method || 'GET'} ${url} failed: ${response.status} ${bodyText}`);
      }
      return body;
    }

    let fileExists = true;
    const encodedFileUrl = serverRelativeUrl.replaceAll("'", "''");
    const fileProbe = await fetch(`${siteApi}/web/GetFileByServerRelativeUrl('${encodedFileUrl}')`, {
      headers: { Accept: 'application/json;odata=nometadata' }
    });
    if (fileProbe.status === 404) {
      fileExists = false;
    } else if (!fileProbe.ok) {
      throw new Error(`File probe failed: ${fileProbe.status} ${await fileProbe.text()}`);
    }

    if (!fileExists) {
      await request(`${siteApi}/web/GetFolderByServerRelativeUrl('${sitePagesRoot}')/Files/AddTemplateFile(urlOfFile='${serverRelativeUrl}',templateFileType=1)`, {
        method: 'POST'
      });
    }

    await request(`${siteApi}/web/GetFileByServerRelativeUrl('${encodedFileUrl}')/ListItemAllFields?$select=Id`);

    await request(`${siteApi}/web/GetFileByServerRelativeUrl('${encodedFileUrl}')/ListItemAllFields`, {
      method: 'POST',
      headers: {
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE'
      },
      body: JSON.stringify({
        Title: title,
        CanvasContent1: canvas,
        WikiField: html
      })
    });

    const publishResponse = await fetch(`${siteApi}/web/GetFileByServerRelativeUrl('${encodedFileUrl}')/Publish('SLP portal bridge update')`, {
      method: 'POST',
      headers
    });

    return {
      fileName,
      created: !fileExists,
      updated: true,
      publishStatus: publishResponse.status,
      publishBody: (await publishResponse.text()).slice(0, 500)
    };
  }, {
    siteApi: SITE_API,
    serverRelativeUrl,
    sitePagesRoot: SITE_PAGES_ROOT,
    fileName: pageModel.fileName,
    title: pageModel.title,
    canvas,
    html,
    digest
  });
}

async function dryRun() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = pages.map((page) => ({
    fileName: page.fileName,
    title: page.title,
    siteUrl: `${SITE_URL}/SitePages/${page.fileName}`,
    hasPhiGuardrails: renderPageHtml(page).includes('No patient tracker')
  }));

  await writeFile(path.join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  for (const page of pages) {
    await writeFile(path.join(OUT_DIR, page.fileName.replace(/\.aspx$/i, '.html')), renderPageHtml(page), 'utf8');
  }
  console.log(`Dry run complete. Wrote ${pages.length} page previews to ${OUT_DIR}`);
}

async function applyToSharePoint() {
  await readFile(AUTH_STATE, 'utf8');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: AUTH_STATE });
  const browserPage = await context.newPage();
  await browserPage.goto(SITE_URL, { waitUntil: 'domcontentloaded' });
  const digest = await getDigest(browserPage);
  const results = [];

  results.push(await uploadImageAssets(browserPage, digest));

  for (const pageModel of pages) {
    results.push(await createOrUpdatePage(browserPage, digest, pageModel));
  }

  if (!skipHome) {
    results.push(await setHomePage(browserPage, digest));
  }

  if (!skipNav) {
    results.push(await addNavigationLinks(browserPage, digest));
    results.push(await cleanupNavigationLinks(browserPage, digest));
  }

  await browser.close();
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, 'apply-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(results, null, 2));
}

async function uploadImageAssets(browserPage, digest) {
  const assets = [];
  for (const asset of imageAssets) {
    const buffer = await readFile(path.join(ROOT, asset.source));
    assets.push({
      ...asset,
      bytes: Array.from(buffer)
    });
  }

  return browserPage.evaluate(async ({ digest, assets, assetFolder }) => {
    const headers = {
      Accept: 'application/json;odata=nometadata',
      'X-RequestDigest': digest
    };

    async function ensureFolder(serverRelativeUrl) {
      const probe = await fetch(`/sites/PacificCoast_SLP/_api/web/GetFolderByServerRelativeUrl('${serverRelativeUrl.replaceAll("'", "''")}')`, {
        headers: { Accept: 'application/json;odata=nometadata' }
      });
      if (probe.ok) return;
      if (probe.status !== 404) {
        throw new Error(`Folder probe failed: ${probe.status} ${await probe.text()}`);
      }
      const parent = serverRelativeUrl.slice(0, serverRelativeUrl.lastIndexOf('/'));
      const leaf = serverRelativeUrl.slice(serverRelativeUrl.lastIndexOf('/') + 1);
      const create = await fetch(`/sites/PacificCoast_SLP/_api/web/GetFolderByServerRelativeUrl('${parent.replaceAll("'", "''")}')/Folders/add('${leaf.replaceAll("'", "''")}')`, {
        method: 'POST',
        headers
      });
      if (!create.ok) {
        throw new Error(`Folder create failed: ${create.status} ${await create.text()}`);
      }
    }

    await ensureFolder(assetFolder);
    const uploaded = [];

    for (const asset of assets) {
      const bytes = new Uint8Array(asset.bytes);
      const response = await fetch(`/sites/PacificCoast_SLP/_api/web/GetFolderByServerRelativeUrl('${assetFolder.replaceAll("'", "''")}')/Files/add(url='${asset.fileName.replaceAll("'", "''")}',overwrite=true)`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/octet-stream'
        },
        body: bytes
      });
      uploaded.push({
        fileName: asset.fileName,
        source: asset.source,
        status: response.status,
        body: (await response.text()).slice(0, 300)
      });
      if (!response.ok) {
        throw new Error(`Asset upload failed for ${asset.fileName}: ${response.status}`);
      }
    }

    return { action: 'upload-assets', target: assetFolder, uploaded };
  }, { digest, assets, assetFolder: ASSET_FOLDER });
}

async function setHomePage(browserPage, digest) {
  return browserPage.evaluate(async ({ digest }) => {
    const response = await fetch('/sites/PacificCoast_SLP/_api/web/rootfolder', {
      method: 'POST',
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata',
        'X-RequestDigest': digest,
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE'
      },
      body: JSON.stringify({ WelcomePage: 'SitePages/SLP-Portal.aspx' })
    });
    return {
      action: 'set-homepage',
      target: 'SitePages/SLP-Portal.aspx',
      status: response.status,
      body: (await response.text()).slice(0, 500)
    };
  }, { digest });
}

async function addNavigationLinks(browserPage, digest) {
  return browserPage.evaluate(async ({ digest, navLinks }) => {
    const api = '/sites/PacificCoast_SLP/_api';
    const existingResponse = await fetch(`${api}/web/navigation/QuickLaunch`, {
      headers: { Accept: 'application/json;odata=nometadata' }
    });
    const existingJson = existingResponse.ok ? await existingResponse.json() : { value: [] };
    const existing = new Set((existingJson.value || []).map((node) => `${node.Title}|${node.Url}`.toLowerCase()));
    const results = [];

    for (const link of navLinks) {
      const url = `/sites/PacificCoast_SLP/SitePages/${link.fileName}`;
      const key = `${link.title}|${url}`.toLowerCase();
      if (existing.has(key)) {
        results.push({ title: link.title, url, skipped: true, reason: 'already exists' });
        continue;
      }

      const response = await fetch(`${api}/web/navigation/QuickLaunch`, {
        method: 'POST',
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata',
          'X-RequestDigest': digest
        },
        body: JSON.stringify({
          Title: link.title,
          Url: url,
          IsExternal: false
        })
      });

      results.push({
        title: link.title,
        url,
        status: response.status,
        body: (await response.text()).slice(0, 500)
      });
    }

    return { action: 'add-navigation', target: 'QuickLaunch', results };
  }, { digest, navLinks });
}

async function cleanupNavigationLinks(browserPage, digest) {
  return browserPage.evaluate(async ({ digest, cleanupTitles }) => {
    const api = '/sites/PacificCoast_SLP/_api';
    const cleanup = new Set(cleanupTitles.map((title) => title.toLowerCase()));
    const headers = {
      Accept: 'application/json;odata=nometadata',
      'X-RequestDigest': digest,
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE'
    };

    const top = await fetch(`${api}/web/navigation/QuickLaunch`, {
      headers: { Accept: 'application/json;odata=nometadata' }
    }).then((response) => response.json());

    const removed = [];

    async function removeNode(node) {
      const response = await fetch(`${api}/web/navigation/GetNodeById(${node.Id})`, {
        method: 'POST',
        headers
      });
      removed.push({
        title: node.Title,
        id: node.Id,
        status: response.status,
        body: (await response.text()).slice(0, 300)
      });
    }

    for (const node of top.value || []) {
      const children = await fetch(`${api}/web/navigation/GetNodeById(${node.Id})/Children`, {
        headers: { Accept: 'application/json;odata=nometadata' }
      }).then((response) => response.json()).catch(() => ({ value: [] }));

      for (const child of children.value || []) {
        if (cleanup.has(String(child.Title).toLowerCase())) {
          await removeNode(child);
        }
      }

      if (cleanup.has(String(node.Title).toLowerCase())) {
        await removeNode(node);
      }
    }

    return { action: 'cleanup-navigation', target: 'QuickLaunch', removed };
  }, { digest, cleanupTitles: navigationCleanupTitles });
}

if (apply) {
  await applyToSharePoint();
} else {
  await dryRun();
}
