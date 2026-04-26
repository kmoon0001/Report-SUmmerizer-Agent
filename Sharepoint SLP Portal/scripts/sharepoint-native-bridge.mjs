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

async function loadClinicalKnowledgeIndexPreview() {
  try {
    const json = JSON.parse(await readFile(path.join(OUT_DIR, 'clinical-knowledge-index-preview.json'), 'utf8'));
    const candidateItems = (json.index || [])
      .filter((item) => item.reviewStatus === 'candidate')
      .slice(0, 8)
      .map((item) => `${item.title} (${item.clinicalArea})`);
    const holdItems = (json.index || [])
      .filter((item) => item.reviewStatus === 'hold')
      .map((item) => `${item.title} (${item.sourcePath || item.fileName || 'source item'})`);
    return { summary: json.summary || {}, candidateItems, holdItems };
  } catch {
    return {
      summary: {},
      candidateItems: [],
      holdItems: []
    };
  }
}

const clinicalKnowledgeIndexPreview = await loadClinicalKnowledgeIndexPreview();

const sourceLinks = {
  ashaPortal: 'https://www.asha.org/practice-portal/',
  ashaAac: 'https://www.asha.org/Practice-Portal/Professional-Issues/Augmentative-and-Alternative-Communication/',
  ashaAphasia: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/',
  medicareSlp: 'https://www.medicare.gov/coverage/speech-language-pathology-services',
  cmsBilling: 'https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866',
  cmsManual: 'https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf'
};

