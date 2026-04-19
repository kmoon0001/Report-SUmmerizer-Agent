CONTENT FROM pacific coast-slp-data.ts

import { 
  FileText, 
  ClipboardCheck, 
  Stethoscope, 
  Activity, 
  Scale, 
  Brain, 
  Wind, 
  Utensils, 
  TrendingUp, 
  FileCheck,
  BookOpen,
  AlertCircle,
  Monitor,
  MessageCircle,
  MessageSquare,
  Users,
  Mic
} from 'lucide-react';

export interface PostetteSection {
  title: string;
  content: string | string[] | { [key: string]: string | string[] };
  type?: 'text' | 'list' | 'table' | 'bullets' | 'alert';
}

export interface Postette {
  id: string;
  title: string;
  category: 'Evaluation' | 'Documentation' | 'Clinical' | 'Billing' | 'Compliance' | 'Infographics' | 'Program Development';
  icon: any;
  image?: string;
  reference?: string;
  pdfUrl?: string;
  sections: PostetteSection[];
}

export const ENSIGN_SLP_CORNER_DATA: Postette[] = [
  {
    id: 'infographic-1',
    title: 'Cognitive Communication Basics',
    category: 'Infographics',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    sections: [
      {
        title: 'Overview',
        type: 'text',
        content: 'A quick visual guide to cognitive communication disorders.'
      }
    ]
  },
  {
    id: 'rehab-eval',
    title: 'The Rehab Evaluation',
    category: 'Evaluation',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    pdfUrl: 'https://www.medicare.gov/coverage/outpatient-therapy-services',
    reference: 'Rehabilitation P&P Policy 220; Medicare Benefit Manual Chapters 8 & 15',
    sections: [
      {
        title: 'Core Objective',
        type: 'text',
        content: 'Capture how the patient is performing certain activities, skill sets, and tasks at the time of that evaluative treatment encounter. Focus on deficits that will be addressed in treatment rather than collecting data that does not tie back to functional intervention.'
      },
      {
        title: 'Establishing Baselines',
        type: 'bullets',
        content: [
          'Gather objective data via direct observation of functional tasks.',
          'Complete standardized assessments; include scores and their clinical meaning.',
          'Obtain/review all patient/family reports and medical records.',
          'Establish functional deficits as they relate to typical patient activities.'
        ]
      },
      {
        title: 'Prior Level of Function (PLOF)',
        type: 'text',
        content: 'Functional status prior to the onset of the spell of illness. Discipline specific. Indicate level of independence (e.g., independent with high level ADLs, tolerated regular texture with thin liquids). Demonstrates medical necessity and sets expectations.'
      },
      {
        title: 'Assessment Categories',
        type: 'bullets',
        content: [
          'Aerobic Capacity & Endurance: Vital signs pre/post activity.',
          'Anthropometric Characteristics: Body composition, edema.',
          'Cognition, Attention, Arousal: Consciousness, orientation, command following.',
          'Cranial & Peripheral Nerve Integrity: Response to stimuli, sensation testing.',
          'Pain: Scale used, location, exacerbating/relieving factors.',
          'Assistive & Adaptive Devices: Alignment, fit, safety, balance.',
          'Gait & Balance: Static/dynamic balance, gait patterns.',
          'ROM & MMT: Specific measurements (avoid WFL/WNL), flexibility.',
          'Wound: Type, size, depth, signs of infection.',
          'Self-Care: Ability to perform ADLs with/without devices.',
          'Communication/Cognition: Auditory comp, verbal expression, pragmatics, problem solving.',
          'Swallowing: Oral/pharyngeal/laryngeal function, textures, MBSS results.',
          'Home Environment: Living situation, stairs, available assistance.'
        ]
      }
    ]
  },
  {
    id: 'rehab-screen',
    title: 'Rehab Screen / Consultation',
    category: 'Evaluation',
    icon: ClipboardCheck,
    reference: 'Rehabilitation P&P Policy 200; Medicare Benefit Manual Chapters 8 & 15',
    sections: [
      {
        title: 'Purpose',
        type: 'text',
        content: 'Determine the need for a skilled evaluation and make an impact on a residentâ€™s quality of life. Requests can come from MD, NPP, nursing, or family.'
      },
      {
        title: 'The Do\'s',
        type: 'bullets',
        content: [
          'Brief chart review.',
          'Verbal consultation with referring party/staff/resident.',
          'Brief interview to determine prior functional level.',
          'Observing caregiver interaction (if safe/appropriate).'
        ]
      },
      {
        title: 'The Don\'ts',
        type: 'alert',
        content: 'A screen does NOT include "hands on" assessment or making recommendations of care (diet changes, equipment, exercises). These require a skilled assessment/evaluation.'
      },
      {
        title: 'Documentation Requirements',
        type: 'bullets',
        content: [
          'Brief history relative to current concern.',
          'Identified changes in PLOF.',
          'Who requested the consult and why.',
          'Determination of whether an evaluation is needed.'
        ]
      }
    ]
  },
  {
    id: 'dx-selection',
    title: 'Medical & Treatment Diagnoses Selection',
    category: 'Billing',
    icon: FileCheck,
    reference: 'Medicare Benefit Policy Manual, Chapters 8 & 15',
    sections: [
      {
        title: 'Medicare Part A',
        type: 'bullets',
        content: [
          'Medical ICD-10 is NOT required on therapy evaluations if supportive codes exist in the medical record.',
          'Evaluating Therapist selects treatment codes for both Medical and Treatment code areas.',
          'Narrative description of all relevant medical diagnoses must be included in the evaluation.'
        ]
      },
      {
        title: 'Medicare Part B',
        type: 'bullets',
        content: [
          'Evaluating therapist drives selection of BOTH medical and treatment diagnoses.',
          'Medical code must tie into the treatments provided and make sense with the POC.',
          'Avoid self-resolving codes (e.g., UTI) to support therapy intervention.'
        ]
      },
      {
        title: 'Treatment DX Examples',
        type: 'bullets',
        content: [
          'PT: Abnormality of gait.',
          'OT: Hemiparesis.',
          'SLP: Dysphagia.'
        ]
      }
    ]
  },
  {
    id: 'justification-skilled',
    title: 'Justification of Skilled Services',
    category: 'Documentation',
    icon: Scale,
    reference: 'Medicare Benefit Manual Chapters 8 & 15, ASHA, AOTA, APTA',
    sections: [
      {
        title: 'Core Questions',
        type: 'bullets',
        content: [
          'Why did the patient require professional treatment/education?',
          'What specialized treatment did the clinician actually provide?',
          'How did the patient benefit from the specialized knowledge?'
        ]
      },
      {
        title: 'Reasonable & Necessary',
        type: 'bullets',
        content: [
          'Reasonable: Objective relates realistically to potential and achievable timeframe.',
          'Necessary: Elicit positive medical/functional improvement or prevent adverse impact.'
        ]
      },
      {
        title: 'Material Impact',
        type: 'bullets',
        content: [
          'Assessment and analysis of performance/adjustments.',
          'Prevention of decline or deterioration.',
          'Training others to facilitate improvement.',
          'Decreased medical risk (vitals, fall risk, aspiration).'
        ]
      }
    ]
  },
  {
    id: 'plan-of-care',
    title: 'The Plan of Care (POC)',
    category: 'Documentation',
    icon: FileText,
    reference: 'Rehabilitation P&P Policy 220 & 225; Medicare Benefit Manual Chapters 8 & 15',
    sections: [
      {
        title: 'Technical Considerations',
        type: 'bullets',
        content: [
          'Must be established, committed to record, and signed by clinician.',
          'Must be completed PRIOR to treatment being performed/logged.',
          'UPOC required for recertification or significant changes (medical condition, new DX, LTG changes).',
          'Physician signatures required within 30 days.'
        ]
      },
      {
        title: 'Focus of Intervention',
        type: 'bullets',
        content: [
          'Restoration: Potential for learning/restoring functional abilities.',
          'Compensation: Strategy training, cueing, compensatory techniques.',
          'Adaptation: Caregiver learning, environment modification.',
          'Maintenance: Prevent further decline, maintain safety/dignity.'
        ]
      },
      {
        title: 'Goal Setting',
        type: 'bullets',
        content: [
          'Patient driven, tied to functional limitations, measurable.',
          'LTG: Functional level expected at discharge (usually 8-12 weeks).',
          'STG: Interim achievements (1-4 weeks, max 30 days).'
        ]
      }
    ]
  },
  {
    id: 'respiratory-rehab',
    title: 'Respiratory Rehab: SLP Role',
    category: 'Clinical',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
    pdfUrl: 'https://www.emst150.com/',
    reference: 'Sapienza, Troche, Pitts, Davenport, 2011',
    sections: [
      {
        title: 'Why SLP?',
        type: 'bullets',
        content: [
          'Successful phonation depends on effective respiration.',
          'Uncoordinated breathing increases aspiration risk.',
          'Compromised breath support limits cough effectiveness.'
        ]
      },
      {
        title: 'Assessments',
        type: 'bullets',
        content: [
          'Peak Flow Meter (PEF).',
          'Length of utterance (syllables between breaths).',
          'Sustained phonation /ah/.',
          'Breathing pattern (Shoulders vs Diaphragm).'
        ]
      },
      {
        title: 'Intervention (RMST)',
        type: 'bullets',
        content: [
          'IMST: Strengthen inspiratory muscles (diaphragm, intercostals).',
          'EMST: Strengthen expiratory muscles (abdominals).',
          'Goal: Improve swallow safety, airway protection, and voice.'
        ]
      },
      {
        title: 'Precautions',
        type: 'alert',
        content: 'Monitor O2 levels. If below 90%, cue for deep nasal inhalation or pursed lip breathing. Contraindications: Active hemoptysis, untreated pneumothorax, ICP > 20mmHg.'
      }
    ]
  },
  {
    id: 'ten-notes',
    title: 'Treatment Encounter Notes (TEN)',
    category: 'Documentation',
    icon: Activity,
    reference: 'Medicare Benefit Manual Chapters 8 & 15; Therapy P&P 230',
    sections: [
      {
        title: 'Minimum Components',
        type: 'bullets',
        content: [
          'Date of treatment.',
          'Identification of specific intervention/modality.',
          'Total timed code minutes and total treatment time.',
          'Signature and professional identification.'
        ]
      },
      {
        title: 'Narrative Support',
        type: 'bullets',
        content: [
          'Group Treatment: Ratio, rationale, patient response.',
          'Modalities: Parameters, time, skin check, objective results.',
          'Wound Care: Volume, infection signs, debridement details.',
          'Caregiver Training: Consent, clinical need, response.'
        ]
      },
      {
        title: 'TEN Tips',
        type: 'bullets',
        content: [
          'Avoid repetitive documentation.',
          'Document purpose of equipment vs brand name.',
          'Include skills of therapist to support minutes logged.'
        ]
      }
    ]
  },
  {
    id: 'maintenance-therapy',
    title: 'Maintenance Therapy',
    category: 'Compliance',
    icon: Scale,
    reference: 'Medicare Benefit Manual, Chap 15 section 220.2; Jimmo v. Sibelius',
    sections: [
      {
        title: 'Jimmo v. Sibelius',
        type: 'text',
        content: 'Coverage does NOT rest on an improvement standard. Services are covered if they are reasonable, necessary, and require the skills of a therapist to maintain function or slow deterioration.'
      },
      {
        title: 'Two Roles',
        type: 'bullets',
        content: [
          'Development: Designing a program for unskilled personnel (RNA/CNA) to carry out.',
          'Delivery: Ongoing skilled service provided by a qualified therapist.'
        ]
      },
      {
        title: 'Justification Examples',
        type: 'bullets',
        content: [
          'Unstable condition requiring continuous analysis.',
          'High risk for decline (cardiovascular fluctuations).',
          'Severe contractures requiring deep tissue release.',
          'Inconsistent swallow onset requiring SLP recreational feeding.'
        ]
      }
    ]
  },
  {
    id: 'pdpm-model',
    title: 'Patient Driven Payment Model (PDPM)',
    category: 'Billing',
    icon: TrendingUp,
    reference: 'Pacific Coast Services 2019; CMS PDPM Website',
    sections: [
      {
        title: 'Overview',
        type: 'text',
        content: 'Per-diem payment model based on clinical characteristics. Replaced RUG-IV on Oct 1, 2019.'
      },
      {
        title: 'SLP Component Drivers',
        type: 'bullets',
        content: [
          'Clinical Categories: Acute Neurologic vs Non-acute Neurologic.',
          'SLP Related Co-morbidities (Aphasia, CVA, Dysphagia, ALS, etc.).',
          'Cognitive Impairment (BIMS or CPS score).',
          'Presence of Swallowing Disorder or Mechanically Altered Diet.'
        ]
      },
      {
        title: 'Variable Per-Diem',
        type: 'bullets',
        content: [
          'NTA: Multiplied by 3 for days 1-3, then base rate.',
          'PT/OT: Drops 2% every 7 days after day 20.'
        ]
      },
      {
        title: 'Combined Limit',
        type: 'alert',
        content: 'Concurrent and group therapy is limited to 25% of total therapy minutes per discipline.'
      }
    ]
  },
  {
    id: 'cog-impaired-slp',
    title: 'Cognitively Impaired: SLP Considerations',
    category: 'Clinical',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    reference: 'Medicare Benefit Manual Chapters 8 & 15; ASHA Position Statements',
    sections: [
      {
        title: 'Intervention Focus',
        type: 'text',
        content: 'Problems in ability to perceive, attend, organize, remember, reason, and solve problems; executive or self-regulatory control.'
      },
      {
        title: 'Diagnostic Codes',
        type: 'bullets',
        content: [
          'R41.841: Cognitive Communication Deficit (Most descriptive).',
          'R48.8: Symbolic Dysfunction.'
        ]
      },
      {
        title: 'Evaluation Considerations',
        type: 'bullets',
        content: [
          'Standardized tests (SLUMS, Addenbrooke) are initial tools.',
          'Describe underlying strengths/weaknesses related to social/behavioral factors.',
          'Impact on quality of life and family/caregivers.'
        ]
      },
      {
        title: 'Skilled Interventions',
        type: 'bullets',
        content: [
          'Attention training, Memory/recall, Organization/Sequencing.',
          'Compensatory memory strategies, Spaced Retrieval.',
          'Caregiver training in compensatory strategies.'
        ]
      }
    ]
  },
  {
    id: 'progress-report',
    title: 'Progress Report Guidelines',
    category: 'Documentation',
    icon: Activity,
    reference: 'Rehabilitation Services P&P- Policy 235; Medicare Benefit Manuals Chapters 8 & 15',
    sections: [
      {
        title: 'Frequency',
        type: 'text',
        content: 'Minimum once every 10 treatment days. Must be written by a clinician (therapist), not an assistant.'
      },
      {
        title: 'Justification for Treatment',
        type: 'bullets',
        content: [
          'Rehabilitative: Potential to improve, maximum improvement not yet attained.',
          'Maintenance: Necessary to maintain/prevent slow deterioration; cannot be safely done by unskilled personnel.'
        ]
      },
      {
        title: 'Content Requirements',
        type: 'bullets',
        content: [
          'Assessment of progress toward each goal.',
          'Changes in level of assistance or assistive devices.',
          'Improvement in pain levels affecting function.',
          'Plan for continuing skilled intervention.'
        ]
      }
    ]
  },
  {
    id: 'dietary-refusals',
    title: 'Handling Dietary Refusals',
    category: 'Clinical',
    icon: Utensils,
    reference: 'State Practice Acts; MAC LCDs; CMS; ASHA',
    sections: [
      {
        title: 'Patient NOT on Caseload',
        type: 'bullets',
        content: [
          'Obtain evaluation orders/MBSS to determine safety of upgrade.',
          'SLP should never make recommendations if not on caseload.',
          'Contact Physician to discuss situation.'
        ]
      },
      {
        title: 'Patient ON Caseload',
        type: 'bullets',
        content: [
          'Meet as IDT to discuss options.',
          'Hold care plan meeting with patient/family to discuss risks.',
          'Document discussion and confirm patient choice.',
          'Explain current POC and timeframe for expected advancements.'
        ]
      },
      {
        title: 'Key Rule',
        type: 'alert',
        content: 'The facility cannot serve an advanced diet texture not prescribed. The SLP should never request a texture they don\'t recommend.'
      }
    ]
  },
  {
    id: 'discharge-summary',
    title: 'Discharge Summary',
    category: 'Documentation',
    icon: BookOpen,
    reference: 'Medicare Benefit Manuals Chapters 8 & 15; Therapy Policy 250',
    sections: [
      {
        title: 'Core Components',
        type: 'bullets',
        content: [
          'Diagnosis and functional deficits.',
          'Objective comparison of functional tasks (Baseline vs Discharge).',
          'Justification for services provided.',
          'Patient response and current level of function.',
          'Explanation for any goals not met.'
        ]
      },
      {
        title: 'Caregiver Training',
        type: 'text',
        content: 'Document specific recommendations or trainings provided to ensure continuity of care. Include summary of equipment provided or still needed.'
      },
      {
        title: 'Final Statement',
        type: 'text',
        content: 'Conclude with a brief statement of how skilled intervention has improved the patient\'s function and/or quality of life.'
      }
    ]
  },
  {
    id: 'cog-perf-96125',
    title: 'Cognitive Performance Assessment (96125)',
    category: 'Billing',
    icon: Brain,
    reference: 'Medicare Benefit Manual Chapters 8 & 15; ASHA; AOTA',
    sections: [
      {
        title: 'Code Definition',
        type: 'text',
        content: 'Standardized cognitive performance testing per hour. Includes face-to-face time interpreting results and preparing the report.'
      },
      {
        title: 'Requirements',
        type: 'bullets',
        content: [
          'Must be at least 31 minutes to report the first hour.',
          'Must use a standardized assessment (RIPA-G, CLQT, FLCI, SCCAN, FAVRES).',
          'Documentation must support necessity beyond initial evaluation.'
        ]
      },
      {
        title: 'Billing Notes',
        type: 'bullets',
        content: [
          'Medicare Part B: Clinicians may count interpretation/documentation time.',
          'Medicare Part A: Follow RAI manual (direct face-to-face time only). Non-MDS code.'
        ]
      }
    ]
  },
  {
    id: 'cog-vs-speech-codes',
    title: 'Cognitive vs Speech Treatment Codes',
    category: 'Billing',
    icon: Activity,
    sections: [
      {
        title: '97129 / 97130',
        type: 'bullets',
        content: [
          'Use when Expressive/Receptive Language is marked as INTACT.',
          'Focus on attention, memory, reasoning, executive function.',
          'Diagnoses are NOT degenerative (CVA, TBI, MCI).',
          'Log 97129 for first 15 mins, 97130 for subsequent 15 min increments.'
        ]
      },
      {
        title: '92507',
        type: 'bullets',
        content: [
          'Use when Expressive/Receptive Language is marked as IMPAIRED.',
          'Covers Cognitive-Communicative Deficits.',
          'Diagnoses ARE degenerative (Dementia, neurological diseases, cancer).',
          'Also used for Dysarthria or Voice Disorders.'
        ]
      },
      {
        title: 'CCI Edits',
        type: 'alert',
        content: 'Only log one code per day per CCI edits if patient has both voice/dysarthria and high level cognitive deficits.'
      }
    ]
  },
  {
    id: 'slums-exam',
    title: 'SLUMS Examination',
    category: 'Evaluation',
    icon: Brain,
    pdfUrl: 'https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/slums-exam.php',
    reference: 'Saint Louis University Mental Status Examination',
    sections: [
      {
        title: 'Items',
        type: 'bullets',
        content: [
          'Orientation (Day, Year, State).',
          'Memory (5 objects).',
          'Calculation ($100 - $3 - $20).',
          'Animal naming (1 minute).',
          'Digit span backwards.',
          'Clock drawing (Hour markers, Time).',
          'Shape identification (Triangle X, Largest shape).',
          'Story recall (Jill the stockbroker).'
        ]
      },
      {
        title: 'Scoring (High School Education)',
        type: 'bullets',
        content: [
          '27-30: Normal.',
          '21-26: MNCD (Mild Neurocognitive Disorder).',
          '1-20: Dementia.'
        ]
      },
      {
        title: 'Scoring (Less than High School)',
        type: 'bullets',
        content: [
          '25-30: Normal.',
          '20-24: MNCD.',
          '1-19: Dementia.'
        ]
      }
    ]
  },
  {
    id: 'dementia-cog-assessment',
    title: 'Assessing Cognition in Dementia',
    category: 'Clinical',
    icon: Brain,
    reference: 'ASHA 2018; Alzheimerâ€™s Association 2018',
    sections: [
      {
        title: 'Clinical Aim',
        type: 'text',
        content: 'Identify strengths and deficits related to memory, attention, orientation, language, sequencing, and executive function. The goal is to determine the presence/severity of a cognitive-communication disorder and its impact on daily life participation.'
      },
      {
        title: 'Assessment Considerations',
        type: 'bullets',
        content: [
          'Timing: Assess during peak alertness; consider pain levels and medication effectiveness.',
          'Environment: Optimal evaluation occurs in a quiet space free from environmental distractions.',
          'Sensory Factors: Ensure patient is using prescribed hearing aids and glasses during testing.',
          'Physical Factors: Account for fatigue, arthritis, or hemiplegia which may impact performance on motor-heavy tasks.',
          'Patient Perspective: If capable, ask the patient about their own view of their memory and any strategies they currently use.'
        ]
      },
      {
        title: 'Caregiver Collaboration',
        type: 'bullets',
        content: [
          'Gather information on the patientâ€™s greatest areas of concern.',
          'Identify the patientâ€™s strengths and when they are most engaged.',
          'Balance standardized measures with observations of functional routines (meals, social interactions).'
        ]
      }
    ]
  },
  {
    id: 'dementia-behavioral',
    title: 'Dementia: Behavioral & Psychosocial',
    category: 'Clinical',
    icon: AlertCircle,
    reference: 'ASHA 2019; Alzheimerâ€™s Association 2017',
    sections: [
      {
        title: 'Responsive Behaviors',
        type: 'text',
        content: 'Behavioral symptoms (anger, anxiety, repetitive actions) are often manifestations of unmet physical or psychosocial needs (pain, hunger, lack of safety) or overstimulation.'
      },
      {
        title: 'The 3-Step Analysis',
        type: 'list',
        content: [
          'Step 1: Examine the behavior. What was the trigger? Is there underlying pain or medical reason?',
          'Step 2: Explore potential solutions. Are needs being met? How can the reaction or approach be changed?',
          'Step 3: Try different responses. Did the new response help? Do other responses need to be considered?'
        ]
      },
      {
        title: 'Clinical Scenarios',
        type: 'bullets',
        content: [
          'Anger/Aggression: Often triggered by diet changes. Solution: Provide written education in large print; use "simulated presence" of a trusted loved one via recording.',
          'Anxiety/Agitation: Often related to fear of choking. Solution: Verbal/written acknowledgement of fears; work slowly with preferred foods to build confidence.',
          'Empowerment: Offer choices on as many things as possible to counter the loss of overall decision-making power.'
        ]
      }
    ]
  },
  {
    id: 'dementia-learning-memory',
    title: 'Dementia: Learning & Memory',
    category: 'Clinical',
    icon: BookOpen,
    reference: 'ASHA 2019; Benigas & Bourgeois 2016',
    sections: [
      {
        title: 'Memory Deficits',
        type: 'bullets',
        content: [
          'Episodic: Recall of personal events. Patient may not remember having difficulty swallowing.',
          'Short-term/Working: Forgetting info recently heard. Impacts ability to follow multi-step commands.',
          'New Learning: Misconception that learning is impossible; preserved procedural memory can be capitalized upon.'
        ]
      },
      {
        title: 'Communication Strategies',
        type: 'bullets',
        content: [
          'Reduce rate of speech and use concrete language.',
          'Limit verbalizations to 5-9 words when possible.',
          'Reduce the number of steps in a command.',
          'Approach the patient from the front and slowly to avoid fight-or-flight triggers.'
        ]
      },
      {
        title: 'Strength-Based Strategy (SRT)',
        type: 'text',
        content: 'Spaced Retrieval Training (SRT) is an effective way to teach new information (e.g., swallowing strategies). It capitalizes on non-declarative/procedural memory systems which are less impacted by dementia than declarative systems.'
      }
    ]
  },
  {
    id: 'mild-tbi-guide',
    title: 'Mild TBI / Concussion Guide',
    category: 'Clinical',
    icon: Brain,
    reference: 'APA 2013; DoD 2019; ASHA 2016',
    sections: [
      {
        title: 'DoD Definition of Mild TBI',
        type: 'bullets',
        content: [
          'Loss of consciousness for up to 30 minutes.',
          'Confused or disoriented state lasting less than 24 hours.',
          'Memory loss lasting less than 24 hours.',
          'Normal results on CT scan (if obtained).',
          'Excludes penetrating TBI.'
        ]
      },
      {
        title: 'SLP Treatment Areas',
        type: 'bullets',
        content: [
          'Cognitive-Communication: Focus on specific domains (attention, memory) or general functional communication.',
          'Speech and Language: Focus on word retrieval or pragmatic language (e.g., topic maintenance).'
        ]
      },
      {
        title: 'Clinical Note',
        type: 'alert',
        content: 'Up to 75% of TBIs are diagnosed as mild. Many individuals do not seek treatment, leading to an underestimate of the population needing skilled SLP intervention.'
      }
    ]
  },
  {
    id: 'ccd-case-history',
    title: 'Cognitive Case History Protocol',
    category: 'Evaluation',
    icon: ClipboardCheck,
    reference: 'Nannette Crawford; MedSLP Collective',
    sections: [
      {
        title: 'Core Objective',
        type: 'text',
        content: 'Gather comprehensive data to differentiate Cognitive Communication Disorders (CCD) from typical aging and to understand the etiology (metabolic vs. neurological).'
      },
      {
        title: 'Essential Questions',
        type: 'bullets',
        content: [
          'Who first noticed the problems?',
          'What is the patientâ€™s understanding of the referral?',
          'How does the CCD impact daily life (Driving, Employment, Med Management)?',
          'What are the familyâ€™s primary concerns?',
          'What strategies is the patient currently using to help themselves?'
        ]
      },
      {
        title: 'Functional Areas to Review',
        type: 'bullets',
        content: [
          'Prior vs. Current level of function in: Driving, Employment, Financial Management, Cooking/Cleaning, and Pet Care.',
          'Social Support: Who is in the support system? Who lives with the patient?',
          'Physical Health: Vision/Hearing status, sleep patterns, and recent travel history.'
        ]
      }
    ]
  },
  {
    id: 'vfss-fees-complementary',
    title: 'VFSS & FEES: Complementary Exams',
    category: 'Clinical',
    icon: Monitor,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    reference: 'Kelsey Day, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Clinical Rationale',
        type: 'text',
        content: 'Dual studies maximize the potential of both exams to provide a comprehensive swallowing evaluation. Selecting the appropriate order and timing is crucial for obtaining the maximum benefit for the patient.'
      },
      {
        title: 'Population-Specific Benefits',
        type: 'bullets',
        content: [
          'SCI/ACDF: VFSS for prevertebral edema and UES visualization; FEES for laryngeal function and birdâ€™s eye view of pharyngeal structures.',
          'TBI/CVA: VFSS for patients with reduced consciousness; FEES once calm/cooperative for secretion management.',
          'Trach/Vent: FEES is easier in the ICU and promotes early nutrition; VFSS follow-up once weaned from mechanical ventilation.',
          'H&N Cancer: VFSS for pharyngeal phase evaluation; FEES for direct visualization of masses and mucosal changes.'
        ]
      }
    ]
  },
  {
    id: 'vfss-myths',
    title: 'Dispelling Myths: VFSS',
    category: 'Clinical',
    icon: AlertCircle,
    reference: 'Kelly Caldwell; MedSLP Collective',
    sections: [
      {
        title: 'Radiation Safety',
        type: 'text',
        content: 'Myth: The VFSS uses too much radiation. Reality: Background radiation is 60-130 mrem/year. A VFSS procedure exposes the examiner to ~3 mrem, well below the 5 mrem regulatory limit.'
      },
      {
        title: 'Clinical Justification',
        type: 'bullets',
        content: [
          'Aspiration: Even if aspiration is known, a VFSS is needed to determine *why* it is occurring and which strategies mitigate it.',
          'Barium vs. Real Food: Barium assesses physiology. Standardized barium (Varibar) eliminates variability and provides a knowledgeable assessment of swallow mechanics.',
          'Pneumonia Risk: Research shows very low incidence of pneumonia related to aspiration *during* the VFSS itself; most cases are due to prior aspiration or gastric contents.'
        ]
      }
    ]
  },
  {
    id: 'peak-cough-flow',
    title: 'Clinical Application: Peak Cough Flow',
    category: 'Clinical',
    icon: Wind,
    reference: 'Faith Purnell, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Cough Phases',
        type: 'list',
        content: [
          '1. Irritation: Stimulation of receptors.',
          '2. Inspiratory: Opening glottis and diaphragm contraction.',
          '3. Compressive: Subglottic pressure build-up.',
          '4. Expiratory: Rapid airflow to expel material.'
        ]
      },
      {
        title: 'Procedure',
        type: 'bullets',
        content: [
          'Use a handheld peak flow meter.',
          'Instruct: "Cough like you are trying to clear something out of your throat."',
          'Take 3 measurements with 30s rest breaks.',
          'Record the maximum value.'
        ]
      },
      {
        title: 'Clinical Cutoffs (Aspiration Risk)',
        type: 'bullets',
        content: [
          'Stroke: < 174 L/min.',
          'Parkinsonâ€™s: < 314 L/min.',
          'ALS: < 240 L/min (Identified unsafe swallowing).'
        ]
      }
    ]
  },
  {
    id: 'patient-reported-outcomes',
    title: 'Patient Reported Outcomes (PROs)',
    category: 'Evaluation',
    icon: ClipboardCheck,
    reference: 'Sarah Busser, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Why use PROs?',
        type: 'text',
        content: 'PROs assess the perceived impact of deficits on health, participation, and quality of life. They provide data on improvements that standardized testing may miss.'
      },
      {
        title: 'Validated Tools',
        type: 'bullets',
        content: [
          'EAT-10: Swallowing assessment. Score >3 is abnormal; >15 indicates 2.2x higher aspiration risk.',
          'PILL-5: Pill dysphagia. Score â‰¥6 warrants referral to a swallowing specialist.',
          'VHI-10: Voice Handicap Index for adults with voice disorders.',
          'Neuro-QOL: Cognitive function assessment for neurological impairment.'
        ]
      }
    ]
  },
  {
    id: 'clinical-lab-values',
    title: 'Lab Values for the Medical SLP',
    category: 'Clinical',
    icon: Activity,
    reference: 'Tiffani Wallace, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'SLP Responsibility',
        type: 'alert',
        content: 'SLPs do not diagnose medical conditions from labs. Use them to confirm clinical impressions (e.g., dehydration) and alert the physician when values may impact therapy participation.'
      },
      {
        title: 'Key Indicators',
        type: 'bullets',
        content: [
          'CBC: RBC/Hgb/HCT. Low values (anemia) can cause fatigue and increased risk of cognitive decline.',
          'WBC: ANC (Neutrophils). Low ANC (neutropenia) increases infection risk; high ANC may follow surgery or CVA.',
          'CMP: Sodium (Hydration/Mental Status), Potassium (Neuromuscular function), BUN/Creatinine (Kidney function/Hydration).'
        ]
      }
    ]
  },
  {
    id: 'tracheostomy-101',
    title: 'Tracheostomy 101',
    category: 'Clinical',
    icon: Wind,
    reference: 'Kelly Caldwell, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Terminology',
        type: 'text',
        content: 'Tracheotomy refers to the surgical procedure; Tracheostomy refers to the resulting opening. SLPs are uniquely qualified to restore communication and swallowing once these medical interventions occur.'
      },
      {
        title: 'Anatomy of a Trach Tube',
        type: 'bullets',
        content: [
          'Cuff: Soft plastic balloon at the lower end. Inflated for mechanical ventilation; must be deflated for speaking valve use.',
          'Pilot Balloon: External indicator of cuff status (flat = deflated).',
          'Inner Cannula: Removable tube for cleaning secretions.',
          'Obturator: Guide used during placement; must be saved at bedside for emergencies.'
        ]
      },
      {
        title: 'Decannulation',
        type: 'text',
        content: 'The intentional removal of the tracheostomy tube. It is a permanent decision made by the medical team (Pulmonology, ENT, RT, SLP) when the patient is stable and airway protection is confirmed.'
      }
    ]
  },
  {
    id: 'ventilators-basics',
    title: 'Ventilators 101 & 102',
    category: 'Clinical',
    icon: Wind,
    reference: 'Jessica Lasky, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Core Terminology',
        type: 'bullets',
        content: [
          'PEEP: Positive End-Expiratory Pressure. Prevents collapse of alveoli.',
          'FiO2: Fraction of Inspired Oxygen. Percentage of oxygen delivered (Room air = 21%).',
          'PIP: Peak Inspiratory Pressure. Highest pressure achieved during inspiration.',
          'Tidal Volume (Vt): Volume of air moved in/out in one cycle.'
        ]
      },
      {
        title: 'Ventilation Modes',
        type: 'bullets',
        content: [
          'Controlled: Machine is in complete control; patient expends no effort.',
          'Assisted: Machine provides a breath if the patient fails to initiate one in time.',
          'Spontaneous/Supported: Patient triggers all breaths; machine provides minimal pressure support.'
        ]
      }
    ]
  },
  {
    id: 'speaking-valve-clinical',
    title: 'Speaking Valves: Clinical Benefits',
    category: 'Clinical',
    icon: Wind,
    reference: 'Jamie D. Fisher, PhD CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Swallowing Benefits',
        type: 'bullets',
        content: [
          'Restores subglottic air pressure, which is vital for an effective cough reflex.',
          'Increases oropharyngeal sensation (taste and smell).',
          'Improves secretion management by producing more forceful volitional coughs.',
          'Improves oxygenation by reestablishing PEEP in a closed system.'
        ]
      },
      {
        title: 'The Golden Rule',
        type: 'alert',
        content: 'You MUST deflate the cuff before placing a speaking valve. If the cuff remains inflated, the patient will NOT be able to exhale and will be unable to breathe.'
      },
      {
        title: 'Common Manufacturers',
        type: 'bullets',
        content: [
          'Passy-Muir (PMSV): "No Leak" design; always closed until inhalation.',
          'Shikani (SSV): Ball design; allows for "biased open" or "biased closed" positions.',
          'Shiley: Intended for alert, awake patients without assisted ventilation.'
        ]
      }
    ]
  },
  {
    id: 'trach-team-guide',
    title: 'Starting a Tracheostomy Team',
    category: 'Compliance',
    icon: Scale,
    reference: 'Kahla Graham, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Objectives',
        type: 'bullets',
        content: [
          'Reduce time to decannulation.',
          'Shorten length of stay (LOS).',
          'Maximize patient safety and prevent adverse events.',
          'Increase speaking valve use for communication.'
        ]
      },
      {
        title: 'Key Players',
        type: 'text',
        content: 'A successful team requires a Physician Champion (MD), SLP, Respiratory Therapist (RT), and Nursing leadership.'
      },
      {
        title: 'Standardized Procedures',
        type: 'bullets',
        content: [
          'Automatic order sets in the EMR.',
          'Defined weaning and downsizing protocols.',
          'Regular interdisciplinary rounds and cross-training between RT and SLP.'
        ]
      }
    ]
  },
  {
    id: 'aphasia-tx-guide',
    title: 'Aphasia: Assessment & Treatment',
    category: 'Clinical',
    icon: MessageCircle,
    reference: 'Alexandra Basilakos Ph.D. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Assessment Tools',
        type: 'bullets',
        content: [
          'Comprehensive: WAB-R (Western Aphasia Battery), BDAE-3 (Boston Diagnostic Aphasia Evaluation).',
          'Quick/Free: Quick Aphasia Battery (QAB), Brisbane Test for Acute Aphasia.'
        ]
      },
      {
        title: 'Treatment Approaches',
        type: 'bullets',
        content: [
          'Impairment-Based: SFA (Semantic Feature Analysis), VNeST (Verb Network Strengthening), MIT (Melodic Intonation Therapy).',
          'Communication-Based: PACE (Promoting Aphasicsâ€™ Communicative Effectiveness), SCA (Supported Conversation Approach), Script Training.'
        ]
      }
    ]
  },
  {
    id: 'vnest-protocol',
    title: 'VNeST: Treatment Protocol',
    category: 'Clinical',
    icon: Activity,
    reference: 'Lisa Edmonds, PhD CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'The "Verb Network" Concept',
        type: 'text',
        content: 'VNeST focuses on verb production because verbs are central to both semantics and syntax. Verbs "prime" nouns, helping to improve word retrieval and sentence production.'
      },
      {
        title: 'Protocol Steps',
        type: 'list',
        content: [
          '1. Choose 10 transitive verbs (e.g., "wash", "chop").',
          '2. Generate 3 pairs of agents/objects (e.g., "Maid / Dishes", "Steve / Clothes").',
          '3. Expand one sentence with "Where", "When", and "Why" clauses.',
          '4. Semantic Judgments: Listen to 12 sentences and judge if they are correct.',
          '5. Recall the target verb independently.'
        ]
      }
    ]
  },
  {
    id: 'cueing-hierarchies',
    title: 'Cueing Hierarchies',
    category: 'Clinical',
    icon: BookOpen,
    reference: 'Katie Brown, M.A. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Core Principles',
        type: 'bullets',
        content: [
          'Least-to-Most: Use the minimum level of assistance needed for success.',
          'Fade Quickly: Reverse the hierarchy as the patient improves.',
          'Self-Cueing: Train the patient to use their own strategies for independence.'
        ]
      },
      {
        title: 'Phonological vs. Semantic',
        type: 'bullets',
        content: [
          'Phonological: Sound-based (first phoneme, rhyming word, syllable count).',
          'Semantic: Meaning-based (function, definition, category, sentence completion).'
        ]
      }
    ]
  },
  {
    id: 'als-aac-guide',
    title: 'ALS & AAC: Quick Start',
    category: 'Clinical',
    icon: MessageSquare,
    reference: 'Kacy Barron; MedSLP Collective',
    sections: [
      {
        title: 'Timing of Assessment',
        type: 'text',
        content: 'AAC assessment should begin when speaking rates reach 125 words per minute or fewer on the Speech Intelligibility Test.'
      },
      {
        title: 'Access Methods',
        type: 'bullets',
        content: [
          'Direct Selection: Touch screen, stylus.',
          'Head Tracking: Small device on head moves cursor.',
          'Eye-Tracking: Natural for ALS; results in limited muscle fatigue compared to switch scanning.'
        ]
      },
      {
        title: 'Voice & Message Banking',
        type: 'bullets',
        content: [
          'Voice Banking: Creating a synthesized version of the patientâ€™s own voice.',
          'Message Banking: Recording specific, meaningful phrases (e.g., "I love you").',
          'Note: These must be completed BEFORE the patient loses their natural speech.'
        ]
      }
    ]
  },
  {
    id: 'partner-assisted-scanning',
    title: 'Partner-Assisted Scanning (PAS)',
    category: 'Clinical',
    icon: Users,
    reference: 'Jessica Gormley, PhD CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'What is PAS?',
        type: 'text',
        content: 'A low-tech AAC technique where the communication partner "scans" through options (letters, words, colors) until the patient signals a selection. Ideal for ICU or when high-tech equipment is not feasible.'
      },
      {
        title: 'Scanning Options',
        type: 'bullets',
        content: [
          'Letter-by-Letter: Partner points to each letter in order.',
          'Row-Column: Partner identifies the row first, then the specific item in that row.',
          'Cluster: Color-coded groups of letters/symbols.'
        ]
      },
      {
        title: 'Board Selection',
        type: 'bullets',
        content: [
          'QWERTY: Best for frequent computer users.',
          'AEIOU: Easier for partners due to alphabetical order.',
          '4-Corner: Less visually cluttered for patients with scanning deficits.'
        ]
      }
    ]
  },
  {
    id: 'voice-perceptual-rating',
    title: 'Voice: Perceptual Rating Systems',
    category: 'Clinical',
    icon: Mic,
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=800',
    reference: 'Kempster et al. 2009; Hirano 1981',
    sections: [
      {
        title: 'GRBAS Scale',
        type: 'bullets',
        content: [
          'Grade: Overall severity.',
          'Roughness: Irregularity.',
          'Breathiness: Air leakage.',
          'Asthenia: Weakness.',
          'Strain: Effort.'
        ]
      },
      {
        title: 'CAPE-V',
        type: 'text',
        content: 'Consensus Auditory-Perceptual Evaluation of Voice. Uses standardized sentences and a 100mm Visual Analogue Scale (VAS). More sensitive to subtle vocal qualities than the GRBAS.'
      }
    ]
  },
  {
    id: 'laryngeal-pathologies',
    title: 'Laryngeal Anatomy & Pathologies',
    category: 'Clinical',
    icon: Stethoscope,
    reference: 'Jennifer Kizner, M.Ed CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Common Pathologies',
        type: 'bullets',
        content: [
          'Vocal Nodules: Typically bilateral; "hourglass" glottic configuration; caused by phonotrauma.',
          'VF Polyps: Unilateral fluid-filled growths; surgical resection often required.',
          'Presbylaryngeus: "Aging voice"; loss of elasticity and tone in the vocal folds.',
          'VF Paralysis: Immobilization of one or both folds; impacts adduction/abduction and airway protection.'
        ]
      }
    ]
  },
  {
    id: 'covid-slp-clinical',
    title: 'COVID-19: Clinical Considerations',
    category: 'Clinical',
    icon: AlertCircle,
    reference: 'Jackie Danek, M.S. CCC-SLP; MedSLP Collective',
    sections: [
      {
        title: 'Interdisciplinary Support',
        type: 'bullets',
        content: [
          'PT/OT: Educate on vocal cord fragility during proning; encourage AAC boards for intubated patients.',
          'Nursing: Support implementation of the Yale Swallow Protocol and oral hygiene teams.',
          'Doctors: Advocate for patients regarding the "three pillars of aspiration" when instrumental access is limited.'
        ]
      },
      {
        title: 'Post-Extubation Data',
        type: 'text',
        content: 'Research indicates that 56% of patients aspirated following extubation (based on FEES), with 25% being silent aspirators. 70% aspirated thin liquids.'
      }
    ]
  },
  {
    id: 'telepractice-guide',
    title: 'Emergency Telepractice Guide',
    category: 'Clinical',
    icon: Monitor,
    reference: 'MedSLP Collective 2020',
    sections: [
      {
        title: 'HIPAA Compliant Platforms',
        type: 'bullets',
        content: [
          'General: Doxy.me, Vsee Clinic, GoToMeeting.',
          'SLP Specific: Theraplatform, TheraVnetwork, Blink Session.',
          'Note: A Business Associate Agreement (BAA) is required for HIPAA compliance.'
        ]
      },
      {
        title: 'Hardware & Setup',
        type: 'bullets',
        content: [
          'Headset: Cushioned over-the-ear with built-in microphone.',
          'Document Camera: Essential for showing physical materials; can use a smartphone "hack" with a stand.',
          'Mirroring: Software like Airserver can mirror iPad apps to the computer screen.'
        ]
      }
    ]
  },
  {
    id: 'slp-interview-prep',
    title: 'SLP Interview & Career Prep',
    category: 'Compliance',
    icon: BookOpen,
    reference: 'Clinical Mentorship Guide',
    sections: [
      {
        title: 'Common Interview Questions',
        type: 'bullets',
        content: [
          'Why the acute setting? (Learning instrumentals, complex DX).',
          'Strengths: Empathy, work ethic, interpersonal skills.',
          'Weaknesses: Tunnel vision when busy, time needed for complex info.',
          'First steps: Confirm identity and build rapport.'
        ]
      },
      {
        title: 'Questions for the Employer',
        type: 'bullets',
        content: [
          'Describe the hospital culture and team structure.',
          'What does the mentoring/training process look like?',
          'What are the biggest challenges in this specific role?',
          'What is the typical career path for an SLP here?'
        ]
      }
    ]
  }
];


