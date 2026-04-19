import { 
  BookOpen, 
  Brain, 
  FileText, 
  ShieldCheck, 
  Stethoscope, 
  Library, 
  Activity, 
  Utensils,
  MessageSquare,
  Mic,
  Users,
  Wind,
  ClipboardList,
  Scale,
  Monitor,
  MessageCircle,
  Volume2,
  Puzzle,
  BookOpenCheck,
  Coffee,
  Route,
  Calculator,
  Waves,
  HeartHandshake,
  Target,
  Heart,
  TrendingUp,
  FlaskConical
} from 'lucide-react';

export type CategoryId = 
  | 'dysphagia'
  | 'cog-comm'
  | 'aphasia'
  | 'motor-speech'
  | 'voice'
  | 'fluency'
  | 'hnc'
  | 'socials'
  | 'instrumentals'
  | 'trach-vent'
  | 'asha-hub'
  | 'clinical-pathways'
  | 'news-ceu'
  | 'documentation'
  | 'regulatory-navigator'
  | 'slp-corner'
  | 'medical-diagnostics'
  | 'handout-maker'
  | 'pacific coast-slp-corner'
  | 'studios'
  | 'palliative'
  | 'dysphagia-eval'
  | 'aac-hub'
  | 'anatomy-lab'
  | 'stroke-anatomy'
  | 'case-brainstorm'
  | 'nethealth-help'
  | 'clinical-library'
  | 'therapy-studio'
  | 'goal-generator'
  | 'clinical-calculators'
  | 'pdf-library'
  | 'dysarthria-eval'
  | 'aphasia-tools'
  | 'dysphagia-hub'
  | 'progress-tracker'
  | 'documentation-studio'
  | 'documentation-requirements'
  | 'asset-gallery'
  | 'slp-chat'
  | 'three-way-eval'
  | 'treatment-ideas'
  | 'part-b-checker'
  | 'gait-balance'
  | 'pelvic-health'
  | 'stroke-rehab'
  | 'functional-adls'
  | 'dysphagia-advanced';

export interface ResourceLink {
  title: string;
  url?: string;
  description?: string;
  type: 'external' | 'internal' | 'tool';
  pacific coastId?: string;
  image?: string;
  video?: string;
  confidenceScore?: number; // 1-5 ranking based on research/evidence
  acronym?: string;
}

export interface ResourceGroup {
  title: string;
  items: ResourceLink[];
}

export interface ResearchArticle {
  title: string;
  pdfUrl: string;
  summary: string; // what is its
  testing: string; // what it tested
  results: string;
  indications: string;
  limitations: string;
}

export interface SubCategory {
  title: string;
  items?: ResourceLink[];
  groups?: ResourceGroup[];
  researchArchives?: ResearchArticle[];
  overview?: {
    definition: string;
    presentation: string;
    causes: string;
    lookOutFor: string;
  };
}

export interface Category {
  id: CategoryId;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string; // Tailwind class for background/accent
  content: SubCategory[];
  component?: 'MedicareHelper' | 'ClinicalMeds' | 'GoalGenerator' | 'IDDSIGuide' | 'CognitiveTasks' | 'ClinicalPathways' | 'ComplianceCenter' | 'SubspecialtyDetail' | 'InstrumentalsGuide' | 'TrachVentGuide' | 'HandoutMaker' | 'ClinicalExams' | 'Pacific CoastSLPCorner' | 'AACModule' | 'AnatomyLab' | 'CaseBrainstorm' | 'NetHealthHelp' | 'ClinicalLibrary' | 'SLPLife' | 'DocumentationStudio' | 'TherapyStudio' | 'TrismusTracker' | 'ClinicalCalculators' | 'PDFLibrary' | 'DysarthriaEval' | 'AphasiaTools' | 'DysphagiaHub' | 'ProgressTracker' | 'SLPChat' | 'TreatmentIdeas' | 'MedicareDocChecker' | 'MotorSpeechModule' | 'CognitiveModule' | 'VoiceModule' | 'BrainAnatomyExplorer';
  image?: string;
  video?: string;
  relatedTools?: { id: string; title: string; icon?: string }[];
}