const imageAssets = [
  { key: 'pacific-coast-logo', source: 'C:/Users/kevin/Desktop/Images/2025 Logo.png', fileName: 'pacific-coast-2025-logo.png' },
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
    imageKey: 'pacific-coast-logo',
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
  },
  {
    fileName: 'SLP-Coding-Reference.aspx',
    title: 'SLP Coding Reference',
    imageKey: 'documentation',
    summary: 'Read-only bridge page for local CPT and coding reference categories, with billing decisions kept tied to payer rules and approved workflows.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/coding-data.ts.',
          'Local coding categories include Evaluation, Treatment, AAC, and related reference groupings.',
          'This page is a static reference bridge, not a billing engine or payer determination tool.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Confirm coding requirements against current payer guidance and facility billing workflows.',
          'Do not store patient identifiers, dates of service, diagnoses, or billing claims on this page.',
          'Use approved billing and clinical documentation systems for final code selection and claim support.'
        ]
      }
    ],
    links: [sourceLinks.cmsBilling, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Clinical-Pathways.aspx',
    title: 'SLP Clinical Pathways',
    imageKey: 'brain',
    summary: 'Read-only bridge page for local clinical pathway categories, symptoms, assessment options, treatment options, strategies, and red-flag orientation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/pathways-data.ts and ClinicalPathways.',
          'Local pathway categories include Dysphagia, Cognition, Aphasia, Dysarthria/Voice, and Tracheostomy.',
          'Interactive branching, symptom selection, and patient-specific recommendations remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use pathways as an orientation and clinical reasoning scaffold only.',
          'Do not enter patient symptoms, medications, imaging results, lab values, or diagnosis details into this SharePoint page.',
          'Escalate red flags through facility clinical protocols and approved documentation systems.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Ensign-Corner.aspx',
    title: 'Ensign SLP Corner',
    imageKey: 'cognitive',
    summary: 'Read-only bridge page for local Ensign SLP Corner training, evaluation, documentation, clinical, billing, compliance, and program-development resources.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/ensign-slp-data.ts and EnsignSLPCorner.',
          'Local content categories include Evaluation, Documentation, Clinical, Billing, Compliance, Infographics, and Program Development.',
          'Interactive browsing and richer filtering remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use as an internal training and reference launch point.',
          'Do not add patient-specific information or facility-sensitive notes to this SharePoint page.',
          'Keep policy interpretation aligned with official Ensign, facility, payer, and regulatory sources.'
        ]
      }
    ],
    links: [sourceLinks.cmsBilling, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Staff-Learning.aspx',
    title: 'SLP Staff Learning',
    imageKey: 'aphasia',
    summary: 'Read-only bridge page for local staff learning and quiz-style reference material.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/quiz-data.ts.',
          'Local question areas include cranial nerves, swallowing, aphasia, cognition, voice, motor speech, and assessments.',
          'Interactive quiz mode and scoring remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use as staff learning orientation only.',
          'Do not record staff performance, patient examples, or identifiable clinical scenarios on this SharePoint page.',
          'Use official training systems for tracked education or compliance records.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Document-Library-Guide.aspx',
    title: 'SLP Document Library Guide',
    imageKey: 'documentation',
    summary: 'Read-only bridge page for local document-guide categories and the SharePoint source PDF library.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/data/documents.ts, PDFLibrary, and SLP_Portal_Source_PDFs.',
          'Local document categories include guides, best practices, and handout-style references.',
          'This page points users toward controlled SharePoint source documents rather than duplicating patient-specific material.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Keep source documents non-PHI and version controlled.',
          'Do not upload patient handouts containing identifiers to the public/shared source PDF library.',
          'Use approved clinical systems for individualized handouts and documentation.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Clinical-Calculators.aspx',
    title: 'SLP Clinical Calculators',
    imageKey: 'cognitive',
    summary: 'Read-only bridge page for local calculator coverage, scoring references, and SPFx-pending interactive scoring workflows.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ClinicalCalculators.tsx and src/utils/clinical-calculators.ts.',
          'Local calculator coverage includes MoCA, GDS, WAB-R, respiratory-swallow phase timing, MASA, EAT-10, GUSS, FLCI, AIDS, and FDA-2 style scoring references.',
          'This SharePoint page documents calculator availability and safe use; interactive scoring remains SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Do not enter patient scores, identifiers, dates of service, or assessment results on this SharePoint page.',
          'Use official test materials, licensing requirements, and approved clinical systems for scored assessments.',
          'Use calculated results as clinician-support information, not a substitute for clinical judgment or payer documentation requirements.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Clinical-Exams.aspx',
    title: 'SLP Clinical Exams and Cranial Nerves',
    imageKey: 'aac',
    summary: 'Read-only bridge page for cranial nerve exam orientation, oral mechanism observations, and dysphagia/communication exam references.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ClinicalExams.tsx.',
          'Local reference coverage includes CN V, CN VII, CN IX/X, CN XI, and CN XII exam prompts with procedure, normal findings, abnormal findings, and clinical significance.',
          'AI interpretation and patient-view exam workflows remain SPFx pending.'
        ]
      },
      {
        heading: 'Clinical orientation',
        bullets: [
          'Use cranial nerve findings to support dysphagia, motor speech, resonance, voice, and oral mechanism reasoning.',
          'Document patient-specific exam results only in approved clinical documentation systems.',
          'Use facility policy and clinician judgment for referrals, instrumental recommendations, and medical escalation.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Meds-Labs-Imaging.aspx',
    title: 'SLP Meds, Labs, Imaging, and Vitals',
    imageKey: 'chest-xray',
    summary: 'Read-only bridge page for medication impact, lab/vital context, imaging references, and clinical escalation orientation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ClinicalMeds.tsx and src/utils/clinical-data.ts.',
          'Local reference tabs include meds and impact, labs and values, imaging, and vitals.',
          'Searchable clinical data and patient-context display remain SPFx pending.'
        ]
      },
      {
        heading: 'Clinical safety boundary',
        bullets: [
          'This page does not store medication lists, lab values, imaging reports, vitals, or resident identifiers.',
          'Use EHR/source medical records for live patient data and prescribing/medical decisions.',
          'Escalate abnormal medical findings through facility policy and licensed provider pathways.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Outcome-Measures.aspx',
    title: 'SLP Outcome Measures',
    imageKey: 'documentation',
    summary: 'Read-only bridge page for outcome-measure orientation, interpretation boundaries, and crosswalk to clinical calculators.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from shared outcome-measure libraries and SLP outcome-measure knowledge files.',
          'Relevant local content includes adult neuro, pediatric, voice/swallowing, cognition, functional communication, and cross-discipline rehab measures.',
          'Outcome score entry, trend visualization, and patient trajectories remain SPFx pending.'
        ]
      },
      {
        heading: 'Use boundary',
        bullets: [
          'Use this page to orient clinicians to measures and where they fit in care planning.',
          'Do not store patient scores or progress trends in SharePoint-native bridge pages.',
          'When using a standardized tool, follow tool instructions, licensing, normative guidance, and facility documentation policy.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Handout-Reference.aspx',
    title: 'SLP Handout Reference',
    imageKey: 'documentation',
    summary: 'Read-only bridge page for handout categories, source requirements, and the session-only/sanitized handout boundary.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/HandoutMaker.tsx and src/utils/handout-data.ts.',
          'Local handout flow includes handout type, subspecialty, language, source support, image support, print, and PDF generation.',
          'AI generation, patient-specific details, printing, and download workflows remain SPFx pending.'
        ]
      },
      {
        heading: 'PHI-minimized handout rule',
        bullets: [
          'Sensitive input is session-only in the production path.',
          'Saved handout libraries may persist only non-PHI or sanitized handouts.',
          'Do not upload individualized handouts containing patient identifiers into shared SharePoint source libraries.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-AAC-Boards.aspx',
    title: 'SLP AAC Boards Reference',
    imageKey: 'aac',
    summary: 'Read-only bridge page for AAC board categories, partner-training concepts, and SPFx-pending printable board creation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/AACBoardCreator.tsx and src/components/AACModule.tsx.',
          'Local presets include basics, food and drink, feelings, activities, and pain/medical categories.',
          'Custom board editing, image selection, printing, downloading, and AI-generated board suggestions remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Generic AAC supports are appropriate for shared reference and training.',
          'Patient-specific board customization belongs in approved clinical workflows until SPFx session-only handling is active.',
          'Do not store resident-specific communication needs, photos, or identifiers in SharePoint-native pages.'
        ]
      }
    ],
    links: [sourceLinks.ashaAac, sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Quality-Evidence.aspx',
    title: 'SLP Quality and Evidence Registry',
    imageKey: 'brain',
    summary: 'Read-only bridge page for evidence levels, quality-measure orientation, and review workflow for clinical reference sources.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/shared/data/clinical-evidence-registry.ts and src/shared/data/quality-measures-framework.ts.',
          'Local evidence records include topic, evidence level, citation, key findings, recommendations, precautions, and applicability.',
          'Local quality records include measure type, numerator, denominator, data source, benchmark framing, and reporting frequency.'
        ]
      },
      {
        heading: 'Governance boundary',
        bullets: [
          'Use the SLP_Source_Index list to track review status and Copilot readiness before promoting source material.',
          'Do not represent unreviewed local entries as final clinical policy.',
          'Patient outcomes and quality reporting data are not stored in this SharePoint-native bridge.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Clinical-Reference.aspx',
    title: 'SLP Clinical Reference and Differential Support',
    imageKey: 'brain',
    summary: 'Read-only bridge page for norms, pediatric norms, differential diagnosis orientation, and treatment-plan support boundaries.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ClinicalReference.tsx.',
          'Local tabs include norms, pediatric norms, differential diagnosis support, and treatment-plan support.',
          'Symptom entry, assessment-data entry, AI-generated differential diagnosis, and AI-generated treatment plans remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Do not enter patient symptoms, assessment findings, diagnosis, or treatment-plan details on this SharePoint-native page.',
          'Use this page as an orientation point for reviewed reference material and future SPFx workflow mapping.',
          'Differential diagnosis and treatment planning must remain clinician-led and documented in approved systems.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Medicare-Audit-Candidacy.aspx',
    title: 'SLP Medicare Audit and Candidacy Boundary',
    imageKey: 'medicare',
    summary: 'Read-only bridge page for Medicare audit, candidacy, Section K, and Part B tracker workflow boundaries.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/MedicareDocChecker.tsx, src/components/MedicareHelper.tsx, and src/components/medicare/MedicarePartBTracker.tsx.',
          'Local workflows include document audit, candidacy review, Section K support, CPT/ICD-10 references, crosswalks, and Part B tracker concepts.',
          'PDF upload, history text entry, tracker form fields, AI analysis, and patient-specific compliance review remain SPFx pending.'
        ]
      },
      {
        heading: 'Compliance boundary',
        bullets: [
          'Do not upload patient documents, paste clinical histories, or enter resident-specific Medicare data into SharePoint-native bridge pages.',
          'Use CMS and Medicare references for coverage and documentation framing.',
          'Use approved clinical documentation and billing review systems for resident-specific audit activity.'
        ]
      }
    ],
    links: [sourceLinks.medicareSlp, sourceLinks.cmsBilling, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Trajectory-Analytics.aspx',
    title: 'SLP Trajectory Analytics Boundary',
    imageKey: 'cognitive',
    summary: 'Read-only bridge page for clinical trajectory concepts, scoring trend boundaries, and SPFx-pending analytics workflows.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/analytics/ClinicalTrajectoryPredictor.tsx.',
          'Local trajectory concepts include MoCA, WAB-R, FIM Cognitive, custom scales, linear trend views, MDC/SEM framing, and AI extraction from notes.',
          'Score entry, date tracking, charting, note extraction, and predictive analytics remain SPFx pending.'
        ]
      },
      {
        heading: 'Safety boundary',
        bullets: [
          'Do not store patient scores, assessment dates, note excerpts, or progress trajectories on SharePoint-native pages.',
          'Use this page only to document the future analytics workflow and the interpretation cautions.',
          'Any production analytics must use the PHI-minimized/session-boundary design and approved clinical systems.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Clinical-Safety.aspx',
    title: 'SLP Clinical Safety and Safe Mode',
    imageKey: 'brain',
    summary: 'Read-only bridge page for clinical safety status, safe-mode concepts, and PHI-minimized system behavior.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ClinicalSafetyStatusBar.tsx and src/context/ClinicalSafetyContext.tsx.',
          'Local status concepts include clinical safety alerts, HIPAA safe mode, online/local-model status, storage usage, and warning/critical issue display.',
          'Live telemetry, local model status, and safety issue detection remain SPFx pending.'
        ]
      },
      {
        heading: 'Safety model',
        bullets: [
          'Every SharePoint-native page remains non-PHI and read-only.',
          'Sensitive input belongs in session-only workflows when unavoidable.',
          'Durable storage is limited to sanitized or non-PHI reference metadata and reviewed source content.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Life-Wellness.aspx',
    title: 'SLP Life and Clinician Wellness',
    imageKey: 'voice',
    summary: 'Read-only bridge page for clinician wellness, professional support resources, and burnout-prevention orientation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/SLPLife.tsx.',
          'Local resources include ASHA self-care, ergonomics, stress management, burnout prevention, and support-network orientation.',
          'Interactive checklist state and modals remain SPFx pending.'
        ]
      },
      {
        heading: 'Use boundary',
        bullets: [
          'Use this page for clinician wellness orientation and professional resource links.',
          'Do not record staff health details, performance data, or identifiable wellness notes in this bridge page.',
          'Use official HR, employee assistance, or training systems for tracked wellness or compliance programs.'
        ]
      }
    ],
    links: ['https://www.asha.org/practice/self-care/', 'https://www.asha.org/practice/ergonomics/', sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Knowledge-Source-Index.aspx',
    title: 'SLP Knowledge Source Index',
    imageKey: 'brain',
    summary: 'Controlled index and promotion path for local SLP knowledge files, SharePoint source libraries, and Copilot-ready reference material.',
    sections: [
      {
        heading: 'What this page fills in',
        bullets: [
          'Bridges the local knowledge-base directory and SharePoint source libraries into one non-PHI review workflow.',
          'Separates SLP-ready source candidates from adjacent PT/OT rehab material and metadata-only SharePoint source files.',
          'Prepares clinical reference content for SharePoint pages, document-library views, Power Automate indexing, and Copilot Studio grounding.'
        ]
      },
      {
        heading: 'Knowledge source pipeline',
        bullets: [
          'Index local SLP knowledge files and SharePoint source-library metadata.',
          'Classify each item by clinical area, document type, discipline, audience, and review status.',
          'Promote only non-PHI, reviewed SLP reference content into pages or Copilot knowledge sources.',
          'Keep source PDFs and documents in controlled SharePoint libraries with version history and clear ownership.'
        ]
      },
      {
        heading: 'Latest index snapshot',
        bullets: [
          `Total indexed records: ${clinicalKnowledgeIndexPreview.summary.total || 'run the clinical index to populate'}.`,
          `Local knowledge-base records: ${clinicalKnowledgeIndexPreview.summary.bySourceKind?.['local-file'] || 0}.`,
          `SharePoint source-library metadata records: ${clinicalKnowledgeIndexPreview.summary.bySourceKind?.['sharepoint-library-item'] || 0}.`,
          `Candidate SLP/cross-discipline records: ${clinicalKnowledgeIndexPreview.summary.byReviewStatus?.candidate || 0}.`,
          `Adjacent PT/OT rehab records requiring review: ${clinicalKnowledgeIndexPreview.summary.byReviewStatus?.['adjacent-rehab-review'] || 0}.`,
          `Metadata-only SharePoint source records requiring file review: ${clinicalKnowledgeIndexPreview.summary.byReviewStatus?.['source-metadata-only'] || 0}.`,
          `Hold/manual-review records: ${clinicalKnowledgeIndexPreview.summary.byReviewStatus?.hold || 0}.`
        ]
      },
      {
        heading: 'Reviewable SharePoint list',
        bullets: [
          'The SLP_Source_Index list stores non-PHI source metadata only.',
          'Use it to filter by clinical area, discipline, document type, review status, and Copilot readiness.',
          'The list does not store patient names, MRNs, DOBs, room numbers, session notes, evaluations, treatment records, or resident-specific goals.'
        ]
      },
      {
        heading: 'Candidate SLP records to review first',
        bullets: clinicalKnowledgeIndexPreview.candidateItems.length
          ? clinicalKnowledgeIndexPreview.candidateItems
          : ['Run node scripts/build-clinical-knowledge-index.mjs --sharepoint to populate candidate records.']
      },
      {
        heading: 'Held records',
        bullets: clinicalKnowledgeIndexPreview.holdItems.length
          ? clinicalKnowledgeIndexPreview.holdItems
          : ['No held records were present in the latest local preview.']
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Do not index patient/session/goal/review lists as clinical knowledge.',
          'Do not use patient identifiers, room numbers, MRNs, DOBs, or resident-specific examples in knowledge items.',
          'Copilot Studio knowledge should be grounded only on reviewed SharePoint pages, reviewed source files, and approved public/enterprise references.'
        ]
      }
    ],
    links: [
      'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint',
      'https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles',
      '/sites/PacificCoast_SLP/Lists/SLP_Source_Index/AllItems.aspx',
      sourceLinks.ashaPortal,
      sourceLinks.cmsManual
    ]
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
  { title: 'SLP Quick Reference', fileName: 'SLP-Quick-Reference.aspx' },
  { title: 'SLP Coding', fileName: 'SLP-Coding-Reference.aspx' },
  { title: 'SLP Pathways', fileName: 'SLP-Clinical-Pathways.aspx' },
  { title: 'Ensign SLP Corner', fileName: 'SLP-Ensign-Corner.aspx' },
  { title: 'SLP Calculators', fileName: 'SLP-Clinical-Calculators.aspx' },
  { title: 'SLP Clinical Exams', fileName: 'SLP-Clinical-Exams.aspx' },
  { title: 'SLP Meds/Labs', fileName: 'SLP-Meds-Labs-Imaging.aspx' },
  { title: 'SLP Outcomes', fileName: 'SLP-Outcome-Measures.aspx' },
  { title: 'SLP Clinical Reference', fileName: 'SLP-Clinical-Reference.aspx' },
  { title: 'SLP Medicare Audit', fileName: 'SLP-Medicare-Audit-Candidacy.aspx' },
  { title: 'SLP Clinical Safety', fileName: 'SLP-Clinical-Safety.aspx' },
  { title: 'SLP Knowledge Index', fileName: 'SLP-Knowledge-Source-Index.aspx' }
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
        <div style="background:#f6f8fa;text-align:center;padding:12px;">
          <img src="${htmlEscape(itemImage)}" alt="${htmlEscape(item.title)} module image" style="width:100%;max-width:260px;height:auto;display:inline-block;" />
        </div>
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
  const hero = isHome ? `
    <div style="border:1px solid #d0d7de;border-radius:8px;overflow:hidden;background:#ffffff;margin-bottom:18px;box-shadow:0 1px 3px rgba(0,0,0,0.10);">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;align-items:center;padding:24px 26px;background:#ffffff;">
        <div style="text-align:center;">
          <img src="${htmlEscape(heroImage)}" alt="Pacific Coast logo" style="width:100%;max-width:308px;height:auto;display:inline-block;" />
        </div>
        <div>
          <p style="margin:0 0 8px 0;color:#0f6cbd;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0;">SharePoint clinical reference portal</p>
          <h1 style="margin:0 0 10px 0;font-size:34px;line-height:1.15;color:#111827;">Pacific Coast SLP Portal</h1>
          <p style="margin:0 0 14px 0;font-size:16px;line-height:1.55;color:#374151;">PHI-minimized launch point for SLP clinical references, source documents, Medicare guidance, and reviewed knowledge workflows.</p>
          <p style="margin:0;">${primaryLinks}</p>
          <p style="margin:12px 0 0 0;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef6ff;color:#0f4761;font-weight:700;">SharePoint-native bridge</span> <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#f0f8f0;color:#0b6a0b;font-weight:700;">Non-PHI</span> <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4ce;color:#5c3b00;font-weight:700;">SPFx production pending</span></p>
        </div>
      </div>
    </div>
  ` : `
    <div style="border:1px solid #d0d7de;border-radius:8px;overflow:hidden;background:#ffffff;margin-bottom:18px;box-shadow:0 1px 3px rgba(0,0,0,0.10);">
      <div style="background:#f6f8fa;text-align:center;padding:18px;">
        <img src="${htmlEscape(heroImage)}" alt="${htmlEscape(page.title)} hero image" style="width:100%;max-width:520px;height:auto;display:inline-block;" />
      </div>
      <div style="padding:16px 18px;">
    <h1>${htmlEscape(page.title)}</h1>
    <p>${htmlEscape(page.summary)}</p>
    <p style="margin:12px 0 0 0;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef6ff;color:#0f4761;font-weight:700;">SharePoint-native bridge</span> <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#f0f8f0;color:#0b6a0b;font-weight:700;">Non-PHI</span> <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4ce;color:#5c3b00;font-weight:700;">SPFx production pending</span></p>
      </div>
    </div>
  `;

  return `
    ${hero}
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

async function assertSharePointAuth(browserPage) {
  const result = await browserPage.evaluate(async () => {
    try {
      const response = await fetch('/sites/PacificCoast_SLP/_api/web?$select=Title,Url', {
        headers: { Accept: 'application/json;odata=nometadata' }
      });
      const text = await response.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {}
      return {
        ok: response.ok && Boolean(json?.Title),
        status: response.status,
        title: json?.Title || null,
        text: text.slice(0, 300),
        url: location.href
      };
    } catch (error) {
      return { ok: false, error: String(error), url: location.href };
    }
  });

  if (!result.ok) {
    throw new Error([
      'SharePoint authentication is not ready.',
      `Current URL: ${result.url || 'unknown'}`,
      `Status: ${result.status || 'unknown'}`,
      'Run: node scripts/refresh-sharepoint-auth.mjs',
      'Complete Microsoft login/MFA in the opened browser, then rerun this command.'
    ].join('\n'));
  }

  return result;
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
  await assertSharePointAuth(browserPage);
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
    const sourcePath = path.isAbsolute(asset.source) ? asset.source : path.join(ROOT, asset.source);
    const buffer = await readFile(sourcePath);
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
