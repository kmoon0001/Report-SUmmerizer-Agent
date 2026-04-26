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
          'Documentation Studio, Therapy Studio, Goal Generator, and Three-Way Eval now have generalized non-PHI template-mode surfaces in the bridge.',
          'Resident-specific authoring and interactive workflow capture remain SPFx pending.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Documentation workflows',
        description: 'Daily note, progress, recertification, discharge, and evaluation shells built for copy-ready non-PHI drafting.',
        chips: ['Templates', 'Compliance', 'Non-PHI']
      },
      {
        title: 'Goals and treatment design',
        description: 'SMART-goal scaffolds, intervention language, and reusable therapy planning without resident-linked persistence.',
        chips: ['Goals', 'Treatment', 'Reusable']
      },
      {
        title: 'Clinical reasoning support',
        description: 'Exam scaffolds, case playbooks, Medicare logic, and differential-support prompts anchored to reviewed sources.',
        chips: ['Reasoning', 'Reference', 'Clinician-led']
      }
    ],
    templateGroups: [
      {
        heading: 'Primary workflow paths',
        items: [
          {
            title: 'Template-mode drafting',
            lines: [
              'Start in Note Templates for documentation structure.',
              'Use Goal Studio for SMART goals and intervention rationale.',
              'Complete resident-specific versions only in the approved charting system.'
            ]
          },
          {
            title: 'Reference and review',
            lines: [
              'Use the clinical modules, Medicare pages, and knowledge index to anchor decisions to reviewed references.',
              'Use Copilot Playbooks and Clinical Reference pages for generalized reasoning support.',
              'Use the source index and library guides before promoting new content.'
            ]
          }
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use the cards below to organize swallowing review, treatment planning, and instrumental coordination without entering resident identifiers.',
          'Keep diet levels, exam findings, and clinical decisions in the approved medical record; this page only provides reference structure.',
          'When SPFx is available, this module can restore guided decision support with session-only data handling.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Swallow Clinical Reasoning',
        text: 'Frame bedside swallow observations, risk factors, oral/pharyngeal phase questions, and follow-up needs as a non-PHI checklist.'
      },
      {
        title: 'Instrumental Coordination',
        text: 'Bridge VFSS/FEES readiness, referral questions, and interdisciplinary coordination while keeping report interpretation in source systems.'
      },
      {
        title: 'Diet and IDDSI Planning',
        text: 'Connect swallowing safety, texture/liquid considerations, staff education, and dining carryover to the separate IDDSI resources.'
      }
    ],
    templateGroups: [
      {
        title: 'Swallow Review Shell',
        items: [
          'Clinical question: What swallowing function or safety question is being reviewed?',
          'Risk lens: airway protection, nutrition/hydration, oral care, positioning, cognition, pulmonary status.',
          'Information sources: bedside findings, instrumental results if available, interdisciplinary reports, current orders.',
          'Plan direction: skilled strategy training, exercise/protocol focus, diet coordination, referral/escalation need.'
        ]
      },
      {
        title: 'Treatment Planning Shell',
        items: [
          'Target impairment or functional limitation without naming a resident.',
          'Skilled SLP action: cueing, exercise, strategy training, compensatory approach, caregiver/staff education.',
          'Safety guardrail: stop criteria, aspiration-risk escalation, oral intake precautions, team communication point.',
          'Carryover plan: dining room, medication pass, oral care, family/staff reinforcement, next review interval.'
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page for non-PHI aphasia therapy planning, partner communication structure, and AAC coordination.',
          'Do not store personal narratives, names, language samples, or resident-specific communication boards on the page.',
          'SPFx can later restore interactive language-task generation with session-only handling and approved storage boundaries.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Language Profile Planning',
        text: 'Organize expressive, receptive, reading, writing, discourse, and functional participation questions before formal documentation.'
      },
      {
        title: 'Partner Communication',
        text: 'Plan supported conversation strategies, communication ramps, cueing approaches, and caregiver/staff training targets.'
      },
      {
        title: 'AAC Bridge',
        text: 'Route communication access needs into the AAC Hub while keeping custom vocabulary and personal content out of SharePoint pages.'
      }
    ],
    templateGroups: [
      {
        title: 'Communication Support Shell',
        items: [
          'Communication goal area: comprehension, expression, reading/writing, conversation repair, participation.',
          'Support strategy: yes/no supports, written keywords, visual choices, slowed rate, partner confirmation.',
          'Training target: staff, caregiver, group activity, therapy session, dining or care-routine carryover.',
          'Escalation or referral: hearing/vision access, AAC need, neuro/medical change, interpreter or cultural-linguistic support.'
        ]
      },
      {
        title: 'Therapy Task Shell',
        items: [
          'Task type: naming, semantic feature analysis, script practice, comprehension, reading/writing, discourse.',
          'Cueing level: independent, written/visual cue, phonemic/semantic cue, model, errorless learning support.',
          'Functional context: conversation, room needs, safety call-light use, schedule, family interaction.',
          'Progress lens: accuracy, independence, cueing reduction, strategy carryover, participation quality.'
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use the module as a functional-cognition planning surface for general task design and strategy selection.',
          'Keep scores, behavior examples, safety incidents, and individualized caregiver notes in approved clinical systems only.',
          'Future SPFx work can restore guided task difficulty and carryover tracking using session-only data.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Functional Cognition Profile',
        text: 'Frame attention, memory, executive function, orientation, problem solving, and safety awareness around daily tasks.'
      },
      {
        title: 'Strategy Training',
        text: 'Map spaced retrieval, external aids, environmental supports, routines, and caregiver cueing to non-PHI workflows.'
      },
      {
        title: 'Task Progression',
        text: 'Organize activity difficulty, cueing level, distractor load, and carryover setting without storing patient performance.'
      }
    ],
    templateGroups: [
      {
        title: 'Functional Cognition Shell',
        items: [
          'Target domain: attention, memory, executive function, orientation, problem solving, safety awareness.',
          'Functional task: medication routine, schedule use, call-light safety, meal participation, room navigation, activity follow-through.',
          'Skilled cueing: verbal, visual, written, environmental setup, errorless learning, spaced retrieval.',
          'Carryover condition: staff prompt, family support, environmental aid, interdisciplinary handoff, next-session progression.'
        ]
      },
      {
        title: 'Strategy Plan Shell',
        items: [
          'Strategy selected and rationale.',
          'Practice condition: quiet room, simulated routine, real-world routine, group context, caregiver training.',
          'Independence measure: cueing level, consistency, safety, initiation, completion, self-monitoring.',
          'Generalization plan: where the strategy should transfer and what support is required.'
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page to structure non-PHI dysarthria or motor-speech planning by subsystem, cueing approach, and communication context.',
          'Do not store speech samples, personal scripts, recordings, or resident-specific intelligibility data here.',
          'Future SPFx can restore interactive cueing and home-program builders with the same PHI boundary.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Subsystem Profile',
        text: 'Organize respiration, phonation, resonance, articulation, prosody, rate, and intelligibility observations.'
      },
      {
        title: 'Cueing Hierarchy',
        text: 'Plan external pacing, over-articulation, breath support, loudness, rate control, and multimodal supports.'
      },
      {
        title: 'Functional Communication',
        text: 'Connect motor-speech therapy to dining, care routines, phone use, family conversation, and group participation.'
      }
    ],
    templateGroups: [
      {
        title: 'Motor Speech Review Shell',
        items: [
          'Clinical focus: dysarthria type, apraxia features, intelligibility, rate, respiratory-phonatory support.',
          'Subsystem question: respiration, phonation, articulation, resonance, prosody, endurance.',
          'Context: structured word/phrase, conversation, care request, group setting, phone/technology use.',
          'Plan direction: cueing hierarchy, strategy training, partner education, referral/escalation.'
        ]
      },
      {
        title: 'Cueing Plan Shell',
        items: [
          'Cue type: model, visual, tactile, pacing, metronome, written keyword, breath cue, loudness cue.',
          'Complexity: sound, word, phrase, sentence, conversation, real-world routine.',
          'Success lens: clarity, consistency, cue reduction, listener understanding, fatigue management.',
          'Carryover: staff/caregiver prompt, room sign, personal strategy card, group practice.'
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page for non-PHI voice care planning, hygiene education structure, and referral-aware therapy organization.',
          'Do not store recordings, acoustic measures, laryngeal images, diagnoses, or patient-specific voice history here.',
          'Future SPFx can restore interactive therapy-program guidance while keeping clinical data session-only.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Voice Care Orientation',
        text: 'Organize vocal hygiene, hydration, reflux/irritant education, respiratory support, and communication-demand review.'
      },
      {
        title: 'Therapy Program Planning',
        text: 'Frame resonant voice, respiratory-phonatory coordination, pacing, conservation, and carryover without storing patient data.'
      },
      {
        title: 'Referral Awareness',
        text: 'Keep medical red flags, ENT coordination, and instrumentation needs visible as clinical escalation reminders.'
      }
    ],
    templateGroups: [
      {
        title: 'Voice Care Shell',
        items: [
          'Clinical question: voice quality, endurance, loudness, pitch, discomfort, fatigue, or participation limitation.',
          'Education focus: hydration, irritants, reflux precautions, vocal load, amplification, rest/conservation.',
          'Medical coordination: ENT/laryngology status, red flags, respiratory factors, medication considerations.',
          'Carryover context: conversation, dining room, phone, group activity, family/staff communication.'
        ]
      },
      {
        title: 'Voice Treatment Plan Shell',
        items: [
          'Approach: resonant voice, flow phonation, respiratory support, easy onset, pacing, vocal function exercises.',
          'Cueing: tactile, visual, model, biofeedback outside SharePoint, written strategy card.',
          'Dose and context: structured drill, functional phrase, conversation, real-world carryover.',
          'Safety guardrail: stop with pain, acute change, respiratory compromise, or medical red flag.'
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page to plan access, feature matching, partner training, and general communication contexts without personal vocabulary.',
          'Do not store resident names, photos, custom boards, personal messages, or medical identifiers on this bridge page.',
          'Future SPFx can restore board-building with export controls and session-only customization.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Access and Feature Matching',
        text: 'Organize direct selection, switch/scanning, visual field, motor access, language level, and symbol/text needs.'
      },
      {
        title: 'Partner Training',
        text: 'Plan wait time, modeling, aided language input, confirmation strategies, repair routines, and staff carryover.'
      },
      {
        title: 'Context Boards',
        text: 'Map general communication needs across care routines, dining, pain/symptom reporting, activities, and family interaction.'
      }
    ],
    templateGroups: [
      {
        title: 'AAC Feature-Matching Shell',
        items: [
          'Communication need: basic wants/needs, medical/safety, social connection, participation, repair.',
          'Access mode: touch, eye gaze, partner-assisted scanning, switch, low-tech board, speech-generating device.',
          'Representation: objects, photos, symbols, text, written keywords, multimodal supports.',
          'Implementation support: partner modeling, placement, mounting, vocabulary organization, training need.'
        ]
      },
      {
        title: 'Partner Coaching Shell',
        items: [
          'Partner behavior: model without testing, wait, offer choices, confirm message, repair breakdowns.',
          'Routine: morning care, dining, therapy session, recreation, medical visit, family call.',
          'Success lens: initiation, response reliability, message variety, reduced frustration, participation.',
          'Next step: adjust access, vocabulary, partner supports, environmental setup, team handoff.'
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page to structure non-PHI medical-necessity reasoning, skilled-service language, and audit-readiness checks.',
          'Do not paste resident notes, diagnosis lists, payer details, or encounter-specific documentation into SharePoint.',
          'Future SPFx can restore guided documentation checks with session-only handling and approved clinical-system handoff.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Skilled Need Framing',
        text: 'Connect medical necessity, complexity, clinical judgment, safety risk, and skilled SLP intervention requirements.'
      },
      {
        title: 'Documentation Support',
        text: 'Organize evaluation, progress, recertification, and daily-note language around objective, measurable, skilled care.'
      },
      {
        title: 'Audit-Ready Logic',
        text: 'Review improvement, maintenance, caregiver training, discharge planning, and denial-risk questions without PHI.'
      }
    ],
    templateGroups: [
      {
        title: 'Skilled Service Shell',
        items: [
          'Skilled reason: why SLP judgment, analysis, modification, or training is required.',
          'Functional impact: swallowing, communication, cognition, voice, participation, safety, caregiver burden.',
          'Intervention: assessment, treatment, cueing, education, compensatory strategy, restorative exercise, team coordination.',
          'Evidence: measurable change, cueing level, tolerance, safety outcome, carryover, medical complexity.'
        ]
      },
      {
        title: 'Medical Necessity Shell',
        items: [
          'Clinical condition category without patient identifiers.',
          'Reason services cannot be safely/effectively performed by unskilled personnel alone.',
          'Expected benefit: improvement, maintenance, prevention of decline, caregiver/staff training, safe discharge support.',
          'Review checkpoint: plan frequency, progress marker, barrier, modification, discharge or continuation rationale.'
        ]
      }
    ],
    links: [sourceLinks.medicareSlp, sourceLinks.cmsBilling, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Documentation-Studio.aspx',
    title: 'SLP Documentation Studio',
    imageKey: 'documentation',
    summary: 'Generalized non-PHI documentation workspace for compliant draft structure, evaluation framing, and Medicare-ready language.',
    sections: [
      {
        heading: 'Bridge status',
        bullets: [
          'Mapped from the local DocumentationStudio, DocumentationAssistant, and ThreeWayEval modules.',
          'This SharePoint-native bridge now supports generalized template mode, but still does not persist patient-specific note entry, AI drafting sessions, or evaluation forms.',
          'Use approved clinical documentation systems for patient-specific content and final chart completion.'
        ]
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use non-PHI draft frameworks for daily notes, progress reports, recertifications, discharge summaries, and evaluation write-ups.',
          'Keep identifiers, diagnosis-specific history, and resident-level treatment response out of SharePoint page content.',
          'Move the finished patient-specific version into the approved clinical record system.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Daily note draft mode',
        description: 'Structured daily note language for skilled intervention, response, and plan without resident identifiers.',
        chips: ['Non-PHI', 'Copy-ready', 'Chart elsewhere']
      },
      {
        title: 'Progress and recert framing',
        description: 'Medicare-oriented progress, recertification, and discharge frameworks with skilled rationale language.',
        chips: ['CMS aligned', 'Template mode', 'No durable PHI']
      },
      {
        title: 'Evaluation shell',
        description: 'Generic evaluation and three-way summary structure for findings, clinical reasoning, and next-step planning.',
        chips: ['Eval structure', 'Manual completion', 'Session-safe']
      }
    ],
    templateGroups: [
      {
        title: 'Daily Note Shell',
        items: [
          'Skilled intervention: describe the SLP action, cueing, analysis, modification, training, or clinical judgment.',
          'Response: describe functional response, independence/cueing level, safety, tolerance, or strategy carryover without identifiers.',
          'Clinical reasoning: explain why skilled SLP remains required and how the plan was advanced or modified.',
          'Plan: next focus, interdisciplinary communication, caregiver/staff education, safety follow-up, or discharge progression.'
        ]
      },
      {
        title: 'Progress or Recert Shell',
        items: [
          'Reporting period focus: summarize target areas without resident identifiers.',
          'Objective trend: improvement, maintenance, decline prevention, cueing change, safety, participation, or functional carryover.',
          'Medical necessity: skilled need, complexity, barriers, risk, and why unskilled care is insufficient.',
          'Forward plan: goals, frequency/duration rationale, discharge criteria, caregiver/staff training, or modification need.'
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
    featureCards: [
      {
        title: 'Texture Orientation',
        text: 'Use IDDSI levels as a shared vocabulary for texture/liquid discussion, staff education, and interdisciplinary consistency.'
      },
      {
        title: 'Testing Workflow Boundary',
        text: 'Keep flow-test, fork-drip, spoon-tilt, and food-trial details in approved workflows; this bridge only frames the process.'
      },
      {
        title: 'Dining Carryover',
        text: 'Connect diet-texture education to meal setup, positioning, cueing, supervision, oral care, and staff handoff routines.'
      }
    ],
    templateGroups: [
      {
        title: 'IDDSI Review Shell',
        items: [
          'Clinical purpose: texture consistency education, diet communication, meal-safety review, or interdisciplinary alignment.',
          'Reference area: liquid flow, puree/soft texture, transitional foods, regular diet, mixed consistency, adaptive setup.',
          'Team coordination: nursing, dietary, therapy, physician/NP, family/caregiver education, facility policy.',
          'Safety boundary: final diet recommendations and orders remain in approved clinical systems.'
        ]
      },
      {
        title: 'Dining Carryover Shell',
        items: [
          'Routine: dining room, room tray, medication pass, snack, hydration round, family meal.',
          'Support need: setup, positioning, pacing, bolus-size cueing, supervision level, oral care follow-up.',
          'Education target: staff consistency, patient/caregiver instruction without identifiers, kitchen/dietary communication.',
          'Review trigger: coughing/change in status, intake concern, diet tolerance issue, instrumental follow-up need.'
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
    featureCards: [
      {
        title: 'VFSS/MBSS Readiness',
        text: 'Frame referral questions, positioning needs, oral/pharyngeal phase questions, and interdisciplinary coordination.'
      },
      {
        title: 'FEES Readiness',
        text: 'Organize endoscopic swallowing questions, secretion/airway observations, tolerance considerations, and referral pathways.'
      },
      {
        title: 'Imaging Reference Bridge',
        text: 'Connect chest imaging and neuroimaging references to clinical reasoning without storing reports or patient findings.'
      }
    ],
    templateGroups: [
      {
        title: 'Instrumental Referral Shell',
        items: [
          'Clinical question: aspiration risk, residue pattern, strategy effectiveness, diet-level question, airway/secretion concern.',
          'Instrumental fit: VFSS/MBSS, FEES, or medical/imaging follow-up based on facility process and clinician judgment.',
          'Preparation needs: positioning, transport, cognition/participation, oxygen/airway considerations, diet/bolus questions.',
          'Communication plan: physician/NP order, nursing coordination, dietary impact, family/caregiver education as appropriate.'
        ]
      },
      {
        title: 'Results Integration Shell',
        items: [
          'Source result location: approved report or EHR, not this SharePoint page.',
          'Clinical implication: strategy, diet, treatment focus, referral, monitoring, staff education.',
          'Skilled action: interpretation, patient/staff training, treatment modification, safety escalation.',
          'Follow-up trigger: change in status, poor tolerance, new pulmonary concern, diet advancement/readiness question.'
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
    featureCards: [
      {
        title: 'Airway Coordination',
        text: 'Frame SLP collaboration with nursing, respiratory therapy, providers, and facility protocols for trach/vent care.'
      },
      {
        title: 'Speaking-Valve Readiness',
        text: 'Organize readiness concepts, contraindication awareness, tolerance monitoring, and escalation pathways without patient data.'
      },
      {
        title: 'Swallow/Communication Bridge',
        text: 'Connect airway status, secretion management, communication access, swallowing assessment, and staff education.'
      }
    ],
    templateGroups: [
      {
        title: 'Trach/Vent Review Shell',
        items: [
          'Clinical purpose: communication access, swallow safety, speaking-valve readiness, secretion/airway coordination.',
          'Team roles: SLP, respiratory therapy, nursing, provider, dietitian, caregiver education as allowed.',
          'Protocol checkpoint: facility policy, medical order, oxygen/vent status, airway stability, emergency plan.',
          'Documentation boundary: patient-specific settings, vitals, tolerance, and decisions remain in approved systems.'
        ]
      },
      {
        title: 'Speaking-Valve Planning Shell',
        items: [
          'Readiness concept: cuff status, airway patency, secretion management, alertness, respiratory stability, team clearance.',
          'Observation lens: tolerance, voice/communication access, coughing, work of breathing, oxygenation per policy.',
          'Skilled SLP action: communication assessment, swallow coordination, education, strategy modification, referral/escalation.',
          'Stop/escalate reminder: respiratory distress, intolerance, acute change, protocol concern, provider/RT direction.'
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
    featureCards: [
      {
        title: 'Neuroanatomy Orientation',
        text: 'Use brain and cranial-nerve references to support reasoning across dysphagia, aphasia, cognition, motor speech, and voice.'
      },
      {
        title: 'Head and Neck Reference',
        text: 'Connect pharyngeal, laryngeal, and vocal-fold anatomy to swallowing, airway, resonance, phonation, and voice education.'
      },
      {
        title: 'Image-Led Teaching',
        text: 'Use local non-PHI reference assets for staff learning and clinician orientation while interactive 3D remains SPFx pending.'
      }
    ],
    templateGroups: [
      {
        title: 'Anatomy Teaching Shell',
        items: [
          'Topic: cranial nerves, brain region, larynx, pharynx, vocal folds, airway, swallow musculature.',
          'Clinical tie-in: swallowing, speech, language, cognition, voice, respiration, safety.',
          'Teaching audience: clinician onboarding, staff education, caregiver education using non-PHI language.',
          'Boundary: no patient imaging, reports, diagnosis discussion, or case-specific interpretation on this page.'
        ]
      },
      {
        title: 'Clinical Reasoning Bridge',
        items: [
          'Symptom cluster: communication, cognition, swallowing, voice, motor speech, airway.',
          'Anatomy lens: relevant structure, nerve pathway, system interaction, compensatory pathway.',
          'Reference action: review image asset, consult clinical source, coordinate with provider or interdisciplinary team.',
          'SPFx pending: 3D exploration, clickable labeling, and guided anatomy quizzes.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Goal-Bank.aspx',
    title: 'SLP Goal Bank Reference',
    imageKey: 'cognitive',
    summary: 'Goal-bank and intervention reference page with generalized, non-resident SMART-goal structure and skilled-language support.',
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
          'Use goal examples as generalized structure references and reusable template shells.',
          'Do not paste patient names, identifiers, dates of birth, facility IDs, or patient-specific status into this SharePoint page.',
          'Final goals belong in approved clinical documentation systems.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'SMART goal builder',
        description: 'Goal structure for specificity, measurement, skilled relevance, and time framing without identifiers.',
        chips: ['SMART', 'Reusable', 'Non-PHI']
      },
      {
        title: 'Maintenance-language support',
        description: 'Generic language for preventing decline and supporting skilled maintenance framing where clinically appropriate.',
        chips: ['Maintenance', 'CMS aware', 'Template']
      },
      {
        title: 'Intervention rationale bank',
        description: 'Reusable skilled-intervention and cueing rationale language tied to deficits and functional outcomes.',
        chips: ['Skilled language', 'Copy-ready', 'Reference']
      }
    ],
    templateGroups: [
      {
        title: 'SMART Goal Shell',
        items: [
          'Functional target: swallowing safety, communication participation, cognitive routine, voice use, intelligibility, AAC access.',
          'Measurable behavior: accuracy, independence, cueing level, frequency, duration, consistency, strategy use.',
          'Condition: task, setting, support level, communication partner, diet context, environmental aid.',
          'Clinical purpose: safety, participation, medical necessity, discharge readiness, maintenance, caregiver/staff carryover.'
        ]
      },
      {
        title: 'Intervention Rationale Shell',
        items: [
          'Skilled method: analysis, cueing hierarchy, compensatory strategy, restorative exercise, caregiver/staff education.',
          'Why skilled: complexity, safety risk, medical status, need for adaptation, response monitoring, interdisciplinary coordination.',
          'Progress marker: reduced cueing, increased consistency, improved safety, improved participation, maintained function.',
          'Charting boundary: final patient-specific wording belongs only in approved clinical documentation systems.'
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
    featureCards: [
      {
        title: 'Treatment Idea Index',
        text: 'Organize activity concepts by dysphagia, aphasia, cognition, voice, motor speech, AAC, and functional participation.'
      },
      {
        title: 'Complexity Progression',
        text: 'Frame activity grading by cueing level, environmental support, distractor load, partner support, and carryover setting.'
      },
      {
        title: 'Skilled Rationale',
        text: 'Keep each activity tied to skilled analysis, modification, safety monitoring, education, or functional transfer.'
      }
    ],
    templateGroups: [
      {
        title: 'Activity Planning Shell',
        items: [
          'Clinical area: swallowing, cognition, language, motor speech, voice, AAC, staff/caregiver training.',
          'Activity type: drill, functional routine, strategy practice, education, carryover, group participation.',
          'Grading variable: cueing level, complexity, time pressure, distractors, partner support, environmental setup.',
          'Skilled purpose: safety, independence, generalization, participation, maintenance, discharge readiness.'
        ]
      },
      {
        title: 'Carryover Shell',
        items: [
          'Context: dining, room routine, group activity, family call, nursing care, therapy gym, discharge setting.',
          'Support: written aid, visual cue, partner model, environmental modification, staff prompt, AAC support.',
          'Success lens: initiation, accuracy, safety, independence, consistency, reduced cueing, participation quality.',
          'Documentation boundary: do not store patient responses or progress notes on this page.'
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
    featureCards: [
      {
        title: 'Bedside Recall',
        text: 'Keep core dysphagia, dysarthria, aphasia, cognition, and assessment reminders available as non-PHI reference prompts.'
      },
      {
        title: 'Escalation Prompts',
        text: 'Surface red-flag and referral reminders while routing live clinical decisions through facility policy and source systems.'
      },
      {
        title: 'SPFx Search Pending',
        text: 'The local app search/filter experience remains queued for SPFx; this page provides static launch structure for now.'
      }
    ],
    templateGroups: [
      {
        title: 'Quick Reference Use Shell',
        items: [
          'Question type: assessment reminder, treatment idea, red flag, cueing option, documentation language, source link.',
          'Clinical area: swallowing, language, cognition, motor speech, voice, AAC, trach/vent, Medicare.',
          'Action: review reference, open module page, consult authoritative source, coordinate with interdisciplinary team.',
          'Boundary: no assessment results, patient details, clinical examples, or case notes on this page.'
        ]
      },
      {
        title: 'Red-Flag Reminder Shell',
        items: [
          'Concern category: airway, neurologic change, acute medical status, nutrition/hydration, communication access, safety.',
          'Immediate path: follow facility policy, notify appropriate licensed team member, document in approved system.',
          'SLP role: screen, educate, adapt treatment, coordinate, refer, reassess as allowed by scope and setting.',
          'SPFx pending: searchable quick-reference and contextual module launch.'
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
    featureCards: [
      {
        title: 'Coding Orientation',
        text: 'Use coding groups as orientation to evaluation, treatment, AAC, and related SLP billing categories.'
      },
      {
        title: 'Payer Checkpoint',
        text: 'Keep final code selection tied to current payer rules, facility billing workflows, and approved documentation systems.'
      },
      {
        title: 'Audit Linkage',
        text: 'Connect coding review to skilled-service support, medical necessity, documentation adequacy, and compliance pages.'
      }
    ],
    templateGroups: [
      {
        title: 'Coding Review Shell',
        items: [
          'Service category: evaluation, treatment, AAC, instrumental, caregiver/staff training, group/concurrent as allowed.',
          'Support needed: medical necessity, skilled intervention, time/service requirements, payer/facility rule check.',
          'Documentation tie: service rendered, skilled reason, response, plan, and source record location.',
          'Boundary: no dates of service, claim details, diagnosis lists, identifiers, or patient-specific billing data here.'
        ]
      },
      {
        title: 'Compliance Cross-Check Shell',
        items: [
          'Question: does documentation support the billed/skilled service?',
          'Evidence: clinician analysis, modification, cueing, safety monitoring, education, measurable response.',
          'Risk: unsupported code, unclear medical necessity, missing skilled language, payer-specific requirement.',
          'Next step: consult facility billing/compliance workflow and official payer guidance.'
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
    featureCards: [
      {
        title: 'Pathway Orientation',
        text: 'Map common SLP clinical categories to symptoms, assessment options, treatment choices, strategies, and escalation prompts.'
      },
      {
        title: 'Reasoning Scaffold',
        text: 'Use generalized branching logic to think through clinical questions without entering resident-specific findings.'
      },
      {
        title: 'Red-Flag Routing',
        text: 'Keep urgent medical or safety concerns routed to facility protocols, licensed providers, and approved documentation.'
      }
    ],
    templateGroups: [
      {
        title: 'Clinical Pathway Shell',
        items: [
          'Starting concern: swallowing, cognition, language, motor speech, voice, AAC, trach/vent, safety.',
          'Screening lens: function, safety, participation, medical context, environment, caregiver/staff support.',
          'Assessment direction: standardized tool, informal probe, instrumental referral, interdisciplinary consult, source review.',
          'Treatment direction: strategy, exercise/protocol, education, environmental support, communication access, discharge planning.'
        ]
      },
      {
        title: 'Red-Flag Pathway Shell',
        items: [
          'Red flag category: acute neurologic change, respiratory compromise, aspiration concern, medical instability, unsafe intake.',
          'Immediate action: follow facility escalation protocol and notify appropriate licensed team members.',
          'SLP boundary: pause/modify treatment, coordinate, document in approved system, reassess when clinically appropriate.',
          'SPFx pending: interactive pathway branching with no durable PHI storage.'
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
    featureCards: [
      {
        title: 'Internal Resource Routing',
        text: 'Organize evaluation, documentation, clinical, billing, compliance, infographic, and program-development resources.'
      },
      {
        title: 'Program Development',
        text: 'Frame non-PHI ideas for service growth, staff education, clinical quality, and interdisciplinary collaboration.'
      },
      {
        title: 'Governed Reference Use',
        text: 'Keep internal guidance tied to official Ensign, facility, payer, regulatory, and authoritative clinical sources.'
      }
    ],
    templateGroups: [
      {
        title: 'Resource Promotion Shell',
        items: [
          'Resource category: evaluation, documentation, clinical, billing, compliance, infographic, program development.',
          'Owner or reviewer: identify who validates accuracy and currency before promotion.',
          'Use case: clinician reference, staff learning, quality improvement, onboarding, interdisciplinary education.',
          'Boundary: no patient examples, facility-sensitive notes, or unverifiable policy claims on the page.'
        ]
      },
      {
        title: 'Program Idea Shell',
        items: [
          'Program focus: dysphagia, communication, cognition, AAC, staff training, documentation quality, wellness.',
          'Audience: SLP team, nursing, dietary, family/caregiver education, interdisciplinary leadership.',
          'Evidence/source tie: authoritative reference, internal policy, reviewed source document, outcome measure.',
          'Next step: source review, pilot plan, governance approval, SharePoint page update, SPFx enhancement.'
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
    featureCards: [
      {
        title: 'Learning Domains',
        text: 'Organize cranial nerves, swallowing, aphasia, cognition, voice, motor speech, AAC, and assessment review topics.'
      },
      {
        title: 'Quiz Mode Pending',
        text: 'Keep interactive quiz scoring and staff tracking in SPFx or official learning systems, not SharePoint page content.'
      },
      {
        title: 'Onboarding Support',
        text: 'Use topic cards and source links for self-study, new-clinician orientation, and non-PHI in-service planning.'
      }
    ],
    templateGroups: [
      {
        title: 'Learning Module Shell',
        items: [
          'Topic: swallowing, aphasia, cognition, voice, motor speech, AAC, cranial nerves, Medicare, safety.',
          'Learning goal: recall, clinical reasoning, documentation quality, interdisciplinary communication, safety escalation.',
          'Source tie: ASHA, CMS, Medicare.gov, Microsoft Learn for platform workflow, or reviewed internal resource.',
          'Boundary: no tracked scores, staff performance notes, patient examples, or identifiable clinical scenarios.'
        ]
      },
      {
        title: 'In-Service Planning Shell',
        items: [
          'Audience: SLP team, nursing, dietary, caregivers/families, interdisciplinary staff.',
          'Format: quick huddle, handout, slide review, case-neutral scenario, source walkthrough, competency in official system.',
          'Takeaway: safety behavior, documentation habit, referral trigger, carryover strategy, communication support.',
          'Follow-up: official training record, policy review, source update, SPFx quiz build-out.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Document-Library-Guide.aspx',
    title: 'SLP Document Library Guide',
    imageKey: 'documentation',
    summary: 'Operational guide for source libraries, metadata, review states, upload boundaries, and SharePoint document governance.',
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
      },
      {
        heading: 'Operational library model',
        bullets: [
          'Use the source PDF library for reviewed or review-pending non-PHI reference files.',
          'Use SLP_Source_Index for metadata, review status, clinical area, audience, and Copilot readiness.',
          'Use page links and knowledge-index routing instead of adding every document directly to navigation.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Upload triage',
        description: 'Classify each source as reviewed SLP content, adjacent rehab review, metadata-only, or hold before promotion.',
        chips: ['Metadata', 'Review', 'Non-PHI']
      },
      {
        title: 'Source ownership',
        description: 'Track who owns review, what clinical area the source supports, and whether it is ready for Copilot grounding.',
        chips: ['Ownership', 'Copilot readiness', 'Governance']
      },
      {
        title: 'Findability model',
        description: 'Route users by task and clinical domain instead of exposing raw folders as the primary experience.',
        chips: ['IA', 'Findability', 'SharePoint']
      }
    ],
    templateGroups: [
      {
        heading: 'Document governance shells',
        items: [
          {
            title: 'New source triage shell',
            lines: [
              'Confirm the file contains no patient identifiers, screenshots, notes, scores, or resident-specific examples.',
              'Assign clinical area, discipline, document type, audience, review status, and Copilot readiness.',
              'Promote only reviewed non-PHI material to pages or Copilot knowledge.'
            ]
          },
          {
            title: 'Review decision shell',
            lines: [
              'Approved: reviewed, non-PHI, clinically relevant, source-attributed.',
              'Needs review: adjacent rehab, unclear source quality, or metadata-only record.',
              'Hold: any PHI pattern, patient-specific artifact, or unsupported clinical claim.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Clinical-Calculators.aspx',
    title: 'SLP Clinical Calculators',
    imageKey: 'cognitive',
    summary: 'Calculator orientation page with generalized scoring-playbook guidance, interpretation guardrails, and measure-selection support.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use measure-selection and interpretation playbooks without storing patient scoring data.',
          'Keep this page focused on when to use a tool, how to frame interpretation, and how to escalate to full documentation elsewhere.',
          'Patient-specific scoring and date tracking remain outside the SharePoint bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Measure-selection guide',
        description: 'Broad routing for cognition, aphasia, dysphagia, functional communication, and voice-related tools.',
        chips: ['Selection', 'Reference', 'Non-PHI']
      },
      {
        title: 'Interpretation guardrails',
        description: 'General prompts for what a score means, what it does not mean, and when to seek more assessment.',
        chips: ['Interpretation', 'Guardrails', 'Clinician-led']
      },
      {
        title: 'Documentation crosswalk',
        description: 'How scored tools connect to functional documentation without putting the scores on SharePoint.',
        chips: ['Crosswalk', 'Compliance', 'Safe']
      }
    ],
    templateGroups: [
      {
        heading: 'Calculator playbook shells',
        items: [
          {
            title: 'Measure-selection shell',
            lines: [
              'Clinical question: [screen / characterize / monitor / justify treatment / support discharge planning].',
              'Domain: [cognition / language / swallowing / voice / functional communication].',
              'Tool fit: Choose the measure that best matches the broad decision need and setting constraints.',
              'Record all patient-specific scores and details in the approved record system.'
            ]
          },
          {
            title: 'Interpretation shell',
            lines: [
              'Score meaning should be considered alongside functional presentation, clinician judgment, and tool limitations.',
              'Use the result to support next-step decisions, not as a stand-alone conclusion.',
              'If the tool suggests elevated risk or uncertainty, move to fuller assessment or interdisciplinary escalation.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Clinical-Exams.aspx',
    title: 'SLP Clinical Exams and Cranial Nerves',
    imageKey: 'aac',
    summary: 'Clinical exam orientation page with generalized cranial-nerve, oral-mech, and bedside-exam report scaffolds that stay non-PHI.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use exam frameworks and broad abnormality categories without patient names, scores, or verbatim exam write-ups.',
          'Copy report shells into the approved charting system for patient-specific completion.',
          'Do not store exam findings, scores, or bedside observations in SharePoint.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'CN exam scaffold',
        description: 'Generic structure for procedure, observation, interpretation, and follow-up recommendations.',
        chips: ['Cranial nerves', 'Template', 'Non-PHI']
      },
      {
        title: 'Oral-mech shell',
        description: 'Reusable write-up format for lips, tongue, palate, dentition, and related swallow/speech significance.',
        chips: ['Oral mech', 'Copy-ready', 'Reference']
      },
      {
        title: 'Bedside caution prompts',
        description: 'Generalized escalation prompts for instrumental consideration, airway concern, and interdisciplinary coordination.',
        chips: ['Escalation', 'Safety', 'Clinician-led']
      }
    ],
    templateGroups: [
      {
        heading: 'Exam report shells',
        items: [
          {
            title: 'Cranial nerve summary shell',
            lines: [
              'Exam focus: [CN set or functional swallow/speech concern].',
              'Observation summary: Broad abnormalities or intact findings should be charted in the clinical record, not on this SharePoint page.',
              'Clinical significance: Findings may affect airway protection, bolus control, articulation, resonance, or communication efficiency.',
              'Recommended next step: [monitor / treat / educate / seek instrumental / coordinate with team] as clinically indicated.'
            ]
          },
          {
            title: 'Oral-mech summary shell',
            lines: [
              'Structures reviewed: [lips / tongue / palate / dentition / jaw / laryngeal support].',
              'Functional impact: Document broad impact on containment, mastication, propulsion, resonance, or speech intelligibility.',
              'Plan: Complete resident-specific findings and recommendations in the approved record system.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
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
    featureCards: [
      {
        title: 'Medication Impact Lens',
        text: 'Support general awareness of medication classes that may affect alertness, swallowing, cognition, xerostomia, or voice.'
      },
      {
        title: 'Labs/Vitals Context',
        text: 'Frame how medical status can influence therapy readiness, participation, fatigue, hydration, and escalation needs.'
      },
      {
        title: 'Imaging Awareness',
        text: 'Connect chest and neuroimaging orientation to clinical questions while keeping reports and findings in source systems.'
      }
    ],
    templateGroups: [
      {
        title: 'Medical Context Review Shell',
        items: [
          'Clinical question: participation, swallow safety, cognition, communication, respiratory status, fatigue, alertness.',
          'Context category: medications, labs, vitals, imaging, pulmonary status, neurologic status.',
          'SLP action: screen for impact, coordinate with nursing/provider, adjust session demands, document skilled reasoning in EHR.',
          'Boundary: do not copy medication lists, lab values, imaging findings, or vital signs into SharePoint.'
        ]
      },
      {
        title: 'Escalation Awareness Shell',
        items: [
          'Trigger category: acute change, abnormal vital/lab concern, respiratory change, neuro change, medication side effect concern.',
          'Immediate action: follow facility policy, notify licensed provider/nursing, hold or modify therapy if indicated.',
          'Clinical implication: reassess readiness, swallow safety, communication support, cognition, fatigue, treatment tolerance.',
          'Documentation location: approved clinical record and incident/escalation workflows only.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Outcome-Measures.aspx',
    title: 'SLP Outcome Measures',
    imageKey: 'documentation',
    summary: 'Outcome-measure page with generalized selection, interpretation, and reporting-playbook support without storing patient trends.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page to choose measures, frame their role, and connect them to documentation language.',
          'Keep patient-specific outcomes, dates, and progress trends out of the SharePoint bridge.',
          'Use the bridge for structure and interpretation support only.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Measure fit',
        description: 'Broad guidance for matching outcome tools to setting, domain, and functional decision point.',
        chips: ['Measure fit', 'Reference', 'Safe']
      },
      {
        title: 'Reporting frame',
        description: 'How outcome measures support treatment planning, reassessment, recertification, and discharge logic.',
        chips: ['Reporting', 'Planning', 'Non-PHI']
      },
      {
        title: 'Trend boundary',
        description: 'Clear separation between generalized trend interpretation and resident-specific trajectory storage.',
        chips: ['Boundary', 'Interpretation', 'Governance']
      }
    ],
    templateGroups: [
      {
        heading: 'Outcome-measure playbook shells',
        items: [
          {
            title: 'Measure role shell',
            lines: [
              'Why this measure is being used: [baseline / monitor / discharge / recertification / quality support].',
              'What it informs: [severity estimate / functional impact / treatment direction / progress review].',
              'Where resident-specific results belong: approved clinical documentation and reporting systems.'
            ]
          },
          {
            title: 'Outcome-reporting shell',
            lines: [
              'Measure findings should be summarized with functional interpretation, not score alone.',
              'Use the tool to support clinical reasoning, treatment updates, and discharge planning.',
              'Avoid storing patient-level trend tables on SharePoint bridge pages.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Handout-Reference.aspx',
    title: 'SLP Handout Reference',
    imageKey: 'documentation',
    summary: 'Handout and carryover reference page for generalized education content, caregiver teaching frameworks, and sanitized handout drafting.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Create topic-based education material for swallowing safety, communication support, cognition strategies, and caregiver coaching.',
          'Use broad clinical categories or task goals instead of patient identifiers.',
          'Export or copy only generalized content from SharePoint; complete any patient-specific instructions in the approved record system.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Education handout shells',
        description: 'Copy-ready topic outlines for swallow safety, aspiration precautions, communication strategies, and home carryover.',
        chips: ['Education', 'Sanitized', 'Printable later']
      },
      {
        title: 'Caregiver teaching points',
        description: 'Generic caregiver language for setup, cueing, pacing, supervision, and red-flag escalation.',
        chips: ['Caregiver', 'Reusable', 'Non-PHI']
      },
      {
        title: 'Language and modality planning',
        description: 'Support for bilingual delivery, literacy level, and modality selection without tying content to a resident record.',
        chips: ['Access', 'Template', 'Reference']
      }
    ],
    templateGroups: [
      {
        title: 'General Handout Shell',
        items: [
          'Topic: swallowing safety, communication support, cognition strategy, voice care, AAC support, caregiver coaching.',
          'Audience: patient-facing general education, caregiver, nursing, dietary, family, interdisciplinary team.',
          'Content blocks: what it is, why it matters, what to do, when to call for help, where to find facility guidance.',
          'Boundary: remove names, dates, room numbers, diagnosis-specific history, and individualized instructions before sharing.'
        ]
      },
      {
        title: 'Caregiver Teaching Shell',
        items: [
          'Routine: meals, communication repair, memory aid use, voice conservation, AAC modeling, safety follow-through.',
          'Teaching points: setup, cueing, pacing, confirmation, supervision, environmental support, escalation trigger.',
          'Plain-language check: short sentences, clear verbs, accessible reading level, culturally responsive wording.',
          'Finalization: patient-specific changes only inside approved clinical systems or approved individualized handout workflows.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-AAC-Boards.aspx',
    title: 'SLP AAC Boards Reference',
    imageKey: 'aac',
    summary: 'AAC board and partner-support page with generalized category sets, setup guidance, and printable-board planning boundaries.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use category, access type, partner role, and context instead of resident-specific vocabulary lists.',
          'Persist only reusable board structures and partner-training checklists.',
          'Complete any resident-specific board layout outside the SharePoint bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Core board categories',
        description: 'Reusable board groupings for basic needs, feelings, activities, food, and medical interactions.',
        chips: ['AAC', 'Reusable', 'Reference']
      },
      {
        title: 'Partner-training prompts',
        description: 'Generic setup, modeling, wait time, confirmation, and repair strategies for communication partners.',
        chips: ['Partner training', 'Copy-ready', 'Non-PHI']
      },
      {
        title: 'Board planning boundary',
        description: 'Guidance for when a board stays generic versus when a resident-specific board needs session-only or external handling.',
        chips: ['Planning', 'Boundary', 'Safe']
      }
    ],
    templateGroups: [
      {
        heading: 'AAC planning shells',
        items: [
          {
            title: 'Board setup shell',
            lines: [
              'Communication context: [mealtime / pain / ADL / social / therapy].',
              'Access format: [pointing / partner assisted / visual scanning / other broad method].',
              'Core vocabulary set: [needs / yes-no / feelings / activity / medical basics].',
              'Partner support: model use, confirm selections, allow response time, and monitor breakdowns.'
            ]
          },
          {
            title: 'Partner-training shell',
            lines: [
              'Teach communication partner to present the board consistently.',
              'Use broad coaching language for modeling, cueing, repair, and encouraging initiation.',
              'Complete any resident-specific vocabulary or personalization outside this SharePoint page.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaAac, sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Quality-Evidence.aspx',
    title: 'SLP Quality and Evidence Registry',
    imageKey: 'brain',
    summary: 'Evidence and quality governance hub for source review, practice recommendations, applicability, and non-PHI quality-measure framing.',
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
      },
      {
        heading: 'Evidence operating model',
        bullets: [
          'Separate source strength, clinical applicability, precautions, and implementation notes.',
          'Use evidence summaries to guide reference pages and generalized workflow templates.',
          'Keep patient-level quality data and outcomes reporting outside the SharePoint bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Evidence review',
        description: 'Track topic, citation, evidence level, key findings, recommendations, precautions, and applicability.',
        chips: ['Evidence', 'Review', 'Source linked']
      },
      {
        title: 'Quality framing',
        description: 'Define measure type, numerator/denominator logic, benchmark framing, and reporting frequency without patient data.',
        chips: ['Quality', 'Non-PHI', 'Framework']
      },
      {
        title: 'Practice promotion',
        description: 'Move reviewed evidence into modules, templates, staff learning, or Copilot-ready sources with attribution.',
        chips: ['Promotion', 'Governance', 'Attribution']
      }
    ],
    templateGroups: [
      {
        heading: 'Evidence governance shells',
        items: [
          {
            title: 'Evidence summary shell',
            lines: [
              'Topic and clinical question.',
              'Source citation and evidence level.',
              'Key finding, recommendation, precautions, and applicability to SNF/LTC SLP practice.',
              'Promotion decision: page content, template support, staff learning, or hold.'
            ]
          },
          {
            title: 'Quality measure shell',
            lines: [
              'Measure purpose and domain.',
              'Numerator/denominator logic in generalized terms only.',
              'Data source and reporting cadence without resident-level data.',
              'Governance owner and review cycle.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Clinical-Reference.aspx',
    title: 'SLP Clinical Reference and Differential Support',
    imageKey: 'brain',
    summary: 'Clinical reference and differential-support page with generalized reasoning scaffolds, norms orientation, and treatment-planning guardrails.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use broad impairment clusters, red flags, and assessment questions instead of patient symptom narratives.',
          'Apply the reasoning scaffolds as a checklist or discussion aid, not as an automated diagnosis tool.',
          'Move resident-specific impressions and treatment plans into the approved charting system.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Differential checklist',
        description: 'Broad question sets for distinguishing dysphagia, language, cognition, voice, motor-speech, and AAC support needs.',
        chips: ['Differential', 'Checklist', 'Clinician-led']
      },
      {
        title: 'Norms orientation',
        description: 'Reference structure for where norms, developmental expectations, and adult benchmarks fit in decision making.',
        chips: ['Norms', 'Reference', 'Non-PHI']
      },
      {
        title: 'Treatment-planning guardrails',
        description: 'Generic prompts for matching deficits, safety risks, and functional goals to treatment pathways.',
        chips: ['Planning', 'Guardrails', 'Copy-ready']
      }
    ],
    templateGroups: [
      {
        heading: 'Clinical reasoning shells',
        items: [
          {
            title: 'Differential support shell',
            lines: [
              'Primary concern cluster: [swallowing / language / cognition / speech / voice / AAC].',
              'Key red flags: [broad findings category].',
              'Assessment next steps: [screen / formal assessment / instrumental / interdisciplinary consult].',
              'Rule-out / rule-in logic should be completed by the treating clinician in the approved record.'
            ]
          },
          {
            title: 'Treatment-planning shell',
            lines: [
              'Broad functional target: [safety / efficiency / participation / communication independence / decline prevention].',
              'Recommended pathway: [restorative / compensatory / education / environmental support / AAC / instrumental follow-up].',
              'Resident-specific plan details do not belong on this SharePoint page.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.cmsBilling]
  },
  {
    fileName: 'SLP-Medicare-Audit-Candidacy.aspx',
    title: 'SLP Medicare Audit and Candidacy Boundary',
    imageKey: 'medicare',
    summary: 'Medicare audit and candidacy page with generalized compliance playbooks, checklist logic, and non-PHI Part B framing.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use broad candidacy logic, skilled-need prompts, and audit checklist shells without patient identifiers or chart text.',
          'Keep this page focused on logic and structure, not resident-level billing decisions.',
          'Complete any case-specific audit or coverage analysis outside the SharePoint bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Candidacy checklist',
        description: 'Broad logic for skilled need, functional impact, improvement or maintenance rationale, and documentation sufficiency.',
        chips: ['Candidacy', 'CMS aware', 'Non-PHI']
      },
      {
        title: 'Audit playbook',
        description: 'Generalized checklist for medical necessity, skilled language, treatment link, and plan-of-care support.',
        chips: ['Audit', 'Checklist', 'Copy-ready']
      },
      {
        title: 'Section K / Part B framing',
        description: 'Reference prompts for swallowing-support documentation and outpatient/SNF justification boundaries.',
        chips: ['Section K', 'Part B', 'Reference']
      }
    ],
    templateGroups: [
      {
        heading: 'Compliance playbook shells',
        items: [
          {
            title: 'Candidacy review shell',
            lines: [
              'Functional concern: [broad communication/swallowing/cognition impact].',
              'Skilled need: Why clinician analysis, progression, or maintenance support is required.',
              'Coverage logic: Link broad functional need to medically necessary skilled service under reviewed CMS/Medicare criteria.',
              'Case-specific support should be completed in the approved record and billing workflow.'
            ]
          },
          {
            title: 'Audit checklist shell',
            lines: [
              'Confirm documentation shows medical necessity and skilled intervention.',
              'Confirm treatment targets tie to functional communication, swallowing, cognition, voice, or AAC outcomes.',
              'Confirm plan-of-care language, progress language, and recommendation language are consistent and supportable.',
              'Do not paste resident-specific note text into this SharePoint page.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.medicareSlp, sourceLinks.cmsBilling, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Trajectory-Analytics.aspx',
    title: 'SLP Trajectory Analytics Boundary',
    imageKey: 'cognitive',
    summary: 'Trajectory and trend-interpretation page with generalized progress-review logic, MDC/SEM framing, and analytics guardrails.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use broad progress-review logic and trend-interpretation prompts without storing actual resident timelines.',
          'Frame how to think about change, plateau, decline, and measurement error before applying it in the charting environment.',
          'Keep resident-level analytics and predictive workflows outside the SharePoint bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Trend review logic',
        description: 'Broad prompts for interpreting improvement, stability, mixed response, and decline.',
        chips: ['Trend', 'Interpretation', 'Non-PHI']
      },
      {
        title: 'Measurement caution',
        description: 'Generic MDC/SEM and context-of-care reminders for how much change is meaningful.',
        chips: ['MDC/SEM', 'Caution', 'Reference']
      },
      {
        title: 'Analytics boundary',
        description: 'Clear separation between safe generalized trend thinking and resident-specific analytics storage.',
        chips: ['Boundary', 'Governance', 'Safe']
      }
    ],
    templateGroups: [
      {
        heading: 'Progress-review shells',
        items: [
          {
            title: 'Trend interpretation shell',
            lines: [
              'Review question: Is function broadly improving, stable, mixed, or declining?',
              'Interpret change in the context of measurement limits, treatment intensity, and functional relevance.',
              'Resident-specific data, dates, and measures belong in the approved record system.'
            ]
          },
          {
            title: 'Plateau or decline shell',
            lines: [
              'Check whether plateau reflects expected recovery stage, measurement noise, need for a new approach, or maintenance focus.',
              'Escalate to reassessment, instrumental review, interdisciplinary coordination, or plan revision when clinically indicated.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Clinical-Safety.aspx',
    title: 'SLP Clinical Safety and Safe Mode',
    imageKey: 'brain',
    summary: 'Clinical safety page with generalized safety checks, escalation logic, and PHI-minimized operating rules for the portal.',
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
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Use this page as a reusable safety checklist for documentation, uploads, visual assets, and AI-assisted workflows.',
          'Escalate to approved systems or session-only handling whenever a workflow crosses into resident-specific content.',
          'Treat this page as the governing safe-mode reference for the bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'PHI boundary checklist',
        description: 'Simple rules for what can stay in SharePoint and what must move to session-only or external systems.',
        chips: ['PHI boundary', 'Governance', 'Always on']
      },
      {
        title: 'Workflow escalation rules',
        description: 'Broad triggers for when documentation, analytics, uploads, or AI support must leave the bridge surface.',
        chips: ['Escalation', 'Safety', 'Clinician workflow']
      },
      {
        title: 'Safe-mode operating model',
        description: 'The durable reference model for non-PHI pages, sanitized content, and reviewed source promotion.',
        chips: ['Safe mode', 'Operating model', 'Reference']
      }
    ],
    templateGroups: [
      {
        heading: 'Safety playbook shells',
        items: [
          {
            title: 'SharePoint-safe check',
            lines: [
              'Is the content generic, sanitized, and reusable beyond one resident encounter?',
              'Does it avoid identifiers, pasted note text, resident photos, scores, and resident-specific histories?',
              'If not, keep it out of durable SharePoint storage.'
            ]
          },
          {
            title: 'Escalation shell',
            lines: [
              'Move to session-only or approved clinical systems when the task requires patient identity, uploads, scoring, note drafting, or resident-linked outputs.',
              'When uncertain, default to the higher-safety workflow and keep the bridge non-PHI.'
            ]
          }
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
    featureCards: [
      {
        title: 'Self-Care Orientation',
        text: 'Route clinicians to general self-care, stress-management, ergonomics, and professional support resources.'
      },
      {
        title: 'Workload Reflection',
        text: 'Provide non-tracked prompts for workload, burnout prevention, boundaries, peer support, and sustainable practice.'
      },
      {
        title: 'Official Support Path',
        text: 'Keep HR, EAP, training, and compliance records in official systems rather than SharePoint page content.'
      }
    ],
    templateGroups: [
      {
        title: 'Wellness Resource Shell',
        items: [
          'Resource area: self-care, ergonomics, burnout prevention, stress management, peer support, professional development.',
          'Use case: personal reference, team huddle topic, onboarding resource, leadership discussion, in-service idea.',
          'Source tie: ASHA, official workplace resource, HR/EAP program, approved facility training material.',
          'Boundary: no staff health details, performance data, identifiable notes, or tracked wellness responses.'
        ]
      },
      {
        title: 'Team Support Shell',
        items: [
          'Theme: workload clarity, role boundaries, communication norms, documentation burden, professional growth.',
          'Action: share resource, route to official support, schedule team discussion, update workflow aid, escalate system barrier.',
          'Governance: keep formal HR, accommodation, medical, or performance matters in approved confidential channels.',
          'SPFx pending: optional non-tracked checklist views and resource filtering.'
        ]
      }
    ],
    links: ['https://www.asha.org/practice/self-care/', 'https://www.asha.org/practice/ergonomics/', sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Clinical-Library.aspx',
    title: 'SLP Clinical Library and PDFs',
    imageKey: 'documentation',
    summary: 'Operational clinical library hub for reviewed PDFs, source routing, clinical-area browsing, and safe document workflows.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ClinicalLibrary.tsx and src/components/PDFLibrary.tsx.',
          'Local workflows include PDF upload, document browsing, chat/summarize support, external assessment resources, preview, print, and download.',
          'Upload, document chat, summarization, delete, preview state, and persistent custom-document workflows remain SPFx pending.'
        ]
      },
      {
        heading: 'Safe library boundary',
        bullets: [
          'Use SharePoint source libraries for reviewed non-PHI documents and references.',
          'Do not upload patient-specific PDFs, notes, evals, or handouts into shared bridge libraries.',
          'Use the SLP_Source_Index list and Knowledge Source Index page to govern what becomes reviewed portal content.'
        ]
      },
      {
        heading: 'Library operating model',
        bullets: [
          'Browse by clinical area, document type, and review status before using search-only discovery.',
          'Treat source PDFs as reference inputs; keep summaries and promoted claims tied back to source records.',
          'Use reviewed sources for Copilot Studio grounding only after PHI review and owner approval.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Clinical-area browsing',
        description: 'Route sources into dysphagia, aphasia, cognition, motor speech, voice, AAC, Medicare, and safety groupings.',
        chips: ['Browse', 'Clinical area', 'Findability']
      },
      {
        title: 'Review pipeline',
        description: 'Move records from metadata-only or candidate status to reviewed page content or Copilot-ready grounding.',
        chips: ['Review', 'Promotion', 'Copilot']
      },
      {
        title: 'Document support boundary',
        description: 'Keep chat, summarization, upload, preview, and delete workflows SPFx-session-only until production controls are live.',
        chips: ['Boundary', 'SPFx later', 'Safe']
      }
    ],
    templateGroups: [
      {
        heading: 'Library workflow shells',
        items: [
          {
            title: 'Source-to-page promotion shell',
            lines: [
              'Confirm source is reviewed, non-PHI, and clinically appropriate.',
              'Extract only generalized reference points with source attribution.',
              'Add or update the target module page, then link back to the source record.'
            ]
          },
          {
            title: 'Copilot readiness shell',
            lines: [
              'Confirm source ownership and review status.',
              'Confirm no PHI and no resident-specific examples.',
              'Confirm grounding purpose: reference support only, not final clinical judgment.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, '/sites/PacificCoast_SLP/SLP_Portal_Source_PDFs/Forms/AllItems.aspx', '/sites/PacificCoast_SLP/Lists/SLP_Source_Index/AllItems.aspx']
  },
  {
    fileName: 'SLP-Video-Library.aspx',
    title: 'SLP Video Library',
    imageKey: 'vocal-folds',
    summary: 'Curated media hub for authoritative videos, staff-learning media, anatomy demonstrations, and non-PHI visual teaching assets.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/VideoLibrary.tsx.',
          'Local content includes authoritative videos for swallow mechanism and vocal fold vibration plus thumbnail-based media browsing.',
          'Interactive media modal state and expanded playback workflow remain SPFx pending.'
        ]
      },
      {
        heading: 'Media boundary',
        bullets: [
          'Use authoritative public or enterprise-approved media only.',
          'Do not upload or persist patient recordings, FEES/VFSS clips, or identifiable media into this bridge surface.',
          'Use facility-approved clinical systems for any patient-linked imaging or recorded data.'
        ]
      },
      {
        heading: 'Media operating model',
        bullets: [
          'Use media as general education and staff-training support, not patient-record evidence.',
          'Keep thumbnails, descriptions, and links source-attributed and reviewed.',
          'Use the video library together with Staff Learning and Curated Visual Aids for training workflows.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Teaching media',
        description: 'Reviewed videos for anatomy, swallow physiology, communication supports, and clinical orientation.',
        chips: ['Teaching', 'Curated', 'Reference']
      },
      {
        title: 'Staff-learning playlists',
        description: 'Group videos by clinical workflow, onboarding need, safety topic, or policy review.',
        chips: ['Training', 'Playlist', 'Findability']
      },
      {
        title: 'Media safety boundary',
        description: 'No patient recordings, patient clips, or identifiable imaging in this durable bridge surface.',
        chips: ['No PHI', 'Media safety', 'Governance']
      }
    ],
    templateGroups: [
      {
        heading: 'Media review shells',
        items: [
          {
            title: 'Media intake shell',
            lines: [
              'Confirm source is authoritative, enterprise-approved, or internally approved.',
              'Confirm the clip contains no patient identifiers or resident-linked clinical data.',
              'Assign audience, clinical area, use case, and review owner.'
            ]
          },
          {
            title: 'Training playlist shell',
            lines: [
              'Learning goal: [onboarding / safety / anatomy / treatment strategy / documentation support].',
              'Audience: [SLP / nursing / interdisciplinary / caregiver education].',
              'Follow-up action: link to the related module, source page, or staff-learning item.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Community-Networking.aspx',
    title: 'SLP Community and Networking',
    imageKey: 'voice',
    summary: 'Read-only bridge page for SLP community links, networking/event orientation, and external collaboration boundaries.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/SLPChat.tsx, src/components/WhatsAppFeed.tsx, and src/components/NetworkingEvents.tsx.',
          'Local surfaces include WhatsApp group access, live feed concepts, and networking-opportunity cards.',
          'Live message feeds, event API fetches, and community-post ingestion remain outside the SharePoint-native bridge.'
        ]
      },
      {
        heading: 'External platform boundary',
        bullets: [
          'External community tools may carry privacy, moderation, and retention considerations outside SharePoint governance.',
          'Do not post patient identifiers or case details into external chats or community feeds.',
          'Use this page as a launch point only, not as a place to mirror or store chat content.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Community Launch Point',
        text: 'Point clinicians toward vetted communities, professional groups, event opportunities, and peer-learning resources.'
      },
      {
        title: 'Privacy Boundary',
        text: 'Reinforce that external chats and feeds must never include patient identifiers, case details, or confidential facility data.'
      },
      {
        title: 'Event Routing',
        text: 'Use SharePoint as a non-PHI index for events and networking opportunities while live feeds remain outside the bridge.'
      }
    ],
    templateGroups: [
      {
        title: 'Community Resource Shell',
        items: [
          'Resource type: professional group, learning event, discussion community, mentorship, conference, webinar.',
          'Audience: SLP team, new clinicians, specialty interest group, interdisciplinary learning.',
          'Governance check: privacy expectations, moderation, retention, organizational approval, source credibility.',
          'Boundary: do not mirror chat content, case discussions, patient information, or confidential internal details.'
        ]
      },
      {
        title: 'Event Listing Shell',
        items: [
          'Event focus: dysphagia, aphasia, cognition, AAC, Medicare, documentation, leadership, wellness.',
          'Details to keep: title, organizer, date range, registration link, learning objective, source credibility.',
          'Details to avoid: attendee personal notes, patient examples, internal staffing details, credentials/passwords.',
          'SPFx pending: event feed ingestion only after privacy, moderation, and source controls are approved.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Help-Support.aspx',
    title: 'SLP Help and NetHealth Support',
    imageKey: 'brain',
    summary: 'Read-only bridge page for user guidance, technical support, NetHealth help, compliance orientation, and feature-governance boundaries.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/HelpSupport.tsx and src/components/NetHealthHelp.tsx.',
          'Local support areas include user guide, tech support, compliance info, resource upload, feature toggles, NetHealth workflow help, navigation help, troubleshooting, and document library support.',
          'Interactive support forms, uploads, feature toggles, and document-viewer states remain SPFx pending.'
        ]
      },
      {
        heading: 'Support boundary',
        bullets: [
          'Use SharePoint help pages for guidance, process, and controlled resource links.',
          'Do not submit patient data, screenshots with PHI, or resident-specific workflow issues into shared support surfaces.',
          'Direct production incidents and EHR-specific troubleshooting into approved support channels.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Help Routing',
        text: 'Organize navigation help, NetHealth workflow support, document-library guidance, compliance reminders, and feature status.'
      },
      {
        title: 'Incident Boundary',
        text: 'Route production incidents, EHR issues, and PHI-bearing screenshots into approved support channels only.'
      },
      {
        title: 'SPFx Feature Queue',
        text: 'Make pending interactive support forms, uploads, feature toggles, and document-viewer states visible without enabling unsafe storage.'
      }
    ],
    templateGroups: [
      {
        title: 'Support Request Shell',
        items: [
          'Issue category: navigation, SharePoint page, document library, source index, SPFx package, NetHealth workflow, access/permissions.',
          'Safe details: page name, general workflow step, browser/device type, non-PHI screenshot if approved by policy.',
          'Avoid: patient names, MRNs, DOBs, room numbers, chart screenshots, notes, evals, billing claims, credentials.',
          'Route: approved IT/support channel, facility workflow owner, compliance contact, or SPFx backlog.'
        ]
      },
      {
        title: 'Troubleshooting Shell',
        items: [
          'Check: page URL, browser refresh, permissions, library/list access, navigation link, source index filter.',
          'Document: reproducible non-PHI steps, expected behavior, actual behavior, timestamp, affected page/module.',
          'Escalate: authentication, access denied, missing page, failed image, broken source link, App Catalog/SPFx issue.',
          'Boundary: do not store credentials, auth codes, PHI screenshots, or patient-specific workflow examples.'
        ]
      }
    ],
    links: [sourceLinks.cmsManual, sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Therapy-Studio.aspx',
    title: 'SLP Therapy Studio Boundary',
    imageKey: 'aphasia',
    summary: 'Therapy-builder and activity-design page for generalized reusable tasks, cueing hierarchies, and non-persistent session planning.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/TherapyStudio.tsx.',
          'Local workflows include aphasia and cognition tasks, apraxia groups, role-play, game/activity generation, voice/mic support, and asset auto-save behavior.',
          'Activity generation, role-play transcripts, mic input, AI prompting, and saved session artifacts remain SPFx pending.'
        ]
      },
      {
        heading: 'Session-only boundary',
        bullets: [
          'Sensitive therapy prompts and patient-linked activity context must remain session-only.',
          'Only non-PHI or sanitized generic activity references belong in SharePoint durable storage.',
          'Use the bridge as orientation and reusable template support, not as the therapy authoring surface for resident-specific sessions.'
        ]
      },
      {
        heading: 'Generalized workflow mode',
        bullets: [
          'Build reusable activities by domain, cueing level, target behavior, and stimulus type instead of patient identity.',
          'Persist only reusable non-PHI tasks, prompts, boards, and treatment shells.',
          'Do not save patient performance, transcripts, or outcome data in SharePoint.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Reusable task builder',
        description: 'Generic aphasia, cognition, apraxia, and motor-speech activity shells that can be adapted during treatment.',
        chips: ['Reusable', 'No resident linkage', 'SPFx later']
      },
      {
        title: 'Cueing hierarchy packs',
        description: 'Prompt ladders and stimulus progressions for clinician use without storing patient response data.',
        chips: ['Cueing', 'Reference', 'Template']
      },
      {
        title: 'Session-plan scaffolds',
        description: 'Short treatment-plan structures for setup, skilled intervention, carryover, and progression planning.',
        chips: ['Planning', 'Copy-ready', 'Non-PHI']
      }
    ],
    templateGroups: [
      {
        title: 'Reusable Therapy Task Shell',
        items: [
          'Domain: aphasia, cognition, motor speech, apraxia, voice, AAC, swallowing education, caregiver/staff training.',
          'Stimulus type: words, phrases, scenarios, visual choices, scripts, routines, category lists, problem-solving prompts.',
          'Grading: cueing level, complexity, distractors, partner support, time pressure, environmental context.',
          'Boundary: do not store patient performance, transcripts, recordings, personal scripts, or resident-linked activity history.'
        ]
      },
      {
        title: 'Session Plan Shell',
        items: [
          'Setup: target behavior, materials, environment, safety considerations, communication supports.',
          'Skilled intervention: instruction, model, cueing hierarchy, feedback, modification, strategy training.',
          'Carryover: staff/caregiver prompt, written aid, daily routine, interdisciplinary handoff, next-session progression.',
          'SPFx pending: activity generation, role-play, mic input, AI prompting, and safe export controls.'
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Compliance-Center.aspx',
    title: 'SLP Compliance Center',
    imageKey: 'medicare',
    summary: 'Read-only bridge page for Jimmo, Medicare Part B, Section K, and documentation compliance orientation.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from src/components/ComplianceCenter.tsx.',
          'Local tabs include Jimmo v. Sebelius, Medicare Part B in LTC, Section K, and documentation compliance framing.',
          'Patient-view mode and interactive compliance review remain SPFx pending.'
        ]
      },
      {
        heading: 'Compliance boundary',
        bullets: [
          'Use this page for policy framing, not resident-specific coverage determinations.',
          'Coverage decisions and documentation review must remain tied to authoritative sources and licensed clinical judgment.',
          'Do not persist resident-specific compliance analyses in SharePoint-native bridge content.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Medicare Part B Frame',
        text: 'Keep coverage, skilled need, plan-of-care, and documentation concepts linked to official Medicare and CMS references.'
      },
      {
        title: 'Maintenance and Jimmo',
        text: 'Use general maintenance framing to support skilled need reasoning without creating resident-specific determinations.'
      },
      {
        title: 'Section K Awareness',
        text: 'Bridge swallowing/nutrition documentation awareness to facility workflows without duplicating MDS or EHR content.'
      }
    ],
    templateGroups: [
      {
        title: 'Compliance Review Shell',
        items: [
          'Topic: Medicare Part B, Jimmo/maintenance, Section K, documentation sufficiency, skilled need, audit readiness.',
          'Authoritative source: Medicare.gov, CMS manual/article, facility policy, payer guidance, reviewed internal resource.',
          'General question: what rule, risk, or documentation behavior needs clarification?',
          'Boundary: no resident coverage decisions, chart excerpts, claim details, diagnosis lists, or patient-specific analysis.'
        ]
      },
      {
        title: 'Documentation Sufficiency Shell',
        items: [
          'Required support: medical necessity, skilled service, objective response, plan rationale, frequency/duration, discharge criteria.',
          'Risk marker: generic language, missing skilled action, unclear response, unsupported maintenance, payer mismatch.',
          'Corrective action: improve template, educate clinicians, review source, update SharePoint guidance, route to compliance.',
          'Final review: approved clinical documentation and compliance channels only.'
        ]
      }
    ],
    links: [sourceLinks.medicareSlp, sourceLinks.cmsBilling, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Note-Template-Studio.aspx',
    title: 'SLP Note Template Studio',
    imageKey: 'documentation',
    summary: 'Copy-ready non-PHI documentation frameworks for daily notes, progress reports, recertifications, discharges, and evaluation summaries.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from DocumentationStudio, DocumentationAssistant, ThreeWayEval, and the generalized-safe portion of MedicareDocChecker.',
          'This page replaces patient-bound note generation with generalized note architecture and skilled-language templates.',
          'No note entered here should contain resident identifiers, pasted chart text, or diagnosis-specific history tied to a person.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use broad clinical categories such as swallowing, language, cognition, voice, motor speech, or AAC instead of resident identity.',
          'Copy templates out for final patient-specific completion only inside the approved charting system.',
          'Do not use SharePoint as a note repository.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Daily note',
        description: 'Skilled intervention, response, and plan language without patient identifiers.',
        chips: ['Daily note', 'Non-PHI', 'Copy-ready']
      },
      {
        title: 'Progress / recert',
        description: 'Status update and continued-need structure aligned to skilled treatment justification.',
        chips: ['Progress', 'Recert', 'CMS aware']
      },
      {
        title: 'Discharge / eval',
        description: 'Outcome, recommendations, and next-step framing for generalized summaries and evaluation write-ups.',
        chips: ['Discharge', 'Evaluation', 'Template']
      }
    ],
    templateGroups: [
      {
        heading: 'Copy-ready note frameworks',
        items: [
          {
            title: 'Daily note shell',
            lines: [
              'Visit focus: [clinical domain] and [functional target].',
              'Skilled intervention: SLP provided [assessment/treatment/cueing/education] using [approach or strategy].',
              'Response to intervention: Patient response language belongs in the charting system, not this SharePoint page.',
              'Clinical rationale: Continued skilled SLP services remain indicated for [functional communication/swallowing/cognitive-linguistic/voice/AAC need].',
              'Plan: Continue per plan of care with next-session emphasis on [target area].'
            ]
          },
          {
            title: 'Progress or recert shell',
            lines: [
              'Current status: [broad area] shows [improved/stable/mixed] performance relative to start-of-care expectations.',
              'Skilled need: Ongoing services require clinician analysis, cueing adjustment, and plan-of-care modification.',
              'Functional value: Intervention supports safety, communication participation, carryover, or decline prevention.',
              'Plan-of-care update: Continue, revise, or taper based on current skilled need and functional goals.'
            ]
          },
          {
            title: 'Evaluation summary shell',
            lines: [
              'Reason for referral: [broad concern category].',
              'Assessment framework: Screening/exam/results should be completed in the approved clinical record system.',
              'Clinical impression: Findings are consistent with [broad impairment area] requiring skilled SLP assessment and treatment planning.',
              'Recommendations: [further assessment / treatment frequency / education / instrumental coordination] as clinically indicated.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.cmsBilling, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Goal-and-Intervention-Studio.aspx',
    title: 'SLP Goal and Intervention Studio',
    imageKey: 'cognitive',
    summary: 'Generalized SMART-goal, skilled-language, and intervention-planning workspace built from the local Goal Generator and treatment modules.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from GoalGenerator, Goal Bank, Treatment Ideas, and the reusable-safe portion of TherapyStudio.',
          'This page preserves goal architecture and intervention planning while removing resident-linked persistence.',
          'Save templates only; complete resident-specific wording in the approved charting system.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use deficit category, task demand, cueing level, and functional target instead of a resident name or resident history.',
          'Do not store patient baseline, exact performance data, or patient-specific measurable results here.',
          'Use maintenance-language carefully and only where clinically justified.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'SMART goal shells',
        description: 'Specific, measurable, skilled, and time-bound goal frameworks that remain non-PHI until finalized elsewhere.',
        chips: ['SMART', 'Reusable', 'Non-PHI']
      },
      {
        title: 'Skilled intervention language',
        description: 'Copy-ready phrasing for cueing, strategy training, education, and progression rationales.',
        chips: ['Skilled need', 'Copy-ready', 'Reference']
      },
      {
        title: 'Session-plan scaffold',
        description: 'Short plan builder for target behavior, task hierarchy, supports, and carryover planning.',
        chips: ['Planning', 'Template', 'Generalized']
      }
    ],
    templateGroups: [
      {
        heading: 'Goal and intervention frameworks',
        items: [
          {
            title: 'SMART goal shell',
            lines: [
              'Patient identifier and exact diagnosis stay out of this SharePoint page.',
              'Within [timeframe], the patient will improve [functional target] during [task/context] with [cueing level] in order to support [functional outcome].',
              'Skilled rationale: Goal requires clinician analysis, cueing adjustment, and treatment progression beyond routine exercise.'
            ]
          },
          {
            title: 'Maintenance-focused shell',
            lines: [
              'Within [timeframe], the patient will maintain [broad function or safety behavior] using [strategy/support] to reduce risk of decline.',
              'Skilled rationale: Ongoing clinician monitoring and modification are required to preserve safety, participation, or functional efficiency.'
            ]
          },
          {
            title: 'Intervention-plan shell',
            lines: [
              'Target behavior: [swallowing / expression / comprehension / memory / speech / voice / AAC].',
              'Primary technique: [cueing hierarchy / strategy training / drill / compensatory support / caregiver education].',
              'Progression rule: Increase complexity, reduce cueing, or shift context when broad success criteria are met in the clinical record.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.cmsBilling, sourceLinks.cmsManual, sourceLinks.ashaPortal]
  },
  {
    fileName: 'SLP-Clinical-Copilot-Playbooks.aspx',
    title: 'SLP Clinical Copilot Playbooks',
    imageKey: 'brain',
    summary: 'Generalized clinical-reasoning, case-brainstorm, and evidence-check workflows derived from the local AI Assistant and Case Brainstorm modules.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from AIAssistant, CaseBrainstorm, ClinicalReference, and generalized-safe reasoning support patterns.',
          'This page preserves how to ask, structure, and verify clinical-support questions without saving PHI-bearing conversations.',
          'Use this page for question framing, evidence routing, and escalation logic only.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Do not paste patient histories, verbatim notes, or identifying case details into SharePoint pages.',
          'Use broad scenario labels and de-identified functional concerns when drafting a question or case prompt.',
          'Clinical judgment remains with the treating clinician; this is support, not diagnosis.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Case brainstorm',
        description: 'De-identified case-conference question framing for dysphagia, cognition, communication, voice, and AAC.',
        chips: ['Case review', 'De-identified', 'Reference']
      },
      {
        title: 'Evidence check',
        description: 'Question templates that route clinicians back to ASHA, CMS, Medicare, and reviewed local references.',
        chips: ['Evidence', 'Source-first', 'Safe']
      },
      {
        title: 'Escalation logic',
        description: 'Generic prompts for when to seek more assessment, instrumental input, interdisciplinary review, or policy confirmation.',
        chips: ['Escalation', 'Clinical support', 'Non-PHI']
      }
    ],
    templateGroups: [
      {
        heading: 'Clinical question playbooks',
        items: [
          {
            title: 'Consult question shell',
            lines: [
              'Clinical topic: [domain].',
              'Functional concern: [broad impact on safety, intake, communication, cognition, or participation].',
              'What has been tried: [broad strategy class, not patient-specific note text].',
              'Question for support: What evidence-based next steps, precautions, or assessment considerations should be reviewed?'
            ]
          },
          {
            title: 'Case-conference shell',
            lines: [
              'Reason for discussion: [broad impairment area and decision point].',
              'Key decision options: [assessment / treatment / education / instrumentals / coordination].',
              'Needed references: [ASHA / CMS / Medicare / local reviewed policy / facility workflow].',
              'Escalation triggers: [safety risk / change in function / uncertain candidacy / need for interdisciplinary review].'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsBilling, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-Handout-Therapy-Templates.aspx',
    title: 'SLP Handout and Therapy Templates',
    imageKey: 'aphasia',
    summary: 'Generalized therapy-task and education-template page for reusable activities, carryover supports, and sanitized caregiver materials.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from HandoutMaker, TherapyStudio, selected AAC supports, and the admin-curated-safe portion of visual aid workflows.',
          'This page preserves reusable education and therapy planning content while leaving patient-specific customization outside SharePoint.',
          'Admin-curated images and boards are acceptable; user-generated resident-linked assets are not persisted here.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Use topic-based therapy plans, cueing supports, and caregiver teaching language only.',
          'Do not save patient names, personalized home programs, or patient-specific performance summaries in SharePoint.',
          'Any resident-specific version should be completed outside the bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Therapy activity shells',
        description: 'Reusable activity structures for aphasia, cognition, motor speech, voice, AAC, and swallowing support.',
        chips: ['Reusable', 'Task-based', 'Generalized']
      },
      {
        title: 'Carryover handouts',
        description: 'Topic-based caregiver and patient education frameworks that stay sanitized and non-PHI.',
        chips: ['Carryover', 'Education', 'Sanitized']
      },
      {
        title: 'Curated visual aids',
        description: 'Admin-curated boards, diagrams, and prompt cards instead of user-generated patient-linked asset storage.',
        chips: ['Curated', 'Visual aids', 'Safe storage']
      }
    ],
    templateGroups: [
      {
        heading: 'Reusable therapy and education frameworks',
        items: [
          {
            title: 'Therapy activity shell',
            lines: [
              'Target area: [domain].',
              'Task format: [drill / strategy / sorting / naming / sequencing / carryover / roleplay].',
              'Cueing hierarchy: [max / mod / min / independent] with progression rules handled in the clinical record.',
              'Carryover prompt: Provide a broad home-practice or caregiver-support instruction without identifiers.'
            ]
          },
          {
            title: 'Education handout shell',
            lines: [
              'Topic: [swallow safety / communication strategies / cognition support / voice hygiene / AAC setup].',
              'Why it matters: Explain the broad functional risk or benefit.',
              'How to help: Provide generic caregiver or self-management supports.',
              'When to alert the clinician: List broad red flags and escalation points.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual, sourceLinks.medicareSlp]
  },
  {
    fileName: 'SLP-Curated-Visual-Aids.aspx',
    title: 'SLP Curated Visual Aids',
    imageKey: 'aphasia',
    summary: 'Admin-curated visual aid library for reusable diagrams, boards, prompt cards, and training assets derived from the safe portion of the local asset gallery.',
    sections: [
      {
        heading: 'Local module mapping',
        bullets: [
          'Mapped from AssetGallery and the non-persistent visual-support surfaces across HandoutMaker, TherapyStudio, AAC workflows, and anatomy/clinical reference modules.',
          'This page substitutes curated and approved visual references for the local generated-asset browser.',
          'User-generated resident-linked assets remain outside the SharePoint-native bridge.'
        ]
      },
      {
        heading: 'Safe use boundary',
        bullets: [
          'Only admin-curated or sanitized generic visuals belong in this durable SharePoint surface.',
          'Do not upload resident photos, patient-labeled screenshots, patient-specific boards, or generated assets containing identifiers.',
          'Resident-specific visual supports should be created in session or completed outside the bridge.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Clinical diagrams',
        description: 'Reusable anatomy, swallow, airway, cranial-nerve, and communication-support visuals for clinician reference.',
        chips: ['Clinical', 'Curated', 'Reference']
      },
      {
        title: 'Prompt cards and boards',
        description: 'Generic visual supports for cueing, partner training, AAC basics, and therapy setup.',
        chips: ['Prompt cards', 'Reusable', 'Non-PHI']
      },
      {
        title: 'Governed asset storage',
        description: 'A safe durable home for approved visuals while user-generated resident-linked media stays out of SharePoint.',
        chips: ['Governance', 'Safe storage', 'Admin curated']
      }
    ],
    templateGroups: [
      {
        heading: 'Visual aid planning shells',
        items: [
          {
            title: 'Curated visual request shell',
            lines: [
              'Asset type: [diagram / board / prompt card / training sheet / reference image].',
              'Clinical use: [education / cueing / orientation / staff training / patient-facing generic support].',
              'Audience: [clinician / caregiver / staff / general patient education].',
              'Approval rule: Only add the asset if it is sanitized, generic, and safe for shared durable storage.'
            ]
          },
          {
            title: 'Visual governance shell',
            lines: [
              'Check that the visual contains no names, room numbers, dates, screenshots with PHI, or patient photos.',
              'Check that the visual is clinically useful beyond one resident encounter.',
              'Store only approved and reusable assets in SharePoint.'
            ]
          }
        ]
      }
    ],
    links: [sourceLinks.ashaPortal, sourceLinks.cmsManual]
  },
  {
    fileName: 'SLP-SPFx-Production-Handoff.aspx',
    title: 'SLP SPFx Production Handoff',
    imageKey: 'brain',
    summary: 'Production handoff page for moving from the SharePoint-native bridge to the full SPFx app experience when catalog deployment is available.',
    sections: [
      {
        heading: 'Production path',
        bullets: [
          'Use SharePoint Framework as the production app shell and expose it as a Single Part App Page when App Catalog or site catalog deployment is available.',
          'Keep durable SharePoint storage limited to non-PHI references, source metadata, reviewed files, and sanitized reusable assets.',
          'Keep resident-specific drafting, scoring, uploads, chat, analytics, and generated assets session-only or inside approved clinical systems.'
        ]
      },
      {
        heading: 'Interactive modules to port next',
        bullets: [
          'Documentation Studio: session-only note drafting with sanitized copy/export controls.',
          'Therapy Studio: builder/play interaction with no resident-linked durable state.',
          'Clinical calculators, exams, and outcome tools: in-session scoring and interpretation without SharePoint persistence.',
          'Medicare document review: transient upload/analyze flow with no durable patient-file retention in the bridge.'
        ]
      },
      {
        heading: 'Deployment prerequisites',
        bullets: [
          'App Catalog or site collection app catalog upload path must be available.',
          'SPFx package must validate, bundle, package, deploy, and load on the Pacific Coast SLP site.',
          'Any new Graph or Entra permissions must be documented, least-privilege, and approved before use.'
        ]
      }
    ],
    featureCards: [
      {
        title: 'Single full-page app',
        description: 'Use SPFx Single Part App Pages for the closest local-portal experience with a locked full-page layout.',
        chips: ['SPFx', 'Full page', 'Microsoft Learn']
      },
      {
        title: 'Session-only workflows',
        description: 'Bring back interactivity while keeping patient-specific data out of durable SharePoint lists and pages.',
        chips: ['Session-only', 'No durable PHI', 'Interactive']
      },
      {
        title: 'Non-PHI content services',
        description: 'Continue using SharePoint pages, lists, and libraries for source metadata, reviewed knowledge, and reusable references.',
        chips: ['SharePoint data', 'Reviewed sources', 'Governance']
      }
    ],
    templateGroups: [
      {
        heading: 'SPFx handoff checklist',
        items: [
          {
            title: 'Build and package',
            lines: [
              'Run SPFx build validation and production bundle/package steps.',
              'Confirm package metadata and supported host settings match the full-page app path.',
              'Confirm no patient/session/goal/review list dependency has been reintroduced.'
            ]
          },
          {
            title: 'Deploy and verify',
            lines: [
              'Upload and deploy the SPFx package through the approved catalog path.',
              'Create or update the Single Part App Page on the Pacific Coast SLP site.',
              'Validate page load, navigation, source-library reads, session-only guards, and no durable PHI writes.'
            ]
          },
          {
            title: 'Promote modules',
            lines: [
              'Port generalized bridge pages into richer SPFx screens first.',
              'Then add session-only interactivity for documentation, calculators, therapy, handouts, and Medicare review.',
              'Keep SharePoint-native pages as fallback reference hubs and governance pages.'
            ]
          }
        ]
      }
    ],
    links: [
      'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview',
      'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/single-part-app-pages',
      'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint',
      'https://learn.microsoft.com/en-us/graph/permissions-overview'
    ]
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
    featureCards: [
      {
        title: 'Source Triage',
        text: 'Classify local and SharePoint sources by clinical area, document type, discipline, audience, review state, and promotion path.'
      },
      {
        title: 'Review Workflow',
        text: 'Move candidate records through owner review before page promotion, Copilot grounding, or library publication.'
      },
      {
        title: 'Copilot Readiness',
        text: 'Prepare only reviewed, non-PHI, authoritative sources for Copilot Studio grounding and future SPFx-assisted discovery.'
      }
    ],
    templateGroups: [
      {
        title: 'Source Review Shell',
        items: [
          'Source identity: title, library/path, source kind, owner, clinical area, discipline, audience, document type.',
          'Review state: candidate, reviewed, adjacent rehab review, metadata-only, hold/manual review, retired.',
          'Promotion decision: SharePoint page content, source-library reference, Copilot knowledge, archive, or exclude.',
          'Boundary: no patient lists, session notes, resident goals, chart examples, or PHI-bearing documents.'
        ]
      },
      {
        title: 'Copilot Grounding Shell',
        items: [
          'Grounding source: reviewed SharePoint page, reviewed source file, approved public reference, approved enterprise reference.',
          'Readiness checks: non-PHI, current, source-owned, clinically scoped, authoritative, retrievable, version controlled.',
          'Use case: answer support, source navigation, clinician onboarding, documentation framework, compliance reference.',
          'Governance: periodic review, owner confirmation, retired-source handling, prompt/response monitoring in approved systems.'
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
  { title: 'SLP Clinical Library', fileName: 'SLP-Clinical-Library.aspx' },
  { title: 'SLP Video Library', fileName: 'SLP-Video-Library.aspx' },
  { title: 'SLP Note Templates', fileName: 'SLP-Note-Template-Studio.aspx' },
  { title: 'SLP Goal Studio', fileName: 'SLP-Goal-and-Intervention-Studio.aspx' },
  { title: 'SLP Copilot Playbooks', fileName: 'SLP-Clinical-Copilot-Playbooks.aspx' },
  { title: 'SLP Handout Templates', fileName: 'SLP-Handout-Therapy-Templates.aspx' },
  { title: 'SLP Visual Aids', fileName: 'SLP-Curated-Visual-Aids.aspx' },
  { title: 'SPFx Handoff', fileName: 'SLP-SPFx-Production-Handoff.aspx' },
  { title: 'SLP Support', fileName: 'SLP-Help-Support.aspx' },
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

function getLinkMeta(href) {
  try {
    if (href.startsWith('/')) {
      return {
        label: href.split('/').filter(Boolean).slice(-2).join(' / ') || href,
        domain: 'Pacific Coast SharePoint'
      };
    }
    const url = new URL(href);
    const hostname = url.hostname.replace(/^www\./, '');
    const labelByDomain = new Map([
      ['asha.org', 'ASHA'],
      ['cms.gov', 'CMS'],
      ['medicare.gov', 'Medicare.gov'],
      ['learn.microsoft.com', 'Microsoft Learn'],
      ['adoption.microsoft.com', 'Microsoft Adoption'],
      ['fluent2.microsoft.design', 'Fluent 2'],
      ['ensignservices.sharepoint.com', 'Pacific Coast SharePoint']
    ]);
    return {
      label: labelByDomain.get(hostname) || hostname,
      domain: labelByDomain.get(hostname) || hostname
    };
  } catch {
    return { label: href, domain: 'Reference' };
  }
}

function renderActionPills(actions = []) {
  return actions.map((action) => `
    <a href="${htmlEscape(action.href)}" style="display:inline-flex;align-items:center;gap:8px;margin:0 10px 10px 0;padding:11px 16px;border-radius:999px;background:${htmlEscape(action.tone || '#0f6cbd')};border:1px solid rgba(255,255,255,0.24);color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:0.01em;box-shadow:0 10px 24px rgba(15,108,189,0.16);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;">${htmlEscape(action.label)}</a>
  `).join('');
}

function renderCanvasActionPills(actions = []) {
  return actions.map((action) => `
    <a href="${htmlEscape(action.href)}" style="display:inline-flex;align-items:center;margin:0 8px 8px 0;padding:9px 13px;border-radius:999px;background:${htmlEscape(action.tone || '#0f6cbd')};color:#ffffff;text-decoration:none;font-size:12px;font-weight:800;">${htmlEscape(action.label)}</a>
  `).join('');
}

function getPortalGroupKey(item) {
  const fileName = item.fileName || '';
  if (/(Documentation-Studio|Goal-Bank|Treatment-Ideas|Quick-Reference|Coding-Reference|Clinical-Pathways|Therapy-Studio|Note-Template-Studio|Goal-and-Intervention-Studio|Clinical-Copilot-Playbooks|Handout-Therapy-Templates|Curated-Visual-Aids|AAC-Boards|Handout-Reference)/i.test(fileName)) {
    return 'workflow';
  }
  if (/(Clinical-Library|Video-Library|Document-Library-Guide|Knowledge-Source-Index|Quality-Evidence|Staff-Learning|Ensign-Corner)/i.test(fileName)) {
    return 'knowledge';
  }
  if (/(Medicare-Compliance|Compliance-Center|Medicare-Audit-Candidacy|Trajectory-Analytics|Clinical-Safety|SPFx-Production-Handoff|Help-Support|Community-Networking|Life-Wellness)/i.test(fileName)) {
    return 'governance';
  }
  return 'clinical';
}

function buildPortalGroups() {
  const groupMeta = {
    clinical: {
      id: 'clinical-modules',
      label: 'Clinical modules',
      summary: 'Core swallowing, communication, anatomy, airway, safety, and differential support destinations.',
      badge: 'Clinical'
    },
    workflow: {
      id: 'workflow-studios',
      label: 'Workflow studios',
      summary: 'Daily-use templates, therapy planning, handouts, coding, and generalized documentation support.',
      badge: 'Workflow'
    },
    knowledge: {
      id: 'knowledge-libraries',
      label: 'Knowledge libraries',
      summary: 'Reviewed learning surfaces, source indexing, PDFs, video references, and evidence curation.',
      badge: 'Knowledge'
    },
    governance: {
      id: 'governance-operations',
      label: 'Governance and operations',
      summary: 'Compliance, escalation boundaries, support, SPFx handoff, and portal operating constraints.',
      badge: 'Operations'
    }
  };

  const grouped = Object.entries(groupMeta).map(([key, meta]) => ({
    key,
    ...meta,
    items: pages.filter((item) => item.fileName !== 'SLP-Portal.aspx' && getPortalGroupKey(item) === key)
  }));

  return grouped.filter((group) => group.items.length);
}

function renderPortalMapGroups() {
  return buildPortalGroups().map((group) => `
    <section id="${group.id}" style="margin:0 0 26px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;flex-wrap:wrap;">
        <div>
          <div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">${htmlEscape(group.badge)}</div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">${htmlEscape(group.label)}</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;max-width:780px;">${htmlEscape(group.summary)}</p>
        </div>
        <div style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#f8fafc;color:#475569;font-size:11px;font-weight:800;text-transform:uppercase;">${group.items.length} pages</div>
      </div>
      ${group.key === 'clinical' ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;">
          ${group.items.map((item) => {
            const itemImage = imageUrlByKey[item.imageKey] || imageUrlByKey.background;
            return `
              <a href="/sites/PacificCoast_SLP/SitePages/${htmlEscape(item.fileName)}" style="display:block;border:1px solid #dbe5ee;border-radius:24px;overflow:hidden;background:#ffffff;text-decoration:none;box-shadow:0 18px 36px rgba(15,23,42,0.06);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;">
                <div style="background:radial-gradient(circle at top left,rgba(14,165,233,0.14),transparent 34%),linear-gradient(180deg,#f8fbfd 0%,#f1f5f9 100%);text-align:center;padding:18px 16px 12px 16px;">
                  <img src="${htmlEscape(itemImage)}" alt="${htmlEscape(item.title)} module image" style="width:100%;max-width:250px;height:auto;display:inline-block;" />
                </div>
                <div style="padding:18px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 8px 0;">
                    <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:800;text-transform:uppercase;">${htmlEscape(group.badge)}</span>
                    <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#eef2ff;color:#3730a3;font-size:11px;font-weight:800;text-transform:uppercase;">Core module</span>
                  </div>
                  <h3 style="margin:0 0 8px 0;font-size:19px;line-height:1.3;color:#0f172a;">${htmlEscape(item.title)}</h3>
                  <p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">${htmlEscape(item.summary)}</p>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      ` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
          ${group.items.map((item) => `
            <a href="/sites/PacificCoast_SLP/SitePages/${htmlEscape(item.fileName)}" style="display:block;border:1px solid #dbe5ee;border-radius:20px;padding:15px 16px;background:#ffffff;text-decoration:none;box-shadow:0 12px 24px rgba(15,23,42,0.05);border-top:4px solid ${group.key === 'workflow' ? '#0f6cbd' : group.key === 'knowledge' ? '#0891b2' : '#155e75'};">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 8px 0;">
                <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:${group.key === 'workflow' ? '#eff6ff;color:#1d4ed8' : group.key === 'knowledge' ? '#ecfeff;color:#155e75' : '#f0fdf4;color:#166534'};font-size:10px;font-weight:800;text-transform:uppercase;">${htmlEscape(group.badge)}</span>
                <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#f8fafc;color:#475569;font-size:10px;font-weight:800;text-transform:uppercase;">Open page</span>
              </div>
              <h3 style="margin:0 0 8px 0;font-size:17px;line-height:1.35;color:#0f172a;">${htmlEscape(item.title)}</h3>
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.65;">${htmlEscape(item.summary)}</p>
            </a>
          `).join('')}
        </div>
      `}
    </section>
  `).join('');
}

function renderCanvasCardGrid(items = []) {
  if (!items.length) return '';
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
      ${items.map((item) => `
        <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;">
          ${item.eyebrow ? `<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">${htmlEscape(item.eyebrow)}</div>` : ''}
          <div style="font-size:15px;line-height:1.35;font-weight:800;color:#0f172a;margin:0 0 6px 0;">${htmlEscape(item.title)}</div>
          <div style="color:#64748b;font-size:13px;line-height:1.55;">${htmlEscape(item.text)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCanvasHtml(page) {
  const heroImage = imageUrlByKey[page.imageKey] || imageUrlByKey.background;
  const isHome = page.fileName === 'SLP-Portal.aspx';
  const portalGroups = buildPortalGroups();
  const homeActions = [
    { label: 'Open Dysphagia', href: '/sites/PacificCoast_SLP/SitePages/SLP-Dysphagia.aspx', tone: '#0f6cbd' },
    { label: 'Open Aphasia', href: '/sites/PacificCoast_SLP/SitePages/SLP-Aphasia.aspx', tone: '#0891b2' },
    { label: 'Medicare and Compliance', href: '/sites/PacificCoast_SLP/SitePages/SLP-Medicare-Compliance.aspx', tone: '#0f766e' },
    { label: 'Documentation Studio', href: '/sites/PacificCoast_SLP/SitePages/SLP-Documentation-Studio.aspx', tone: '#1d4ed8' }
  ];
  const pageActions = [
    { label: 'Portal home', href: '/sites/PacificCoast_SLP/SitePages/SLP-Portal.aspx', tone: '#0f172a' },
    { label: 'Knowledge index', href: '/sites/PacificCoast_SLP/SitePages/SLP-Knowledge-Source-Index.aspx', tone: '#0f6cbd' },
    { label: 'Clinical library', href: '/sites/PacificCoast_SLP/SitePages/SLP-Clinical-Library.aspx', tone: '#0891b2' },
    { label: 'SPFx handoff', href: '/sites/PacificCoast_SLP/SitePages/SLP-SPFx-Production-Handoff.aspx', tone: '#155e75' }
  ];
  const workflowCards = (page.featureCards || []).slice(0, 3).map((card) => ({
    eyebrow: 'Reference',
    title: card.title,
    text: card.description || card.text || ''
  }));
  const templateCards = (page.templateGroups || []).slice(0, 2).flatMap((group) => {
    const heading = group.heading || group.title || 'Workflow template';
    return (group.items || []).slice(0, 2).map((item) => ({
      eyebrow: heading,
      title: typeof item === 'string' ? heading : item.title,
      text: typeof item === 'string' ? item : (item.lines || []).slice(0, 2).join(' ')
    }));
  }).slice(0, 4);
  const sectionCards = (page.sections || []).slice(0, isHome ? 2 : 3).flatMap((section) =>
    (section.bullets || []).slice(0, 2).map((bullet) => ({
      eyebrow: section.heading,
      title: section.heading,
      text: bullet
    }))
  ).slice(0, 6);
  const referenceCards = (page.links || []).slice(0, 4).map((href) => {
    const meta = getLinkMeta(href);
    return {
      eyebrow: meta.domain,
      title: meta.label,
      text: href
    };
  });
  const homeGroupCards = portalGroups.map((group) => ({
    eyebrow: group.badge,
    title: `${group.label} (${group.items.length})`,
    text: group.summary
  }));
  const compactStatusCards = (isHome ? homeGroupCards : sectionCards).slice(0, 4);
  const compactWorkflowCards = (workflowCards.length ? workflowCards : [{
    eyebrow: 'Reference',
    title: isHome ? 'Workflow launch layer' : 'Reference launch layer',
    text: isHome ? 'Open high-use modules, workflow pages, and knowledge destinations before completing chart work in approved systems.' : 'Use this page to frame review, treatment planning, and source coordination without entering resident identifiers.'
  }]).slice(0, 3);
  const compactTemplateCards = (templateCards.length ? templateCards : [{
    eyebrow: 'Workflow template',
    title: isHome ? 'Generalized template workflow' : 'Generalized template shell',
    text: 'Keep impairment framing, skilled-service language, goals, and carryover prompts generalized until the approved record is open.'
  }]).slice(0, 3);
  const compactRefLinks = (page.links || []).slice(0, 4).map((href) => {
    const meta = getLinkMeta(href);
    return `<a href="${htmlEscape(href)}" style="display:inline-flex;align-items:center;margin:0 8px 8px 0;padding:7px 11px;border-radius:999px;background:#f8fafc;border:1px solid #dbe5ee;color:#0f172a;text-decoration:none;font-size:12px;font-weight:700;">${htmlEscape(meta.label)}</a>`;
  }).join('');

  return `
    <div style="max-width:1360px;margin:0 auto;padding:4px 0 18px 0;color:#0f172a;">
      <div style="border:1px solid #dbe5ee;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#f8fbfd 0%,#ffffff 45%,#eef6ff 100%);margin:0 0 14px 0;">
        <div style="display:grid;grid-template-columns:minmax(150px,240px) minmax(0,1fr);gap:0;align-items:stretch;">
          <div style="display:flex;align-items:center;justify-content:center;padding:16px;background:linear-gradient(180deg,#f8fbfd 0%,#eef2f7 100%);text-align:center;">
            <img src="${htmlEscape(heroImage)}" alt="${htmlEscape(isHome ? 'Pacific Coast logo' : `${page.title} hero image`)}" style="width:100%;max-width:${isHome ? '170px' : '190px'};height:auto;display:inline-block;" />
          </div>
          <div style="padding:16px 18px;">
            <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#0369a1;margin:0 0 8px 0;">${htmlEscape(isHome ? 'SharePoint clinical reference portal' : 'Pacific Coast SLP module')}</div>
            <h1 style="margin:0 0 8px 0;font-size:${isHome ? '30px' : '27px'};line-height:1.1;color:#0f172a;">${htmlEscape(isHome ? 'Pacific Coast SLP Portal' : page.title)}</h1>
            <p style="margin:0 0 10px 0;color:#475569;font-size:13px;line-height:1.55;">${htmlEscape(isHome ? 'Minimalist, task-first launch point for clinical references, reviewed sources, and non-PHI workflow scaffolds while the production app remains SPFx pending.' : page.summary)}</p>
            <div style="margin:0 0 8px 0;">
              <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#e0f2fe;color:#0c4a6e;font-size:10px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SharePoint-native bridge</span>
              <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#f0fdf4;color:#166534;font-size:10px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">Non-PHI</span>
              <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:10px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SPFx pending</span>
            </div>
            <div>${renderCanvasActionPills(isHome ? homeActions : pageActions)}</div>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:0 0 14px 0;">
        <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#1d4ed8;margin:0 0 6px 0;">Production path</div><div style="font-size:16px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">PHI-minimized SPFx shell</div><div style="color:#64748b;font-size:12px;line-height:1.5;">Single Part App Page remains the production endpoint for patient-adjacent interactive workflows.</div></div>
        <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#0891b2;margin:0 0 6px 0;">Bridge purpose</div><div style="font-size:16px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">Dense reference layer</div><div style="color:#64748b;font-size:12px;line-height:1.5;">Fast scanning, clear labels, and high-signal links while App Catalog deployment remains blocked.</div></div>
        <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#166534;margin:0 0 6px 0;">Clinical boundary</div><div style="font-size:16px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">Reference now, chart elsewhere</div><div style="color:#64748b;font-size:12px;line-height:1.5;">No patient-specific data entry, no durable resident artifacts, and no hidden workflow persistence.</div></div>
      </div>
      <div style="border:1px solid #f7d78c;border-radius:18px;background:linear-gradient(135deg,#fffdf3 0%,#fffbeb 100%);padding:13px 14px;margin:0 0 14px 0;">
        <div style="font-size:22px;font-weight:900;line-height:1.1;color:#78350f;margin:0 0 6px 0;">PHI guardrails</div>
        <div style="color:#92400e;font-size:12px;line-height:1.55;">No patient tracker, resident list, identifiers, or PHI fields belong on this bridge page. Do not paste patient-specific notes, evaluation text, recordings, or treatment data into SharePoint page content.</div>
      </div>
      <div style="margin:0 0 14px 0;">
        <div style="font-size:24px;font-weight:900;line-height:1.1;color:#0f172a;margin:0 0 6px 0;">${htmlEscape(isHome ? 'Portal map' : 'Bridge status')}</div>
        <div style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 8px 0;">${htmlEscape(isHome ? 'Task-first navigation grouped by clinician intent, workflow shells, knowledge surfaces, and governance.' : 'Mapped from the local portal while interactive workflow remains SPFx pending.')}</div>
        ${renderCanvasCardGrid(compactStatusCards)}
      </div>
      <div style="margin:0 0 14px 0;">
        <div style="font-size:24px;font-weight:900;line-height:1.1;color:#0f172a;margin:0 0 6px 0;">Generalized workflow surfaces</div>
        <div style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 8px 0;">High-utility non-PHI launch surfaces mapped from the local portal.</div>
        ${renderCanvasCardGrid(compactWorkflowCards)}
      </div>
      <div style="margin:0 0 14px 0;">
        <div style="font-size:24px;font-weight:900;line-height:1.1;color:#0f172a;margin:0 0 6px 0;">Template-mode workflow shells</div>
        <div style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 8px 0;">Copy-ready structures that stay generalized until finalized in approved clinical systems.</div>
        ${renderCanvasCardGrid(compactTemplateCards)}
      </div>
      <div style="margin:0 0 14px 0;">
        <div style="font-size:24px;font-weight:900;line-height:1.1;color:#0f172a;margin:0 0 6px 0;">Authoritative references</div>
        <div style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 8px 0;">ASHA, CMS, Medicare.gov, Microsoft Learn, and approved SharePoint sources: asha.org, cms.gov, medicare.gov, learn.microsoft.com.</div>
        <div>${compactRefLinks}</div>
      </div>
      <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px 14px;background:#ffffff;">
        <div style="font-size:22px;font-weight:900;line-height:1.1;color:#0f172a;margin:0 0 6px 0;">Production note</div>
        <div style="color:#64748b;font-size:12px;line-height:1.55;">This page is a SharePoint-native bridge shaped around findability, task visibility, and non-PHI reference use. The production app remains the PHI-minimized SPFx portal package, so interactive workflow behavior is SPFx pending.</div>
      </div>
    </div>
  `.replace(/\n\s+/g, '\n').trim();

  return `
    <div style="max-width:1400px;margin:0 auto;padding:4px 0 20px 0;color:#0f172a;">
      <div style="border:1px solid #dbe5ee;border-radius:28px;overflow:hidden;background:linear-gradient(135deg,#f8fbfd 0%,#ffffff 45%,#eef6ff 100%);margin:0 0 18px 0;">
        <div style="display:grid;grid-template-columns:${isHome ? 'minmax(220px,320px) minmax(0,1fr)' : 'minmax(180px,280px) minmax(0,1fr)'};gap:0;align-items:stretch;">
          <div style="display:flex;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at top left,rgba(14,165,233,0.14),transparent 36%),linear-gradient(180deg,#f8fbfd 0%,#eef2f7 100%);text-align:center;">
            <img src="${htmlEscape(heroImage)}" alt="${htmlEscape(isHome ? 'Pacific Coast logo' : `${page.title} hero image`)}" style="width:100%;max-width:${isHome ? '190px' : '220px'};height:auto;display:inline-block;" />
          </div>
          <div style="padding:18px 20px;">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#0369a1;margin:0 0 8px 0;">${htmlEscape(isHome ? 'SharePoint clinical reference portal' : 'Pacific Coast SLP module')}</div>
            <h1 style="margin:0 0 8px 0;font-size:${isHome ? '34px' : '30px'};line-height:1.1;color:#0f172a;">${htmlEscape(isHome ? 'Pacific Coast SLP Portal' : page.title)}</h1>
            <p style="margin:0 0 10px 0;color:#475569;font-size:14px;line-height:1.65;">${htmlEscape(isHome ? 'Minimalist, dense launch point for clinical references, reviewed sources, and non-PHI workflow scaffolds. The production app remains SPFx pending.' : page.summary)}</p>
            <div style="margin:0 0 10px 0;">
              <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#e0f2fe;color:#0c4a6e;font-size:10px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SharePoint-native bridge</span>
              <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#f0fdf4;color:#166534;font-size:10px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">Non-PHI</span>
              <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:10px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SPFx pending</span>
            </div>
            <div>${renderCanvasActionPills(isHome ? homeActions : pageActions)}</div>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:0 0 16px 0;">
        <div style="border:1px solid #dbe5ee;border-radius:20px;padding:14px;background:#ffffff;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#1d4ed8;margin:0 0 6px 0;">Production path</div><div style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">PHI-minimized SPFx shell</div><div style="color:#64748b;font-size:13px;line-height:1.55;">Single Part App Page remains the production endpoint for patient-adjacent interactive workflows.</div></div>
        <div style="border:1px solid #dbe5ee;border-radius:20px;padding:14px;background:#ffffff;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#0891b2;margin:0 0 6px 0;">Bridge purpose</div><div style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">Dense reference and resource layer</div><div style="color:#64748b;font-size:13px;line-height:1.55;">Optimized for findability, fast scanning, and high-signal links while App Catalog deployment remains blocked.</div></div>
        <div style="border:1px solid #dbe5ee;border-radius:20px;padding:14px;background:#ffffff;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#166534;margin:0 0 6px 0;">Clinical boundary</div><div style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">Reference now, chart elsewhere</div><div style="color:#64748b;font-size:13px;line-height:1.55;">No patient-specific data entry, no durable resident artifacts, and no hidden workflow persistence.</div></div>
      </div>
      <div style="border:1px solid #f7d78c;border-radius:22px;background:linear-gradient(135deg,#fffdf3 0%,#fffbeb 100%);padding:15px 16px;margin:0 0 16px 0;">
        <div style="font-size:26px;font-weight:900;line-height:1.15;color:#78350f;margin:0 0 6px 0;">PHI guardrails</div>
        <div style="color:#92400e;font-size:13px;line-height:1.6;">No patient tracker, resident list, identifiers, or PHI fields belong on this bridge page. Do not paste patient-specific notes, evaluation text, recordings, or treatment data into SharePoint page content.</div>
      </div>
      ${isHome ? `
        <div style="margin:0 0 16px 0;">
          <div style="font-size:26px;font-weight:900;line-height:1.15;color:#0f172a;margin:0 0 6px 0;">Portal map</div>
          <div style="color:#64748b;font-size:13px;line-height:1.55;margin:0 0 10px 0;">Task-first navigation aligned to clinician browsing, workflow scaffolds, knowledge surfaces, and governance.</div>
          ${renderCanvasCardGrid(homeGroupCards)}
        </div>
      ` : ''}
      ${sectionCards.length ? `
        <div style="margin:0 0 16px 0;">
          <div style="font-size:26px;font-weight:900;line-height:1.15;color:#0f172a;margin:0 0 6px 0;">${htmlEscape(isHome ? 'Daily-use workflow' : 'Bridge status')}</div>
          <div style="color:#64748b;font-size:13px;line-height:1.55;margin:0 0 10px 0;">${htmlEscape(isHome ? 'A compact operating path that keeps the bridge safe and clinically useful.' : 'Mapped from the local portal while interactive workflow remains SPFx pending.')}</div>
          ${renderCanvasCardGrid(sectionCards)}
        </div>
      ` : ''}
      <div style="margin:0 0 16px 0;">
        <div style="font-size:26px;font-weight:900;line-height:1.15;color:#0f172a;margin:0 0 6px 0;">Generalized workflow surfaces</div>
        <div style="color:#64748b;font-size:13px;line-height:1.55;margin:0 0 10px 0;">High-utility non-PHI launch surfaces mapped from the local portal.</div>
        ${renderCanvasCardGrid(workflowCards.length ? workflowCards : [{
          eyebrow: 'Reference',
          title: isHome ? 'Workflow launch layer' : 'Reference launch layer',
          text: isHome ? 'Open high-use modules, workflow pages, and knowledge destinations before completing chart work in approved systems.' : 'Use this page to frame review, treatment planning, and source coordination without entering resident identifiers.'
        }])}
      </div>
      <div style="margin:0 0 16px 0;">
        <div style="font-size:26px;font-weight:900;line-height:1.15;color:#0f172a;margin:0 0 6px 0;">Template-mode workflow shells</div>
        <div style="color:#64748b;font-size:13px;line-height:1.55;margin:0 0 10px 0;">Copy-ready structures that stay generalized until finalized in approved clinical systems.</div>
        ${renderCanvasCardGrid(templateCards.length ? templateCards : [{
          eyebrow: 'Workflow template',
          title: isHome ? 'Generalized template workflow' : 'Generalized template shell',
          text: 'Keep impairment framing, skilled-service language, goals, and carryover prompts generalized until the approved record is open.'
        }])}
      </div>
      ${referenceCards.length ? `
        <div style="margin:0 0 16px 0;">
          <div style="font-size:26px;font-weight:900;line-height:1.15;color:#0f172a;margin:0 0 6px 0;">Authoritative references</div>
          <div style="color:#64748b;font-size:13px;line-height:1.55;margin:0 0 10px 0;">ASHA, CMS, Medicare.gov, Microsoft Learn, and approved SharePoint sources.</div>
          ${renderCanvasCardGrid(referenceCards)}
        </div>
      ` : ''}
      <div style="border:1px solid #dbe5ee;border-radius:20px;padding:14px 16px;background:#ffffff;">
        <div style="font-size:24px;font-weight:900;line-height:1.15;color:#0f172a;margin:0 0 6px 0;">Production note</div>
        <div style="color:#64748b;font-size:13px;line-height:1.6;">This page is a SharePoint-native bridge shaped around findability, task visibility, and non-PHI reference use. The production app remains the PHI-minimized SPFx portal package, so interactive workflow behavior is SPFx pending.</div>
      </div>
    </div>
  `.replace(/\n\s+/g, '\n').trim();
}

function renderFeatureCards(cards = []) {
  if (!cards.length) return '';
  const content = cards.map((card) => `
    <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px 18px 16px 18px;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 18px 38px rgba(15,23,42,0.06);">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:0 0 10px 0;">
        <h3 style="margin:0;font-size:18px;line-height:1.3;color:#0f172a;">${htmlEscape(card.title)}</h3>
        <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#e0f2fe;color:#0c4a6e;font-size:11px;font-weight:800;text-transform:uppercase;white-space:nowrap;">Reference</span>
      </div>
      <p style="margin:0 0 12px 0;color:#475569;font-size:14px;line-height:1.7;">${htmlEscape(card.description || card.text || '')}</p>
      <div>${(card.chips || []).map((chip) => `<span style="display:inline-flex;align-items:center;margin:0 8px 8px 0;padding:5px 10px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.03em;">${htmlEscape(chip)}</span>`).join('')}</div>
    </div>
  `).join('');
  return `
    <section style="margin:0 0 28px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Generalized workflow surfaces</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">High-utility non-PHI launch surfaces mapped from the local portal.</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;">${content}</div>
    </section>
  `;
}

function renderTemplateGroups(groups = []) {
  if (!groups.length) return '';
  return `
    <section style="margin:0 0 28px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Template-mode workflow shells</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">Copy-ready structures that stay generalized until finalized in approved clinical systems.</p>
        </div>
      </div>
      ${groups.map((group) => `
        <div style="margin:0 0 18px 0;">
          <h3 style="margin:0 0 12px 0;font-size:20px;line-height:1.3;color:#0f172a;">${htmlEscape(group.heading || group.title || 'Workflow template')}</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;">
            ${(group.items || []).map((item) => typeof item === 'string' ? `
              <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px;background:#ffffff;box-shadow:0 14px 30px rgba(15,23,42,0.05);">
                <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">${htmlEscape(item)}</p>
              </div>
            ` : `
              <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px;background:#ffffff;box-shadow:0 14px 30px rgba(15,23,42,0.05);">
                <h4 style="margin:0 0 12px 0;font-size:16px;line-height:1.4;color:#0f172a;">${htmlEscape(item.title)}</h4>
                <ol style="margin:0;padding-left:18px;color:#475569;font-size:14px;line-height:1.7;">${(item.lines || []).map((line) => `<li style="margin:0 0 9px 0;">${htmlEscape(line)}</li>`).join('')}</ol>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </section>
  `;
}

function renderSectionCards(sections = []) {
  return sections.map((section) => `
    <section style="margin:0 0 24px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 12px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">${htmlEscape(section.heading)}</h2>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">
        ${section.bullets.map((item) => `
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 12px 26px rgba(15,23,42,0.05);">
            <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">${htmlEscape(item)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function renderReferenceCards(links = []) {
  const cards = links.map((href) => {
    const meta = getLinkMeta(href);
    return `
      <a href="${htmlEscape(href)}" style="display:block;border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;text-decoration:none;box-shadow:0 12px 24px rgba(15,23,42,0.05);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 8px 0;">
          <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#eef6ff;color:#1d4ed8;font-size:11px;font-weight:800;text-transform:uppercase;">${htmlEscape(meta.domain)}</span>
          <span style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#f8fafc;color:#475569;font-size:11px;font-weight:800;text-transform:uppercase;">Open</span>
        </div>
        <div style="font-size:16px;line-height:1.4;font-weight:800;color:#0f172a;margin:0 0 8px 0;">${htmlEscape(meta.label)}</div>
        <div style="color:#64748b;font-size:13px;line-height:1.6;word-break:break-word;">${htmlEscape(href)}</div>
      </a>
    `;
  }).join('');
  return `
    <section style="margin:0 0 28px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Authoritative references</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">ASHA, CMS, Medicare.gov, Microsoft Learn, and approved SharePoint sources.</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;">${cards}</div>
    </section>
  `;
}

function renderRelatedPageCards(currentFileName, isHome) {
  const currentItem = pages.find((item) => item.fileName === currentFileName);
  const currentGroup = currentItem ? getPortalGroupKey(currentItem) : null;
  const relatedItems = isHome
    ? pages.filter((item) => item.fileName !== currentFileName)
    : [
        ...pages.filter((item) => item.fileName !== currentFileName && currentGroup && getPortalGroupKey(item) === currentGroup),
        ...pages.filter((item) => item.fileName !== currentFileName && (!currentGroup || getPortalGroupKey(item) !== currentGroup))
      ].slice(0, 6);

  return `
    <section style="margin:0 0 28px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Related SLP pages</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">Browse the nearest clinical, workflow, and governance destinations.</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
        ${relatedItems.map((item) => `
          <a href="/sites/PacificCoast_SLP/SitePages/${htmlEscape(item.fileName)}" style="display:block;border:1px solid #dbe5ee;border-radius:20px;padding:15px 16px;background:#ffffff;text-decoration:none;box-shadow:0 10px 22px rgba(15,23,42,0.05);">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 6px 0;">
              <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#ecfeff;color:#155e75;font-size:11px;font-weight:800;text-transform:uppercase;">Module</span>
              <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:11px;font-weight:800;text-transform:uppercase;">SPFx pending</span>
            </div>
            <div style="font-size:15px;line-height:1.4;font-weight:800;color:#0f172a;margin:0 0 8px 0;">${htmlEscape(item.title)}</div>
            <div style="color:#64748b;font-size:13px;line-height:1.6;">${htmlEscape(item.summary)}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderUtilityBands(isHome) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:0 0 20px 0;">
      <div style="border:1px solid #dbe5ee;border-radius:24px;padding:16px 18px;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 16px 32px rgba(15,23,42,0.05);">
        <div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#eef6ff;color:#1d4ed8;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">Production path</div>
        <div style="font-size:18px;line-height:1.35;font-weight:800;color:#0f172a;margin:0 0 6px 0;">PHI-minimized SPFx shell</div>
        <div style="color:#64748b;font-size:14px;line-height:1.65;">Single Part App Page remains the production endpoint for patient-adjacent interactive workflows.</div>
      </div>
      <div style="border:1px solid #dbe5ee;border-radius:24px;padding:16px 18px;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 16px 32px rgba(15,23,42,0.05);">
        <div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#ecfeff;color:#155e75;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">Bridge purpose</div>
        <div style="font-size:18px;line-height:1.35;font-weight:800;color:#0f172a;margin:0 0 6px 0;">Dense reference and resource layer</div>
        <div style="color:#64748b;font-size:14px;line-height:1.65;">Optimized for findability, fast scanning, and high-signal links while App Catalog deployment remains blocked.</div>
      </div>
      <div style="border:1px solid #dbe5ee;border-radius:24px;padding:16px 18px;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 16px 32px rgba(15,23,42,0.05);">
        <div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#f0fdf4;color:#166534;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">Clinical boundary</div>
        <div style="font-size:18px;line-height:1.35;font-weight:800;color:#0f172a;margin:0 0 6px 0;">Reference now, chart elsewhere</div>
        <div style="color:#64748b;font-size:14px;line-height:1.65;">No patient-specific data entry, no durable resident artifacts, and no hidden workflow persistence.</div>
      </div>
      ${isHome ? `
        <div style="border:1px solid #dbe5ee;border-radius:24px;padding:16px 18px;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 16px 32px rgba(15,23,42,0.05);">
          <div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">Information design</div>
          <div style="font-size:18px;line-height:1.35;font-weight:800;color:#0f172a;margin:0 0 6px 0;">Minimalist and dense</div>
          <div style="color:#64748b;font-size:14px;line-height:1.65;">Aligned to Microsoft guidance on findability, clear labels, and prioritizing common tasks first.</div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderPageHtml(page) {
  const heroImage = imageUrlByKey[page.imageKey] || imageUrlByKey.background;
  const isHome = page.fileName === 'SLP-Portal.aspx';
  const portalGroups = buildPortalGroups();
  const homeActions = [
    { label: 'Open Dysphagia', href: '/sites/PacificCoast_SLP/SitePages/SLP-Dysphagia.aspx', tone: '#0f6cbd' },
    { label: 'Open Aphasia', href: '/sites/PacificCoast_SLP/SitePages/SLP-Aphasia.aspx', tone: '#0891b2' },
    { label: 'Medicare and Compliance', href: '/sites/PacificCoast_SLP/SitePages/SLP-Medicare-Compliance.aspx', tone: '#0f766e' },
    { label: 'Documentation Studio', href: '/sites/PacificCoast_SLP/SitePages/SLP-Documentation-Studio.aspx', tone: '#1d4ed8' },
    { label: 'Knowledge Index', href: '/sites/PacificCoast_SLP/SitePages/SLP-Knowledge-Source-Index.aspx', tone: '#0f172a' }
  ];
  const homeSectionActions = portalGroups.map((group, index) => ({
    label: group.label,
    href: `#${group.id}`,
    tone: ['#0f172a', '#0f6cbd', '#0891b2', '#155e75'][index % 4]
  }));
  const pageActions = [
    { label: 'Portal home', href: '/sites/PacificCoast_SLP/SitePages/SLP-Portal.aspx', tone: '#0f172a' },
    { label: 'Knowledge index', href: '/sites/PacificCoast_SLP/SitePages/SLP-Knowledge-Source-Index.aspx', tone: '#0f6cbd' },
    { label: 'Clinical library', href: '/sites/PacificCoast_SLP/SitePages/SLP-Clinical-Library.aspx', tone: '#0891b2' },
    { label: 'SPFx handoff', href: '/sites/PacificCoast_SLP/SitePages/SLP-SPFx-Production-Handoff.aspx', tone: '#155e75' }
  ];

  const serviceMap = `
    <section style="margin:0 0 26px 0;">
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">SLP service map</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">Organized around how clinicians browse, decide, and act in the portal.</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;">
        <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px;background:#ffffff;box-shadow:0 16px 32px rgba(15,23,42,0.05);"><h3 style="margin:0 0 8px 0;font-size:18px;color:#0f172a;">Swallowing and airway</h3><p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">Dysphagia, instrumentals, IDDSI, trach and vent, meds/labs, and safety escalation.</p></div>
        <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px;background:#ffffff;box-shadow:0 16px 32px rgba(15,23,42,0.05);"><h3 style="margin:0 0 8px 0;font-size:18px;color:#0f172a;">Communication and cognition</h3><p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">Aphasia, AAC, cognition, motor speech, voice, anatomy, reference, and outcomes.</p></div>
        <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px;background:#ffffff;box-shadow:0 16px 32px rgba(15,23,42,0.05);"><h3 style="margin:0 0 8px 0;font-size:18px;color:#0f172a;">Documentation and compliance</h3><p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">Documentation, coding, Medicare, audit framing, compliance center, and source governance.</p></div>
        <div style="border:1px solid #dbe5ee;border-radius:24px;padding:18px;background:#ffffff;box-shadow:0 16px 32px rgba(15,23,42,0.05);"><h3 style="margin:0 0 8px 0;font-size:18px;color:#0f172a;">Template-mode workflows</h3><p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">Notes, goals, therapy templates, handouts, Copilot playbooks, and reusable support shells.</p></div>
      </div>
    </section>
  `;

  const homepageOnly = isHome ? `
    <section style="margin:0 0 28px 0;">
      <div style="border:1px solid #dbe5ee;border-radius:28px;padding:20px 22px;background:linear-gradient(135deg,#eff6ff 0%,#f8fafc 38%,#ffffff 100%);box-shadow:0 24px 42px rgba(15,23,42,0.06);margin:0 0 20px 0;">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 style="margin:0 0 8px 0;font-size:28px;line-height:1.2;color:#0f172a;">Launch actions</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;max-width:760px;">Prioritize common tasks first: open a core module, move into generalized workflow pages, then finish patient-specific work in the chart.</p>
          </div>
        </div>
        <div style="margin:18px 0 0 0;">${renderActionPills(homeActions)}</div>
      </div>
      <section style="margin:0 0 22px 0;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;">
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Portal coverage</div><div style="font-size:24px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">${pages.length}</div><div style="color:#64748b;font-size:13px;line-height:1.6;">Validated SharePoint bridge pages in the live safe migration set.</div></div>
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Navigation model</div><div style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">Task first</div><div style="color:#64748b;font-size:13px;line-height:1.6;">Grouped by clinician tasks, workflow shells, knowledge, and governance.</div></div>
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Workflow mode</div><div style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">Reference and template</div><div style="color:#64748b;font-size:13px;line-height:1.6;">Generalized workflow shells now; patient-specific interaction stays out of the bridge.</div></div>
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Next production lift</div><div style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 6px 0;">SPFx shell</div><div style="color:#64748b;font-size:13px;line-height:1.6;">The interactive app path remains the PHI-minimized SPFx package.</div></div>
        </div>
      </section>
      <section style="margin:0 0 22px 0;">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;flex-wrap:wrap;">
          <div>
            <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Portal navigation</h2>
            <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">Compact jump menu aligned to Microsoft guidance on clear, scannable, task-oriented labels.</p>
          </div>
        </div>
        <div style="margin:0;">${renderActionPills(homeSectionActions)}</div>
      </section>
      ${serviceMap}
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
        <div>
          <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Portal map</h2>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">A denser index of modules, studios, references, and governance surfaces grouped by clinician intent.</p>
        </div>
      </div>
      ${renderPortalMapGroups()}
      <section style="margin:0 0 22px 0;">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin:0 0 14px 0;">
          <div>
            <h2 style="margin:0 0 6px 0;font-size:26px;line-height:1.2;color:#0f172a;">Daily-use workflow</h2>
            <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">A minimal operating path that matches the portal’s safe boundary.</p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;">
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">1</div><p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">Start with the relevant clinical module or Medicare and compliance reference.</p></div>
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">2</div><p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">Use authoritative references and generalized workflow pages to frame treatment and documentation.</p></div>
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">3</div><p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">Keep patient-specific work in approved clinical systems until the SPFx shell is live.</p></div>
          <div style="border:1px solid #dbe5ee;border-radius:22px;padding:16px;background:#ffffff;box-shadow:0 12px 24px rgba(15,23,42,0.05);"><div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 0 10px 0;">4</div><p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">Use the SPFx handoff and source index pages to prepare the next production lift.</p></div>
        </div>
      </section>
    </section>
  ` : `
    <section style="margin:0 0 24px 0;">
      <div style="border:1px solid #dbe5ee;border-radius:26px;padding:18px 20px;background:linear-gradient(135deg,#eff6ff 0%,#f8fafc 40%,#ffffff 100%);box-shadow:0 20px 36px rgba(15,23,42,0.05);">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 style="margin:0 0 8px 0;font-size:24px;line-height:1.2;color:#0f172a;">Launch actions</h2>
            <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;max-width:720px;">Move between the portal shell, source governance, and supporting reference hubs without losing the current module context.</p>
          </div>
        </div>
        <div style="margin:16px 0 0 0;">${renderActionPills(pageActions)}</div>
      </div>
    </section>
  `;

  const sectionCards = renderSectionCards(page.sections);
  const featureCards = renderFeatureCards(page.featureCards);
  const templateGroups = renderTemplateGroups(page.templateGroups);
  const relatedCards = isHome ? '' : renderRelatedPageCards(page.fileName, isHome);
  const referenceCards = renderReferenceCards(page.links);
  const hero = isHome ? `
    <section style="border:1px solid #dbe5ee;border-radius:32px;overflow:hidden;background:linear-gradient(135deg,#f8fbfd 0%,#ffffff 42%,#eef6ff 100%);margin:0 0 24px 0;box-shadow:0 28px 54px rgba(15,23,42,0.08);">
      <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,420px);gap:28px;align-items:center;padding:28px 32px;">
        <div>
          <p style="margin:0 0 10px 0;color:#0369a1;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">SharePoint clinical reference portal</p>
          <h1 style="margin:0 0 12px 0;font-size:40px;line-height:1.08;color:#0f172a;">Pacific Coast SLP Portal</h1>
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.75;color:#475569;max-width:760px;">Minimalist, dense launch point for SLP clinical references, Medicare guidance, reviewed source libraries, and non-PHI workflow scaffolds while the full SPFx experience remains on the production track. The layout is intentionally task-first so clinicians can scan, decide, and move without hunting.</p>
          <div style="margin:0 0 14px 0;">${renderActionPills(homeActions)}</div>
          <div>
            <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#e0f2fe;color:#0c4a6e;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SharePoint-native bridge</span>
            <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#f0fdf4;color:#166534;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">Non-PHI</span>
            <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SPFx production pending</span>
          </div>
        </div>
        <div style="display:flex;justify-content:center;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:min(100%,340px);padding:18px 20px;border-radius:28px;background:#ffffff;box-shadow:0 22px 44px rgba(15,23,42,0.08);">
            <img src="${htmlEscape(heroImage)}" alt="Pacific Coast logo" style="width:100%;max-width:210px;height:auto;display:inline-block;" />
          </div>
        </div>
      </div>
    </section>
  ` : `
    <section style="border:1px solid #dbe5ee;border-radius:30px;overflow:hidden;background:linear-gradient(135deg,#f8fbfd 0%,#ffffff 42%,#eef6ff 100%);margin:0 0 24px 0;box-shadow:0 24px 48px rgba(15,23,42,0.07);">
      <div style="display:grid;grid-template-columns:minmax(220px,360px) minmax(0,1fr);gap:0;align-items:stretch;">
        <div style="display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top left,rgba(14,165,233,0.14),transparent 36%),linear-gradient(180deg,#f8fbfd 0%,#eef2f7 100%);">
          <img src="${htmlEscape(heroImage)}" alt="${htmlEscape(page.title)} hero image" style="width:100%;max-width:280px;height:auto;display:inline-block;" />
        </div>
        <div style="padding:24px 26px;">
          <p style="margin:0 0 10px 0;color:#0369a1;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Pacific Coast SLP module</p>
          <h1 style="margin:0 0 10px 0;font-size:34px;line-height:1.12;color:#0f172a;">${htmlEscape(page.title)}</h1>
          <p style="margin:0 0 15px 0;font-size:15px;line-height:1.75;color:#475569;">${htmlEscape(page.summary)}</p>
          <div style="margin:0 0 14px 0;">
            <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#e0f2fe;color:#0c4a6e;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SharePoint-native bridge</span>
            <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#f0fdf4;color:#166534;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">Non-PHI</span>
            <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:11px;font-weight:800;text-transform:uppercase;margin:0 8px 8px 0;">SPFx production pending</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;">
            <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Mode</div><div style="font-size:15px;font-weight:800;color:#0f172a;">Reference and template</div></div>
            <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Storage</div><div style="font-size:15px;font-weight:800;color:#0f172a;">No durable PHI</div></div>
            <div style="border:1px solid #dbe5ee;border-radius:18px;padding:12px;background:#ffffff;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#64748b;margin:0 0 6px 0;">Next lift</div><div style="font-size:15px;font-weight:800;color:#0f172a;">SPFx interactive shell</div></div>
          </div>
        </div>
      </div>
    </section>
  `;

  return `
    <div style="max-width:1500px;margin:0 auto;padding:4px 0 24px 0;color:#0f172a;">
      ${hero}
      ${renderUtilityBands(isHome)}
      <div style="border:1px solid #f7d78c;border-radius:26px;background:linear-gradient(135deg,#fffdf3 0%,#fffbeb 100%);padding:18px 20px;margin:0 0 24px 0;box-shadow:0 18px 36px rgba(146,64,14,0.05);">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 style="margin:0 0 8px 0;font-size:26px;line-height:1.2;color:#78350f;">PHI guardrails</h2>
            <p style="margin:0;color:#92400e;font-size:14px;line-height:1.7;max-width:780px;">No patient tracker, resident list, identifiers, or PHI fields belong on this bridge page. Do not paste patient-specific notes, evaluation text, recordings, or treatment data into SharePoint page content.</p>
          </div>
          <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#ffffff;color:#92400e;font-size:11px;font-weight:800;text-transform:uppercase;">Reference only</span>
        </div>
      </div>
      ${homepageOnly}
      ${sectionCards}
      ${featureCards}
      ${templateGroups}
      ${relatedCards}
      ${referenceCards}
      <section style="border:1px solid #dbe5ee;border-radius:24px;padding:18px 20px;background:#ffffff;box-shadow:0 16px 32px rgba(15,23,42,0.05);">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 style="margin:0 0 8px 0;font-size:24px;line-height:1.2;color:#0f172a;">Production note</h2>
            <p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;max-width:860px;">This page is a SharePoint-native bridge shaped around findability, task visibility, and non-PHI reference use. The production app remains the PHI-minimized SPFx portal package, so interactive workflow behavior is SPFx pending.</p>
          </div>
          <a href="/sites/PacificCoast_SLP/SitePages/SLP-SPFx-Production-Handoff.aspx" style="display:inline-flex;align-items:center;padding:11px 15px;border-radius:999px;background:#0f172a;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;">Open SPFx handoff</a>
        </div>
      </section>
    </div>
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
    innerHTML: renderCanvasHtml(page)
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