export const SLP_DATA: Category[] = [
  {
    id: 'pelvic-health',
    title: 'Pelvic Health (PT)',
    icon: Heart,
    description: 'Specialized physical therapy for pelvic floor dysfunction, incontinence, and pelvic pain.',
    color: 'bg-rose-50 text-rose-700',
    component: 'SubspecialtyDetail',
    content: []
  },
  {
    id: 'gait-balance',
    title: 'Gait & Balance (PT)',
    icon: Scale,
    description: 'Advanced fall risk management, stability training, and community mobility.',
    color: 'bg-emerald-50 text-emerald-700',
    component: 'SubspecialtyDetail',
    content: []
  },
  {
    id: 'stroke-rehab',
    title: 'Stroke Rehab (OT)',
    icon: Brain,
    description: 'Neurological upper extremity recovery, CIMT, and neuroplasticity-based OT.',
    color: 'bg-orange-50 text-orange-700',
    component: 'SubspecialtyDetail',
    content: []
  },
  {
    id: 'functional-adls',
    title: 'Functional ADLs (OT)',
    icon: Utensils,
    description: 'Occupational therapy for independence in self-care, hygiene, and daily tasks.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'SubspecialtyDetail',
    content: []
  },
  {
    id: 'dysphagia-advanced',
    title: 'Advanced Dysphagia (SLP)',
    icon: Activity,
    description: 'High-intensity swallow rehab, MDTP protocols, and EMST training.',
    color: 'bg-blue-50 text-blue-700',
    component: 'SubspecialtyDetail',
    content: []
  },
  {
    id: 'studios',
    title: 'Therapy & Documentation Studios',
    icon: Monitor,
    description: 'AI-powered tools for documentation, goals, and therapy',
    color: 'bg-violet-50 text-violet-700',
    component: 'TherapyStudio',
    content: [
      {
        title: 'Documentation Studio',
        items: [
          { title: 'AI-powered clinical documentation support.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Asset Gallery',
        items: [
          { title: 'Access and manage your AI-generated images and games.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Goal Bank Generator',
        items: [
          { title: 'AI-powered SMART goal generation.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Instrumental Report Builder',
        items: [
          { title: 'Standardized reporting for MBSS and FEES.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Progress Tracker',
        items: [
          { title: 'Visualize patient progress over time.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Handout Maker',
        items: [
          { title: 'Create custom patient handouts and educational materials.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Therapy Studio',
        items: [
          { title: 'Build and play interactive cognitive, speech, and language activities.', type: 'tool', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'asset-gallery',
    title: 'Asset Gallery',
    icon: Library,
    description: 'Access and manage your AI-generated images and games',
    color: 'bg-amber-50 text-amber-700',
    content: [
      {
        title: 'Your Assets',
        items: [
          { title: 'View generated images', type: 'tool' },
          { title: 'Play generated games', type: 'tool' }
        ]
      }
    ]
  },
  {
    id: 'dysphagia',
    title: 'Dysphagia',
    icon: Activity,
    description: 'Advanced swallowing diagnostics, therapeutic exercises, and diet management protocols.',
    color: 'bg-blue-50 text-blue-700',
    component: 'SubspecialtyDetail',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    relatedTools: [
      { id: 'iddsi-guide', title: 'IDDSI Guide', icon: 'Utensils' },
      { id: 'instrumentals-guide', title: 'Instrumentals Guide', icon: 'Video' },
      { id: 'clinical-calculators', title: 'Clinical Calculators', icon: 'Calculator' },
      { id: 'treatment-ideas', title: 'Treatment Ideas', icon: 'Lightbulb' }
    ],
    content: [
      {
        title: 'IDDSI Guide',
        items: [
          { title: 'Interactive guide for texture modified diets and testing.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Palliative & Hospice',
        items: [
          { title: 'End-of-life swallowing management, advanced directives, and quality of life focus.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Clinical Refresher: Dysphagia',
        overview: {
          definition: 'Dysphagia is a swallowing disorder involving any of the four phases of swallowing: oral preparatory, oral, pharyngeal, and esophageal.',
          presentation: 'Coughing or choking during meals, wet/gurgly vocal quality, globus sensation, unintended weight loss, recurrent pneumonia, or significantly prolonged meal times.',
          causes: 'Neurological (Stroke, TBI, Parkinson\'s, ALS, MS), structural (Head/Neck Cancer, Zenker\'s Diverticulum, esophageal strictures), or systemic (Dementia, Sarcopenia, generalized weakness).',
          lookOutFor: 'Silent aspiration (aspiration without a cough reflex), pocketing of food in buccal cavities, delayed swallow trigger, and reduced laryngeal elevation/excursion.'
        }
      },
      {
        title: 'Evidence-Based Treatments',
        groups: [
          {
            title: 'Exercise Protocols',
            items: [
              { title: 'McNeill Dysphagia Therapy Program (MDTP)', description: 'Systematic exercise-based therapy using food as resistance.', type: 'internal', url: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/', confidenceScore: 5 },
              { title: 'Expiratory Muscle Strength Training (EMST)', description: 'Improving cough strength and airway protection.', type: 'tool', url: 'https://www.emst150.com/', confidenceScore: 4 },
              { title: 'Masako Maneuver', description: 'Targeting base of tongue retraction and pharyngeal wall movement.', type: 'internal', url: 'https://www.dysphagiacafe.com/2015/01/26/the-masako-maneuver/', confidenceScore: 3 },
              { title: 'Shaker Exercise', description: 'Improving UES opening via suprahyoid muscle strengthening.', type: 'internal', url: 'https://www.medbridgeeducation.com/blog/2016/04/shaker-exercise-dysphagia-rehabilitation/', confidenceScore: 4 }
            ]
          },
          {
            title: 'Neuromodulation',
            items: [
              { title: 'Pharyngeal Electrical Stimulation', description: 'Neuromodulation for post-stroke dysphagia.', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/', confidenceScore: 4 }
            ]
          }
        ]
      },
      {
        title: 'Standardized Assessments',
        groups: [
          {
            title: 'Clinical Screens',
            items: [
              { title: 'Yale Swallow Protocol', description: 'Reliable screen for aspiration risk.', type: 'external', url: 'https://yaleswallowprotocol.com/', confidenceScore: 5 },
              { title: 'EAT-10 Assessment', description: 'Patient-reported outcome measure for dysphagia severity.', type: 'external', url: 'https://www.nestlehealthscience.us/brands/thickenup/thickenup-clear/eat-10', confidenceScore: 4 },
              { title: 'OHAT (Oral Health Assessment Tool)', description: 'Clinical exam for oral hygiene and health status.', type: 'external', url: 'https://www.health.gov.au/resources/publications/oral-health-assessment-tool-ohat', confidenceScore: 4 }
            ]
          },
          {
            title: 'Standardized Protocols',
            items: [
              { title: 'MBSImPâ„¢ Protocol', description: 'Standardized protocol for Modified Barium Swallow studies.', type: 'external', url: 'https://www.mbsimp.com/', image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800', confidenceScore: 5 },
              { title: 'DIGEST Scoring', description: 'Dynamic Imaging Grade of Swallowing Toxicity.', type: 'internal', url: 'https://www.mdanderson.org/research/departments-labs-institutes/departments-divisions/head-and-neck-surgery/digest.html', confidenceScore: 4 }
            ]
          }
        ]
      },
      {
        title: 'Imaging & Diagnostics',
        items: [
          { title: 'Modified Barium Swallow (MBSS)', description: 'Dynamic X-ray study of swallowing.', type: 'internal', image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800', confidenceScore: 5 },
          { title: 'FEES (Fiberoptic Endoscopic Evaluation)', description: 'Endoscopic visualization of the pharynx during swallowing.', type: 'internal', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800', confidenceScore: 5 },
          { title: 'Chest X-Ray (CXR) Interpretation', description: 'Identifying aspiration pneumonia and pulmonary status.', type: 'internal', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800', confidenceScore: 3 },
          { title: 'CT Head/Neck', description: 'Structural imaging for masses or infarcts.', type: 'internal', confidenceScore: 4 },
          { title: 'MRI Brain', description: 'Detailed soft tissue imaging for stroke localization.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Bedside Swallowing Exams',
        groups: [
          {
            title: 'Standardized Exams',
            items: [
              { title: 'MASA (Mann Assessment of Swallowing Ability)', description: 'Standardized clinical bedside exam for stroke patients.', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/', confidenceScore: 5 },
              { title: 'GUSS (Gugging Swallowing Screen)', description: 'Step-by-step bedside screen for acute stroke.', type: 'external', url: 'https://www.strokecenter.org/', confidenceScore: 4 },
              { title: 'Yale Swallow Protocol', description: '3oz water swallow challenge.', type: 'external', url: 'https://www.dysphagiacafe.com/', confidenceScore: 5 },
              { title: 'TOR-BSSTÂ©', description: 'Toronto Bedside Swallowing Screening Test.', type: 'external', url: 'https://tor-bsst.com/', confidenceScore: 4 }
            ]
          },
          {
            title: 'Cranial Nerve Exam',
            items: [
              { title: 'Cranial Nerve Examination', description: 'Comprehensive assessment of CN V, VII, IX, X, XI, XII.', type: 'internal', confidenceScore: 5 },
              { title: 'Oral Motor Examination', description: 'Systematic review of oral structure and function.', type: 'internal', confidenceScore: 5 }
            ]
          }
        ]
      },
      {
        title: 'Pacific Coast Clinical Summaries',
        items: [
          { title: 'Handling Dietary Refusals', type: 'internal', pacific coastId: 'dietary-refusals', description: 'IDT protocols and patient choice documentation.', confidenceScore: 5 },
          { title: 'Respiratory Rehab: SLP Role', type: 'internal', pacific coastId: 'respiratory-rehab', description: 'RMST, airway protection, and swallow safety.', confidenceScore: 4 },
          { title: 'VFSS & FEES: Complementary Exams', type: 'internal', pacific coastId: 'vfss-fees-complementary', description: 'Clinical rationale for dual studies.', confidenceScore: 5 },
          { title: 'Dispelling Myths: VFSS', type: 'internal', pacific coastId: 'vfss-myths', description: 'Radiation safety and clinical justification.', confidenceScore: 4 },
          { title: 'Clinical Application: Peak Cough Flow', type: 'internal', pacific coastId: 'peak-cough-flow', description: 'Procedure and aspiration risk cutoffs.', confidenceScore: 4 }
        ]
      },
      {
        title: 'Dysphagia Deep Dive',
        items: [
          { title: 'Interactive CSE, instrumental support, and exercises.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'The McNeill Dysphagia Therapy Program (MDTP): A Case-Control Study',
            pdfUrl: 'https://pubmed.ncbi.nlm.nih.gov/20194747/',
            summary: 'A systematic exercise-based therapy program for severe chronic dysphagia.',
            testing: 'Compared MDTP to traditional therapy in a case-control design with 53 patients.',
            results: 'MDTP group showed significantly greater improvement in swallowing function and diet level.',
            indications: 'Chronic dysphagia post-stroke or head/neck cancer.',
            limitations: 'Small sample size, retrospective comparison.'
          },
          {
            title: 'Expiratory Muscle Strength Training (EMST) in Parkinson\'s Disease',
            pdfUrl: 'https://pubmed.ncbi.nlm.nih.gov/20194747/',
            summary: 'Investigation of EMST for improving airway protection.',
            testing: 'Randomized controlled trial with 60 PD patients.',
            results: 'Significant increase in maximal expiratory pressure and swallow safety.',
            indications: 'Aspiration risk in PD patients.',
            limitations: 'Long-term maintenance of effects not fully established.'
          }
        ]
      }
    ]
  },
  {
    id: 'aphasia',
    title: 'Aphasia',
    icon: MessageCircle,
    description: 'Comprehensive language rehabilitation, neuroplasticity-based protocols, and AAC integration.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'AphasiaTools',
    image: 'https://picsum.photos/seed/aphasia-brain/800/600',
    content: [
      {
        title: 'Clinical Refresher: Aphasia',
        overview: {
          definition: 'Aphasia is an acquired language disorder resulting from brain damage (typically left hemisphere) that affects the production and/or comprehension of language.',
          presentation: 'Word-finding difficulties (anomia), paraphasias (phonemic or semantic), telegraphic speech, impaired auditory comprehension, and difficulties with reading/writing.',
          causes: 'Most commonly Stroke (CVA), but also TBI, brain tumors, or Primary Progressive Aphasia (PPA) in neurodegenerative diseases.',
          lookOutFor: 'Frustration during communication, social withdrawal, and the distinction between fluent (Wernicke\'s) vs. non-fluent (Broca\'s) characteristics.'
        }
      },
      {
        title: 'Therapeutic Protocols',
        groups: [
          {
            title: 'Impairment-Based',
            items: [
              { title: 'Constraint-Induced Language Therapy (CILT)', description: 'Intensive therapy focusing on verbal output.', type: 'internal', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800', confidenceScore: 5 },
              { title: 'Semantic Feature Analysis (SFA)', description: 'Targeting word retrieval via semantic mapping.', type: 'tool', confidenceScore: 4 },
              { title: 'VNeST: Verb Network Strengthening', type: 'internal', pacific coastId: 'vnest-protocol', description: 'Systematic semantic-lexical treatment.', confidenceScore: 4 }
            ]
          },
          {
            title: 'Functional/Social',
            items: [
              { title: 'Response Elaboration Training (RET)', description: 'Increasing utterance length and information content.', type: 'internal', confidenceScore: 4 },
              { title: 'Script Training', description: 'Functional communication for specific social contexts.', type: 'internal', confidenceScore: 4 }
            ]
          }
        ]
      },
      {
        title: 'Assessment & Tools',
        items: [
          { title: 'WAB-R Aphasia Quotient', description: 'Western Aphasia Battery - Revised.', type: 'tool', confidenceScore: 5 },
          { title: 'Boston Diagnostic Aphasia Exam (BDAE)', description: 'Comprehensive language assessment.', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/', confidenceScore: 5 },
          { title: 'Aphasia: Assessment & Treatment Guide', type: 'internal', pacific coastId: 'aphasia-tx-guide', description: 'Impairment vs. communication-based approaches.', confidenceScore: 5 },
          { title: 'Cueing Hierarchies', type: 'internal', pacific coastId: 'cueing-hierarchies', description: 'Least-to-most cueing principles.', confidenceScore: 4 }
        ]
      },
      {
        title: 'Aphasia Toolkit',
        items: [
          { title: 'Interactive VNeST and PACE tools.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Motor Speech & Dysarthria',
        items: [
          { title: 'Frenchay Dysarthria Assessment (FDA-2)', description: 'Standardized assessment for dysarthria.', type: 'external', url: 'https://www.proedinc.com/products/frenchay-dysarthria-assessment-second-edition-fda-2', confidenceScore: 5 },
          { title: 'Assessment of Intelligibility of Dysarthric Speech', description: 'Standardized measure of intelligibility.', type: 'external', url: 'https://www.proedinc.com/products/assessment-of-intelligibility-of-dysarthric-speech', confidenceScore: 5 },
          { title: 'Word Intelligibility Test', description: 'Quick measure of single word intelligibility.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'Constraint-Induced Language Therapy (CILT) for Chronic Aphasia',
            pdfUrl: 'https://pubmed.ncbi.nlm.nih.gov/11469351/',
            summary: 'Intensive language therapy that restricts non-verbal communication.',
            testing: 'Randomized trial comparing CILT to conventional therapy.',
            results: 'CILT group showed superior improvements in standardized language tests.',
            indications: 'Chronic non-fluent aphasia.',
            limitations: 'High intensity may not be feasible for all patients.'
          }
        ]
      }
    ]
  },
  {
    id: 'motor-speech',
    title: 'Motor Speech',
    icon: Mic,
    description: 'Assessment and treatment for dysarthria and apraxia of speech.',
    color: 'bg-rose-50 text-rose-700',
    component: 'MotorSpeechModule',
    image: 'https://picsum.photos/seed/motor-speech/800/600',
    content: [
      {
        title: 'Clinical Refresher: Motor Speech',
        overview: {
          definition: 'Motor speech disorders include dysarthria (impaired execution) and apraxia of speech (impaired planning/programming) of the motor movements required for speech.',
          presentation: 'Slurred speech, irregular articulatory breakdowns, hypernasality, strained or breathy voice, and reduced speech rate or prosody.',
          causes: 'Stroke, TBI, Parkinson\'s Disease, ALS, Multiple Sclerosis, and other neuromuscular conditions.',
          lookOutFor: 'Consistency of errors (Apraxia is inconsistent, Dysarthria is consistent), respiratory support for speech, and vocal quality changes.'
        }
      },
      {
        title: 'Clinical Refresher: Parkinson\'s Disease',
        overview: {
          definition: 'Parkinson\'s Disease (PD) is a progressive neurodegenerative disorder that primarily affects dopamine-producing neurons in the substantia nigra.',
          presentation: 'Tremor, bradykinesia (slow movement), rigidity, postural instability, hypophonia (quiet voice), and hypokinetic dysarthria.',
          causes: 'Loss of dopaminergic neurons, likely due to a combination of genetic and environmental factors.',
          lookOutFor: 'The "on/off" medication cycles, micrographia (small handwriting), and the high risk of silent aspiration in later stages.'
        }
      },
      {
        title: 'Dysarthria',
        groups: [
          {
            title: 'Assessment',
            items: [
              { title: 'Frenchay Dysarthria Assessment (FDA-2)', description: 'Standardized assessment.', type: 'external', url: 'https://www.proedinc.com/products/frenchay-dysarthria-assessment-second-edition-fda-2', confidenceScore: 5 },
              { title: 'Assessment of Intelligibility of Dysarthric Speech', description: 'Standardized measure.', type: 'external', url: 'https://www.proedinc.com/products/assessment-of-intelligibility-of-dysarthric-speech', confidenceScore: 5 }
            ]
          },
          {
            title: 'Treatment',
            items: [
              { title: 'LSVT LOUD', description: 'Evidence-based treatment for Parkinson\'s.', type: 'external', url: 'https://www.lsvtglobal.com/', confidenceScore: 5 },
              { title: 'SPEAK OUT!', description: 'Parkinson Voice Project protocol.', type: 'external', url: 'https://parkinsonvoiceproject.org/', confidenceScore: 5 },
              { title: 'Breath Support Exercises', description: 'Improving respiratory support for speech.', type: 'internal', confidenceScore: 4 },
              { title: 'Clear Speech Strategies', description: 'Compensatory strategies for intelligibility.', type: 'internal', confidenceScore: 5 }
            ]
          }
        ]
      },
      {
        title: 'Apraxia of Speech',
        items: [
          { title: 'Apraxia Battery for Adults (ABA-2)', description: 'Assessment of apraxia.', type: 'external', url: 'https://www.proedinc.com/', confidenceScore: 5 },
          { title: 'Script Training', description: 'Functional communication training.', type: 'internal', confidenceScore: 4 },
          { title: 'Sound Production Treatment', description: 'Articulatory kinematic approach.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'LSVT LOUD: Long-term Outcomes in Parkinson\'s Disease',
            pdfUrl: 'https://pubmed.ncbi.nlm.nih.gov/11469351/',
            summary: 'Intensive voice treatment focusing on "Think Loud".',
            testing: 'Longitudinal study of vocal intensity over 2 years.',
            results: 'Maintenance of increased vocal loudness and improved speech intelligibility.',
            indications: 'Hypokinetic dysarthria in Parkinson\'s.',
            limitations: 'Requires high patient motivation and cognitive status.'
          }
        ]
      }
    ]
  },
  {
    id: 'voice',
    title: 'Voice',
    icon: Volume2,
    description: 'Evaluation and management of organic, functional, and neurogenic voice disorders.',
    color: 'bg-purple-50 text-purple-700',
    component: 'VoiceModule',
    image: 'https://picsum.photos/seed/vocal-cords/800/600',
    relatedTools: [
      { id: 'documentation-studio', title: 'Doc Studio', icon: 'FileText' },
      { id: 'clinical-calculators', title: 'Calculators', icon: 'Calculator' }
    ],
    content: [
      {
        title: 'Clinical Refresher: Voice',
        overview: {
          definition: 'Voice disorders occur when vocal quality, pitch, and loudness differ or are inappropriate for an individual\'s age, gender, cultural background, or geographic location.',
          presentation: 'Hoarseness, breathiness, vocal fatigue, reduced pitch range, aphonia (loss of voice), or pain during phonation.',
          causes: 'Functional (vocal abuse/misuse), organic (nodules, polyps, cysts, laryngitis), or neurogenic (vocal fold paralysis, spasmodic dysphonia).',
          lookOutFor: 'Persistent hoarseness (>2 weeks) requiring ENT referral, throat clearing, and the impact of reflux (LPR) on vocal fold health.'
        }
      },
      {
        title: 'Assessment Protocols',
        items: [
          { title: 'CAPE-V', description: 'Consensus Auditory-Perceptual Evaluation of Voice (ASHA Portal).', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/voice-disorders/', confidenceScore: 5 },
          { title: 'VHI-10', description: 'Voice Handicap Index (ASHA Portal).', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/voice-disorders/', confidenceScore: 5 },
          { title: 'Reflux Symptom Index (RSI)', description: 'Screening for Laryngopharyngeal Reflux.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Therapy Techniques',
        items: [
          { title: 'Vocal Function Exercises', description: 'Strengthening and coordinating laryngeal musculature.', type: 'internal', confidenceScore: 5 },
          { title: 'Resonant Voice Therapy', description: 'Focusing on oral vibratory sensations.', type: 'internal', confidenceScore: 4 },
          { title: 'Circumlaryngeal Massage', description: 'Reducing laryngeal tension.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Neurogenic Voice Disorders',
        items: [
          { title: 'Vocal Fold Paralysis Management', description: 'Surgical vs. behavioral interventions.', type: 'internal', confidenceScore: 5 },
          { title: 'Spasmodic Dysphonia', description: 'Botox protocols and voice therapy.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Organic & Functional',
        items: [
          { title: 'Muscle Tension Dysphonia', description: 'Laryngeal reposturing and relaxation.', type: 'internal', confidenceScore: 5 },
          { title: 'Vocal Fold Lesions', description: 'Pre- and post-surgical voice therapy.', type: 'internal', confidenceScore: 4 }
        ]
      }
    ]
  },
  {
    id: 'three-way-eval',
    title: 'Three-Way Evaluation',
    icon: ClipboardList,
    description: 'Integrated evaluation for Dysphagia, Cognition, and Communication.',
    color: 'bg-blue-900/30 text-blue-400 border-blue-500/20',
    content: [
      {
        title: 'Integrated Assessment',
        items: [
          { title: 'Three-Way Eval Protocol', description: 'Standardized approach for multi-domain evaluations.', type: 'tool', confidenceScore: 5 },
          { title: 'Goal Integration', description: 'How to write goals that span multiple domains.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Clinical Rationale',
        overview: {
          definition: 'The Three-Way Evaluation (Triple Eval) is a comprehensive intake process used primarily in SNF and acute rehab settings to establish baselines across the three primary SLP domains: Swallowing, Cognition, and Communication.',
          presentation: 'Indicated for patients with complex neurological presentations (e.g., CVA, TBI, Advanced Neurodegenerative Disease) where deficits in one domain likely impact performance in others.',
          causes: 'Neurological insult, multisystem failure, or complex geriatric presentation.',
          lookOutFor: 'Cognitive-swallow interactions (e.g., impulsivity during PO intake) and language-cognition overlaps (e.g., aphasia masking cognitive scores).'
        }
      }
    ]
  },
  {
    id: 'fluency',
    title: 'Fluency',
    icon: Waves,
    description: 'Adult neurogenic stuttering and cluttering assessment and treatment strategies.',
    color: 'bg-teal-50 text-teal-700',
    component: 'SubspecialtyDetail',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    content: [
      {
        title: 'Clinical Refresher: Adult Fluency',
        overview: {
          definition: 'Adult fluency disorders include neurogenic stuttering (acquired post-stroke/TBI) and cluttering (rapid/irregular speech rate with reduced intelligibility).',
          presentation: 'Repetitions, prolongations, blocks, and secondary behaviors; for cluttering: excessive disfluencies, rapid/irregular rate, and poor self-awareness.',
          causes: 'Neurogenic: CVA, TBI, neurodegenerative disease. Cluttering: complex, often comorbid with other neurodevelopmental/acquired conditions.',
          lookOutFor: 'The affective/cognitive components (fear, avoidance, frustration) which are often more debilitating than the surface behaviors.'
        }
      },
      {
        title: 'Assessment',
        items: [
          { title: 'SSI-4', description: 'Stuttering Severity Instrument (Adult version).', type: 'external', url: 'https://www.proedinc.com/', confidenceScore: 5 },
          { title: 'OASES-A', description: 'Overall Assessment of the Speaker\'s Experience of Stuttering (Adult).', type: 'external', url: 'https://www.pearsonassessments.com/', confidenceScore: 5 },
          { title: 'Speech Rate Analysis', description: 'Objective measurement of syllables per minute.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Treatment',
        items: [
          { title: 'Rate Control', description: 'Pausing and slowing speech rate.', type: 'internal', confidenceScore: 5 },
          { title: 'Easy Onset', description: 'Gentle initiation of phonation.', type: 'internal', confidenceScore: 4 },
          { title: 'Desensitization', description: 'Reducing fear and avoidance.', type: 'internal', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'cog-comm',
    title: 'Cognitive-Communication',
    icon: Brain,
    description: 'Executive function, memory, and attention training for TBI, stroke, and dementia.',
    color: 'bg-violet-50 text-violet-700',
    component: 'CognitiveModule',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    relatedTools: [
      { id: 'aphasia-tools', title: 'Aphasia Tools', icon: 'MessageSquare' },
      { id: 'goal-generator', title: 'Goal Generator', icon: 'Target' },
      { id: 'treatment-ideas', title: 'Treatment Ideas', icon: 'Lightbulb' }
    ],
    content: [
      {
        title: 'Clinical Refresher: Cognitive-Communication',
        overview: {
          definition: 'Cognitive-communication disorders encompass difficulties with any aspect of communication that is affected by disruption of cognition (attention, memory, executive function).',
          presentation: 'Difficulty following multi-step directions, poor topic maintenance, memory deficits, impaired problem-solving, and reduced social pragmatics.',
          causes: 'Traumatic Brain Injury (TBI), Right Hemisphere Stroke, Dementia (Alzheimer\'s, Lewy Body, Vascular), and Encephalopathy.',
          lookOutFor: 'Safety awareness deficits, impulsivity, confabulation, and the impact of environmental distractions on task performance.'
        }
      },
      {
        title: 'Clinical Refresher: Dementia',
        overview: {
          definition: 'Dementia is a general term for loss of memory, language, problem-solving and other thinking abilities that are severe enough to interfere with daily life.',
          presentation: 'Progressive memory loss, disorientation, personality changes, difficulty with complex tasks, and eventual loss of functional communication.',
          causes: 'Alzheimer\'s Disease (most common), Vascular Dementia, Lewy Body Dementia, and Frontotemporal Dementia.',
          lookOutFor: 'The "sundowning" effect, changes in appetite/swallowing as the disease progresses, and the importance of environmental modification.'
        }
      },
      {
        title: 'Intervention Strategies',
        groups: [
          {
            title: 'Memory Training',
            items: [
              { title: 'Spaced Retrieval Training (SRT)', description: 'Memory training for functional information.', type: 'tool', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800', confidenceScore: 5 },
              { title: 'Errorless Learning', description: 'Minimizing mistakes during the learning process.', type: 'internal', confidenceScore: 5 },
              { title: 'Dementia: Learning & Memory', type: 'internal', pacific coastId: 'dementia-learning-memory', description: 'SRT and procedural memory strategies.', confidenceScore: 5 }
            ]
          },
          {
            title: 'Executive Function',
            items: [
              { title: 'Metacognitive Strategy Training', description: 'Improving self-monitoring and executive function.', type: 'internal', confidenceScore: 4 }
            ]
          }
        ]
      },
      {
        title: 'Cognitive Screening',
        items: [
          { title: 'MoCA (Montreal Cognitive Assessment)', description: 'Rapid screening for mild cognitive impairment.', type: 'external', url: 'https://www.mocatest.org/', confidenceScore: 5 },
          { title: 'SLUMS Examination', description: 'Saint Louis University Mental Status.', type: 'external', url: 'https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/slums-exam.php', confidenceScore: 4 },
          { title: 'BCAT (Brief Cognitive Assessment Tool)', description: 'Multi-domain cognitive screening.', type: 'external', url: 'https://www.thebcat.com/', confidenceScore: 4 },
          { title: 'CLQT+ (Cognitive Linguistic Quick Test)', description: 'Brief assessment of attention, memory, executive functions.', type: 'external', url: 'https://www.pearsonassessments.com/', confidenceScore: 5 },
          { title: 'Cognitively Impaired: SLP Role', type: 'internal', pacific coastId: 'cog-impaired-slp', description: 'Skilled interventions and diagnostic coding.', confidenceScore: 5 },
          { title: 'Cognitive Performance Assessment (96125)', type: 'internal', pacific coastId: 'cog-perf-96125', description: 'Standardized testing requirements and billing.', confidenceScore: 5 }
        ]
      },
      {
        title: 'Functional Therapy Tasks',
        items: [
          { title: 'Medication Management', description: 'Organizing and scheduling medications.', type: 'internal', confidenceScore: 5 },
          { title: 'Financial Management', description: 'Checkbook balancing and bill paying tasks.', type: 'internal', confidenceScore: 5 },
          { title: 'Calendar & Scheduling', description: 'Managing appointments and deadlines.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'Spaced Retrieval Training (SRT) for Dementia',
            pdfUrl: 'https://pubmed.ncbi.nlm.nih.gov/11469351/',
            summary: 'Memory training technique using increasing intervals of recall.',
            testing: 'Clinical trial with individuals with Alzheimer\'s disease.',
            results: 'Improved recall of functional information and reduced caregiver burden.',
            indications: 'Memory impairment in early to mid-stage dementia.',
            limitations: 'Requires consistent implementation and specific target information.'
          }
        ]
      }
    ]
  },
  {
    id: 'trach-vent',
    title: 'Trach & Vent',
    icon: Wind,
    description: 'Anatomy, speaking valves, and weaning protocols for medically complex patients.',
    color: 'bg-cyan-50 text-cyan-700',
    component: 'TrachVentGuide',
    content: [
      {
        title: 'Clinical Refresher: Trach & Vent',
        overview: {
          definition: 'Management of patients with artificial airways (tracheostomies) and those requiring mechanical ventilation, focusing on communication and swallow safety.',
          presentation: 'Inability to vocalize without specialized valves, increased secretions, reduced subglottic pressure, and potential for "vent-swallow" dyssynchrony.',
          causes: 'Respiratory failure, upper airway obstruction, prolonged intubation, and neuromuscular weakness requiring long-term ventilation.',
          lookOutFor: 'Cuff status (inflated vs. deflated), tolerance of speaking valves (Passy-Muir), oxygen saturation levels, and secretion management abilities.'
        }
      },
      {
        title: 'Clinical Fundamentals',
        items: [
          { title: 'Tracheostomy 101 Guide', type: 'internal', pacific coastId: 'tracheostomy-101', description: 'Terminology, anatomy, and decannulation.', image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800', confidenceScore: 5 },
          { title: 'Ventilators 101 & 102', type: 'internal', pacific coastId: 'ventilators-basics', description: 'Terminology and ventilation modes.', confidenceScore: 5 },
          { title: 'Speaking Valves: Clinical Benefits', type: 'internal', pacific coastId: 'speaking-valve-clinical', description: 'Swallowing benefits and safety rules.', confidenceScore: 5 },
          { title: 'Starting a Tracheostomy Team', type: 'internal', pacific coastId: 'trach-team-guide', description: 'Multidisciplinary team objectives and procedures.', confidenceScore: 4 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'Impact of Speaking Valves on Swallowing Physiology',
            pdfUrl: 'https://pubmed.ncbi.nlm.nih.gov/11469351/',
            summary: 'Study on how Passy-Muir valves affect subglottic pressure and aspiration.',
            testing: 'Manometric and videofluoroscopic evaluation of 20 patients.',
            results: 'Restoration of subglottic pressure significantly reduced aspiration frequency.',
            indications: 'Tracheostomized patients with dysphagia.',
            limitations: 'Small cohort, varied underlying etiologies.'
          }
        ]
      }
    ]
  },
  {
    id: 'stroke-anatomy',
    title: 'Stroke Anatomy',
    icon: Brain,
    description: 'Interactive 3D explorer of vascular territories and their clinical sequelae.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'BrainAnatomyExplorer',
    content: []
  },
  {
    id: 'anatomy-lab',
    title: 'Anatomy Lab',
    icon: Stethoscope,
    description: 'Interactive anatomical modules for patient education and clinical review.',
    color: 'bg-teal-50 text-teal-700',
    component: 'AnatomyLab',
    content: [
      {
        title: 'Modules',
        items: [
          { title: 'Laryngeal Anatomy', description: 'Cartilages, muscles, and innervation.', type: 'internal', image: 'https://picsum.photos/seed/larynx/800/600', confidenceScore: 5 },
          { title: 'Pharyngeal Phase', description: 'Dynamic review of pharyngeal swallow.', type: 'internal', image: 'https://picsum.photos/seed/pharynx/800/600', confidenceScore: 5 },
          { title: 'Neuroanatomy for SLPs', description: 'Cranial nerves and cortical language centers.', type: 'internal', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'aac-hub',
    title: 'AAC Hub',
    icon: MessageSquare,
    description: 'Augmentative and Alternative Communication resources and funding guides.',
    color: 'bg-fuchsia-50 text-fuchsia-700',
    component: 'AACModule',
    content: [
      {
        title: 'Clinical Refresher: AAC',
        overview: {
          definition: 'Augmentative and Alternative Communication (AAC) includes all forms of communication (other than oral speech) that are used to express thoughts, needs, wants, and ideas.',
          presentation: 'Inability to meet daily communication needs through natural speech alone, often seen in severe aphasia, ALS, cerebral palsy, or TBI.',
          causes: 'Congenital (CP, autism) or acquired (ALS, Stroke, TBI, Parkinson\'s) conditions that impair the ability to produce functional speech.',
          lookOutFor: 'The need for multimodal communication (gestures, symbols, devices), the importance of partner training, and the dynamic nature of AAC needs as conditions change.'
        }
      },
      {
        title: 'Funding & Procurement',
        items: [
          { title: 'Medicare Funding Guide (PDF)', description: 'Step-by-step SER process.', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/aac/', confidenceScore: 5 },
          { title: 'AAC Evaluation Template', description: 'Standardized report components.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Device Resources',
        items: [
          { title: 'Tobii Dynavox Support', type: 'external', url: 'https://www.tobiidynavox.com/', confidenceScore: 5 },
          { title: 'PRC-Saltillo Training', type: 'external', url: 'https://www.prentrom.com/', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'case-brainstorm',
    title: 'Case Brainstorm',
    icon: Users,
    description: 'Anonymous, PHI-free clinical discussion and peer brainstorming.',
    color: 'bg-emerald-50 text-emerald-700',
    component: 'CaseBrainstorm',
    content: [
      {
        title: 'How to Brainstorm Cases',
        overview: {
          definition: 'A structured approach to discussing complex cases while maintaining strict PHI anonymity.',
          presentation: 'Use this space to present clinical dilemmas, diagnostic challenges, or treatment planning questions.',
          causes: 'Complex comorbidities, lack of progress, or conflicting clinical recommendations.',
          lookOutFor: 'Ensure NO PHI is included. Use generic descriptors (e.g., "70yo male s/p CVA").'
        }
      },
      {
        title: 'Case Presentation Template',
        items: [
          { title: 'Case Summary Template', description: 'Structured format for anonymous case presentation.', type: 'internal', confidenceScore: 5 },
          { title: 'Diagnostic Dilemma Form', description: 'Template for presenting diagnostic challenges.', type: 'internal', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'clinical-pathways',
    title: 'Clinical Pathways',
    icon: Route,
    description: 'Symptom-based decision support and clinical algorithms.',
    color: 'bg-sky-50 text-sky-700',
    component: 'ClinicalPathways',
    content: [
      {
        title: 'Using Clinical Pathways',
        overview: {
          definition: 'Clinical pathways are evidence-based, multidisciplinary plans of care that outline the expected course of treatment for a specific condition.',
          presentation: 'Standardized algorithms to guide clinical decision-making and ensure consistency in care.',
          causes: 'Reducing practice variation and improving patient outcomes.',
          lookOutFor: 'Pathways are guides, not mandates. Always use clinical judgment for individual patient needs.'
        }
      },
      {
        title: 'Authoritative Pathways',
        items: [
          { title: 'ASHA Practice Portal', description: 'Evidence-based clinical topics.', type: 'external', url: 'https://www.asha.org/practice-portal/', confidenceScore: 5 },
          { title: 'CMS Clinical Guidelines', description: 'Medicare coverage and clinical standards.', type: 'external', url: 'https://www.cms.gov/', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'regulatory-navigator',
    title: 'Regulatory Navigator',
    icon: ShieldCheck,
    description: 'Comprehensive guide to Medicare billing, PDPM compliance, and documentation review.',
    color: 'bg-slate-50 text-slate-700',
    component: 'MedicareHelper',
    content: [
      {
        title: 'Medicare & Billing',
        items: [
          { title: 'PDPM Drivers', description: 'Understanding payment models.', type: 'internal', confidenceScore: 5 },
          { title: 'CPT Codes', description: 'Common SLP billing codes.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Sources of Truth (External)',
        items: [
          { title: 'Medicare Benefit Policy Manual, Chapter 15', description: 'Covered medical and other health services.', type: 'external', url: 'https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/Downloads/bp102c15.pdf', confidenceScore: 5 },
          { title: 'Jimmo v. Sebelius Settlement', description: 'Skilled maintenance vs. restorative care.', type: 'external', url: 'https://www.cms.gov/medicare/medicare-fee-for-service-payment/snfpps/jimmo_settlement', confidenceScore: 5 },
          { title: 'CMS & MAC Guidelines (Noridian)', description: 'Billing and coverage determinations.', type: 'external', url: 'https://medicare.noridianmedicare.com/', confidenceScore: 5 },
          { title: 'Code of Federal Regulations (CFRs)', description: 'Legal framework for SNFs (42 CFR Part 483).', type: 'external', url: 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-483', confidenceScore: 5 }
        ]
      },
      {
        title: 'Compliance & Quality',
        items: [
          { title: 'Documentation Requirements', description: 'Defensible documentation standards.', type: 'internal', confidenceScore: 5 },
          { title: 'HIPAA Guidelines', description: 'Privacy and security.', type: 'internal', confidenceScore: 5 },
          { title: 'Documentation Review Checklist', description: 'Ready for review.', type: 'internal', confidenceScore: 4 }
        ]
      }
    ]
  },
  {
    id: 'part-b-checker',
    title: 'Part B Checker',
    icon: ShieldCheck,
    description: 'Expert Medicare Part B compliance audit and candidacy screening tool.',
    color: 'bg-emerald-50 text-emerald-700',
    component: 'MedicareDocChecker',
    content: []
  },
  {
    id: 'documentation-studio',
    title: 'Documentation Studio',
    icon: ClipboardList,
    description: 'AI-powered clinical documentation support for evaluations, notes, and goals.',
    color: 'bg-blue-50 text-blue-700',
    component: 'DocumentationStudio',
    content: []
  },
  {
    id: 'goal-generator',
    title: 'Goal Bank Generator',
    icon: Target,
    description: 'AI-powered SMART goal generation for various clinical domains.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'GoalGenerator',
    content: []
  },
  {
    id: 'handout-maker',
    title: 'Handout Studio',
    icon: FileText,
    description: 'AI-powered generation of patient and family education materials.',
    color: 'bg-amber-50 text-amber-700',
    component: 'HandoutMaker',
    content: []
  },
  {
    id: 'medical-diagnostics',
    title: 'Labs, Imaging & Meds',
    icon: FlaskConical,
    description: 'Pharmacology, lab values, and medical imaging interpretation for SLPs.',
    color: 'bg-red-50 text-red-700',
    component: 'ClinicalMeds',
    content: [
      {
        title: 'Clinical Refresher: Head & Neck Cancer',
        overview: {
          definition: 'Head and Neck Cancer (HNC) refers to a group of biologically similar cancers that start in the lip, oral cavity, nasal cavity, paranasal sinuses, pharynx, and larynx.',
          presentation: 'Persistent sore throat, difficulty swallowing, voice changes (hoarseness), a lump in the neck, or unexplained weight loss.',
          causes: 'Tobacco use, excessive alcohol consumption, and Human Papillomavirus (HPV) infection (especially for oropharyngeal cancers).',
          lookOutFor: 'Radiation-induced fibrosis, trismus (limited jaw opening), xerostomia (dry mouth), and the late effects of radiation on swallowing (LPRD).'
        }
      },
      {
        title: 'Pharmacology',
        items: [
          { title: 'Meds that Affect Swallowing', description: 'Xerostomia, tardive dyskinesia, and sedation.', type: 'internal', confidenceScore: 5 },
          { title: 'Anti-Psychotics & Cognition', description: 'Impact on attention and processing speed.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Lab Values',
        items: [
          { title: 'WBC & Infection', description: 'Indicators for pneumonia or sepsis.', type: 'internal', confidenceScore: 5 },
          { title: 'Sodium & Hydration', description: 'Hypernatremia and dehydration risks.', type: 'internal', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'hnc',
    title: 'Head & Neck Cancer',
    icon: Stethoscope,
    description: 'Management of dysphagia, trismus, and communication changes post-radiation/surgery.',
    color: 'bg-orange-50 text-orange-700',
    component: 'SubspecialtyDetail',
    image: 'https://picsum.photos/seed/medical-neck/800/600',
    content: [
      {
        title: 'Clinical Refresher: HNC',
        overview: {
          definition: 'Head and Neck Cancer (HNC) involves malignancies of the oral cavity, pharynx, larynx, nasal cavity, or salivary glands. Treatment often involves surgery, radiation (RT), and/or chemotherapy (CRT).',
          presentation: 'Dysphagia, odynophagia (pain), mucositis, xerostomia (dry mouth), trismus (reduced jaw opening), lymphedema, and fibrosis.',
          causes: 'Tobacco/alcohol use, HPV (Human Papillomavirus - specifically p16+ oropharyngeal cancer), EBV.',
          lookOutFor: 'Late-effect radiation fibrosis (can occur years later), osteoradionecrosis, and aspiration pneumonia risk.'
        }
      },
      {
        title: 'Assessment',
        items: [
          { title: 'M.D. Anderson Dysphagia Inventory', acronym: 'MDADI', description: 'Gold standard QoL measure for HNC dysphagia.', type: 'external', url: 'https://www.mdanderson.org/research/departments-labs-institutes/departments-divisions/head-and-neck-surgery/digest.html', confidenceScore: 5 },
          { title: 'Mann Assessment of Swallowing Ability - Cancer', acronym: 'MASA-C', description: 'Validated bedside swallow exam for HNC.', type: 'external', url: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/', confidenceScore: 5 },
          { title: 'Trismus Measurement', description: 'Interincisal distance (normal >35mm).', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Treatment & Rehabilitation',
        items: [
          { title: 'Pharyngocise', description: 'Prophylactic exercises during CRT to preserve muscle function.', type: 'internal', confidenceScore: 5 },
          { title: 'Myofascial Release', description: 'Manual therapy for radiation fibrosis (requires training).', type: 'internal', confidenceScore: 4 },
          { title: 'Trismus Therapy', description: 'Jaw stretching (TheraBite, stacked tongue depressors).', type: 'internal', confidenceScore: 5 },
          { title: 'Lymphedema Management', description: 'Complete Decongestive Therapy (CDT) for HNL.', type: 'internal', confidenceScore: 4 }
        ]
      },
      {
        title: 'Trismus Tracker',
        items: [
          { title: 'Monitor interincisal opening (MIO) for HNC patients.', type: 'tool', confidenceScore: 5 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'Prophylactic Swallowing Exercises in Patients with Head and Neck Cancer',
            pdfUrl: '#',
            summary: 'Investigation of "Pharyngocise" protocol during radiation therapy.',
            testing: 'Randomized controlled trial comparing prophylactic exercise to usual care.',
            results: 'Exercise group maintained better muscle structure and swallowing function post-treatment.',
            indications: 'Patients undergoing CRT for pharyngeal/laryngeal cancers.',
            limitations: 'Adherence to high-intensity protocol can be challenging.'
          },
          {
            title: 'The M.D. Anderson Dysphagia Inventory: A Validation Study',
            pdfUrl: '#',
            summary: 'Development and validation of a HNC-specific QoL questionnaire.',
            testing: 'Psychometric analysis of the MDADI in 100 patients.',
            results: 'High reliability and validity for assessing dysphagia impact in HNC.',
            indications: 'Measuring patient-reported outcomes in HNC population.',
            limitations: 'Self-report measure, does not replace physiological assessment.'
          }
        ]
      }
    ]
  },
  {
    id: 'palliative',
    title: 'Palliative & Hospice',
    icon: HeartHandshake,
    description: 'End-of-life swallowing management, advanced directives, and quality of life focus.',
    color: 'bg-slate-50 text-slate-700',
    component: 'SubspecialtyDetail',
    image: 'https://picsum.photos/seed/hospice-care/800/600',
    content: [
      {
        title: 'Clinical Refresher: Palliative Care',
        overview: {
          definition: 'Palliative care focuses on relief from symptoms and stress of serious illness. Hospice is specific to terminal illness with <6 months prognosis.',
          presentation: 'Progressive dysphagia, anorexia-cachexia syndrome, secretion management issues ("death rattle"), and communication barriers.',
          causes: 'End-stage dementia, cancer, ALS, Parkinson\'s, organ failure.',
          lookOutFor: 'The shift from "rehabilitation" to "compensation/comfort". Ethics of artificial nutrition vs. careful hand feeding.'
        }
      },
      {
        title: 'Key Concepts',
        items: [
          { title: 'Starvation vs. Dehydration', description: 'Natural dying process releases endorphins; artificial hydration may increase secretions/edema.', type: 'internal', confidenceScore: 5 },
          { title: 'Careful Hand Feeding', description: 'Comfort feeding technique despite aspiration risk.', type: 'internal', confidenceScore: 5 },
          { title: 'Advanced Directives', description: 'POLST, Living Will, Power of Attorney.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Management Strategies',
        items: [
          { title: 'Taste for Pleasure', description: 'Oral care with favorite flavors (e.g., wine, chocolate) for QoL.', type: 'internal', confidenceScore: 5 },
          { title: 'Secretion Management', description: 'Positioning, anticholinergics (scopolamine), suctioning.', type: 'internal', confidenceScore: 4 },
          { title: 'AAC for End of Life', description: 'Eye gaze, letter boards, "legacy" messages.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Research Paper Archives',
        researchArchives: [
          {
            title: 'Artificial Nutrition and Hydration in Advanced Dementia',
            pdfUrl: '#',
            summary: 'Review of evidence regarding PEG tubes in advanced dementia.',
            testing: 'Systematic review of outcomes (survival, aspiration pneumonia, QoL).',
            results: 'PEG tubes do not prolong life, prevent aspiration, or improve comfort in advanced dementia.',
            indications: 'Advanced dementia with dysphagia.',
            limitations: 'Observational studies; ethical constraints on RCTs.'
          },
          {
            title: 'Careful Hand Feeding: A Reasonable Alternative to PEG',
            pdfUrl: '#',
            summary: 'Comparison of careful hand feeding vs. tube feeding.',
            testing: 'Clinical outcomes and comfort measures.',
            results: 'Hand feeding is associated with fewer complications and better QoL.',
            indications: 'End-stage disease with intake difficulties.',
            limitations: 'Requires significant staff/caregiver time and training.'
          }
        ]
      }
    ]
  },
  {
    id: 'progress-tracker',
    title: 'Progress Tracker',
    icon: TrendingUp,
    description: 'Visualize patient progress over time.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'ProgressTracker',
    content: []
  },
  {
    id: 'nethealth-help',
    title: 'NetHealth Mastery',
    icon: Monitor,
    description: 'Comprehensive NetHealth documentation guides, performance keys, and troubleshooting.',
    color: 'bg-slate-50 text-slate-700',
    component: 'NetHealthHelp',
    content: [
      {
        title: 'Performance Keys',
        items: [
          { title: 'Levels of Performance: Cognitive', description: 'Independent to Profound definitions for problem solving and memory.', type: 'internal', confidenceScore: 5 },
          { title: 'Levels of Performance: Communication', description: 'Independence levels for Voice, Auditory Comp, Expression, and Motor Speech.', type: 'internal', confidenceScore: 5 },
          { title: 'Levels of Performance: Swallowing', description: 'Independence levels and assistance requirements for oral intake.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Workflow Guides',
        items: [
          { title: 'Completing an Evaluation', description: 'Step-by-step guide for Rehab Optima evaluations.', type: 'internal', confidenceScore: 5 },
          { title: 'Daily Activity Log & Encounter Notes', description: 'Creating treatment encounter notes and logging sessions.', type: 'internal', confidenceScore: 5 },
          { title: 'Adding a Second Evaluation', description: 'Protocol for adding cognitive goals to an existing dysphagia track.', type: 'internal', confidenceScore: 5 },
          { title: 'Recertification & Discharge', description: 'Guidelines for updating goals and finalizing therapy tracks.', type: 'internal', confidenceScore: 5 }
        ]
      },
      {
        title: 'Troubleshooting & Tips',
        items: [
          { title: 'NetHealth Errors: Tips & Tricks', description: 'Common error codes and how to resolve them.', type: 'internal', confidenceScore: 5 },
          { title: 'Eval Only Tips', description: 'Opening and managing Eval Only documents and tracks.', type: 'internal', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'pacific coast-slp-corner',
    title: 'Pacific Coast SLP Corner',
    icon: Library,
    description: 'Exclusive clinical resources, program development guides, and updates for Pacific Coast SLPs.',
    color: 'bg-slate-900 text-white',
    component: 'Pacific CoastSLPCorner',
    content: []
  },
  {
    id: 'clinical-library',
    title: 'Clinical Library (RAG)',
    icon: Library,
    description: 'Ingest and search your clinical PDFs for grounded AI responses.',
    color: 'bg-emerald-50 text-emerald-700',
    component: 'ClinicalLibrary',
    content: [
      {
        title: 'Resource Library',
        items: [
          { title: 'Clinical WhatsApp Chat', description: 'Quick access to clinical experts.', type: 'external', url: 'https://chat.whatsapp.com/HR8gVzfzF1S4SNcAGZ58kd', confidenceScore: 5 }
        ]
      }
    ]
  },
  {
    id: 'therapy-studio',
    title: 'Therapy Studio',
    icon: Puzzle,
    description: 'Build and play interactive cognitive, speech, and language activities.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'TherapyStudio',
    content: []
  },
  {
    id: 'slp-corner',
    title: 'The SLP Lounge',
    icon: Coffee,
    description: 'Blogs, podcasts, news, CEUs, and community resources.',
    color: 'bg-pink-50 text-pink-700',
    component: 'SLPLife',
    image: 'https://picsum.photos/seed/slp-community/800/600',
    content: [
      {
        title: 'Professional Communities',
        items: [
          { title: 'SLP Group Chat', description: 'Join our internal clinical community.', type: 'internal', confidenceScore: 5 },
          { title: 'Clinical WhatsApp Chat', description: 'Real-time clinical support and networking.', type: 'external', url: 'https://chat.whatsapp.com/HR8gVzfzF1S4SNcAGZ58kd', confidenceScore: 5 },
          { title: 'MedSLP Collective', description: 'Evidence-based resources and community.', type: 'external', url: 'https://medslpcollective.com/', confidenceScore: 5 },
          { title: 'The Informed SLP', description: 'Research reviews for clinicians.', type: 'external', url: 'https://www.theinformedslp.com/', confidenceScore: 5 },
          { title: 'STEP Community', description: 'Swallowing Training and Education Portal.', type: 'external', url: 'https://www.stepcommunity.com/', confidenceScore: 5 }
        ]
      },
      {
        title: 'Blogs & Resources',
        items: [
          { title: 'Tactus Therapy Blog', description: 'Practical treatment ideas and apps.', type: 'external', url: 'https://tactustherapy.com/blog/', confidenceScore: 4 },
          { title: 'Honeycomb Speech Therapy', description: 'Functional therapy ideas.', type: 'external', url: 'https://honeycombspeechtherapy.com/', confidenceScore: 4 },
          { title: 'SpeechPathology.com', description: 'CEUs and articles.', type: 'external', url: 'https://www.speechpathology.com/', confidenceScore: 4 }
        ]
      },
      {
        title: 'Podcasts',
        items: [
          { title: 'Swallow The Gap', description: 'By Tim Stockdale.', type: 'external', url: 'https://swallowthegap.com/', confidenceScore: 5 },
          { title: 'Swallow Your Pride', description: 'Dysphagia podcast.', type: 'external', url: 'https://podcast.speechtherapypd.com/swallowyourpride', confidenceScore: 4 },
          { title: 'Speech Uncensored', description: 'Medical SLP topics.', type: 'external', url: 'https://www.speechuncensored.com/', confidenceScore: 4 },
          { title: 'Down the Hatch', description: 'Swallowing podcast.', type: 'external', url: 'https://www.dysphagiacafe.com/down-the-hatch-podcast/', confidenceScore: 4 }
        ]
      },
      {
        title: 'ASHA Resources',
        items: [
          { title: 'ASHA Practice Portal', description: 'Clinical topics and evidence.', type: 'external', url: 'https://www.asha.org/practice-portal/', confidenceScore: 5 },
          { title: 'ASHA Evidence Maps', description: 'Searchable evidence database.', type: 'external', url: 'https://www.asha.org/evidence-maps/', confidenceScore: 5 },
          { title: 'ASHA SIGs', description: 'Special Interest Groups.', type: 'external', url: 'https://www.asha.org/sig/', confidenceScore: 5 }
        ]
      },
      {
        title: 'Treatment Ideas',
        items: [
          { title: 'Pinterest Therapy Ideas', description: 'Visual inspiration for therapy.', type: 'external', url: 'https://www.pinterest.com/search/pins/?q=speech%20therapy%20adults', confidenceScore: 3 },
          { title: 'YouTube: Swallow Studies', description: 'Video examples of MBSS/FEES.', type: 'external', url: 'https://www.youtube.com/results?search_query=mbss+swallow+study', confidenceScore: 3 }
        ]
      }
    ]
  },
  {
    id: 'clinical-calculators',
    title: 'Clinical Calculators',
    icon: Calculator,
    description: 'Interactive scoring for MoCA, GDS, WAB-R, and other standardized assessments.',
    color: 'bg-teal-50 text-teal-700',
    component: 'ClinicalCalculators',
    content: []
  },
  {
    id: 'pdf-library',
    title: 'PDF Resource Vault',
    icon: BookOpen,
    description: 'Quick access to assessments, handouts, and clinical protocols.',
    color: 'bg-indigo-50 text-indigo-700',
    component: 'PDFLibrary',
    content: []
  },
  {
    id: 'dysphagia-eval',
    title: 'Dysarthria Evaluation',
    icon: Activity,
    description: 'Interactive Perceptual Dysarthria Evaluation form.',
    color: 'bg-emerald-50 text-emerald-700',
    component: 'DysarthriaEval',
    content: []
  },
  {
    id: 'treatment-ideas',
    title: 'SLP Treatment Ideas',
    icon: BookOpenCheck,
    description: 'Evidence-based activities and protocols for clinical practice.',
    color: 'bg-blue-50 text-blue-700',
    component: 'TreatmentIdeas',
    content: []
  }
];

// Runtime validation for duplicate IDs
if (process.env.NODE_ENV !== 'production') {
  const ids = new Set<string>();
  const duplicates = new Set<string>();

  SLP_DATA.forEach(category => {
    if (ids.has(category.id)) {
      duplicates.add(category.id);
    }
    ids.add(category.id);
  });

  if (duplicates.size > 0) {
    console.error(
      `[SLP_DATA] Duplicate IDs found: ${Array.from(duplicates).join(', ')}. ` +
      'Each category must have a unique ID.'
    );
  }
}

