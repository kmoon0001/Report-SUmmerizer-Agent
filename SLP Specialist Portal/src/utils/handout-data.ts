import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  AlertCircle, 
  Users, 
  Home, 
  Stethoscope 
} from 'lucide-react';

export const HANDOUT_TYPES = [
  { id: 'therapy', title: 'Therapy Protocol', icon: Heart, description: 'Customized therapy activities and rationale.' },
  { id: 'exercise', title: 'Exercise Guide', icon: Activity, description: 'Step-by-step instructions for specific exercises.' },
  { id: 'strategies', title: 'Compensatory Strategies', icon: ShieldAlert, description: 'Safe swallowing and communication strategies.' },
  { id: 'precautions', title: 'Aspiration Precautions', icon: AlertCircle, description: 'Safety guidelines for eating and drinking.' },
  { id: 'family-info', title: 'Caregiver Education', icon: Users, description: 'Educational materials for caregivers and family.' },
  { id: 'hep', title: 'Home Program (HEP)', icon: Home, description: 'Daily routine for patients to follow at home.' },
  { id: 'clinician', title: 'Clinical Protocol', icon: Stethoscope, description: 'Technical guides and protocols for SLPs.' },
];

export const SUBSPECIALTIES = [
  'Dysphagia - Oropharyngeal',
  'Dysphagia - Esophageal',
  'Dysphagia - Oral Care',
  'Aphasia - Expressive',
  'Aphasia - Receptive',
  'Aphasia - Global',
  'Cognition - Memory',
  'Cognition - Attention',
  'Cognition - Executive Function',
  'Cognition - Safety Awareness',
  'Dysarthria',
  'Voice - Parkinson\'s',
  'Voice - Presbyphonia',
  'Voice - Vocal Fold Nodules',
  'Voice - Muscle Tension Dysphonia',
  'Trach & Vent - Speaking Valve',
  'Trach & Vent - Suctioning',
  'Head & Neck Cancer - Radiation Fibrosis',
  'Head & Neck Cancer - Total Laryngectomy',
  'Social Communication',
  'Fluency'
];

export const AUTHORITATIVE_SOURCES = [
  { name: "ASHA Practice Portal", url: "https://www.asha.org/practice-portal/" },
  { name: "MedlinePlus (Patient Ed)", url: "https://medlineplus.gov/" },
  { name: "NIDCD Information", url: "https://www.nidcd.nih.gov/health" }
];

export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'es', title: 'Spanish' },
  { id: 'zh', title: 'Mandarin' },
  { id: 'ko', title: 'Korean' },
  { id: 'fa', title: 'Farsi' },
  { id: 'tl', title: 'Tagalog' },
  { id: 'vi', title: 'Vietnamese' },
  { id: 'ru', title: 'Russian' }
];
