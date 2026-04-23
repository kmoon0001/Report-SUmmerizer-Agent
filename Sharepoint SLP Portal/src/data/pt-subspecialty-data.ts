import { 
  ClipboardList, 
  Activity, 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Mic, 
  Users, 
  Stethoscope,
  Scale,
  Heart
} from 'lucide-react';
import { SubspecialtyData } from './subspecialty-data';

export const PT_SUBSPECIALTY_DATA: Record<string, SubspecialtyData> = {
  'gait-balance': {
    id: 'gait-balance',
    title: 'Gait, Balance & Fall Prevention',
    overview: {
      whatItIs: 'Physical therapy management of mobility and fall risk focusing on community-dwelling older adults (APTA 2025 CPG).',
      whyItHappens: 'Multifactorial etiologies including age-related sarcopenia, sensory processing changes (vestibular/visual), neurological disorders, and pharmacological side effects.',
      deficits: [
        'Reduced postural stability (Static/Dynamic)',
        'Impaired anticipatory postural adjustments',
        'Reduced gait speed (< 1.0 m/s)',
        'Decreased lower extremity power',
        'Impaired sensory integration (CTSIB-M)'
      ],
      symptoms: [
        'Recent history of falls or "near falls"',
        'Fear of falling leading to activity restriction',
        'Unsteady gait / wide base of support',
        'Difficulty with stair navigation',
        'Dizziness / orthostatic hypotension'
      ],
      clinicalPearl: 'The "Timed Up and Go" (TUG) is a screener, but the "Five Times Sit to Stand" (5TSTS) is a powerful predictor of lower extremity power and fall risk. A gait speed of < 0.6 m/s is highly predictive of future falls and hospitalization.',
      bestPractices: [
        'Utilize the 2025 APTA Fall Risk Management Algorithm for all adults 65+.',
        'Always perform a multifactorial assessment including vision and medication review.',
        'Exercise must be "Progressive" and "Challenging" to be effective; low-intensity walking is insufficient for fall prevention.',
        'Supervised individual PT is superior to unsupervised home programs for high-risk patients.',
        'Address environmental hazards (throw rugs, lighting) during home safety evaluations.',
        'Set functional goals that focus on "Community Participation" (e.g., walking to the mailbox safely).'
      ]
    },
    types: [
      { name: 'Mechanical / Orthopedic', description: 'Gait changes due to joint pain, range of motion, or structural issues.' },
      { name: 'Neurological / Sensory', description: 'Impairments in balance due to CNS/PNS pathology or vestibular processing.' },
      { name: 'Fear-Based / Psychosocial', description: 'Activity restriction and unsteady movement secondary to a fear of falling.' }
    ],
    assessments: [
      {
        name: 'Timed Up and Go',
        acronym: 'TUG',
        description: 'Standardized assessment of functional mobility and balance.',
        population: 'Older adults',
        time: '< 2 mins',
        cost: 'Free',
        instructions: '1. Patient starts seated in a chair. 2. On "Go", they stand up, walk 3 meters, turn, walk back, and sit down. 3. Time the effort. 4. > 12 seconds indicates increased fall risk.',
        tags: ['Screening', 'Mobility'],
        tips: [
          'Allow 1 practice trial.',
          'Instruct the patient to walk at a "comfortable but safe" pace.'
        ]
      },
      {
        name: 'Berg Balance Scale',
        acronym: 'BBS',
        description: '14-item objective measure of static and dynamic balance.',
        population: 'Stroke, Geriatrics',
        time: '15-20 mins',
        cost: 'Free',
        tags: ['Comprehensive', 'Outcome Measure'],
        whatItIs: 'Gold-standard assessment of functional balance during sitting, standing, and changing positions.',
        tips: [
          'Score 0-56. < 45 indicates high fall risk.',
          'The items "standing on one leg" and "reaching forward" are high-discriminators.'
        ]
      },
      {
        name: 'Gait Speed (10-Meter Walk Test)',
        acronym: '10MWT',
        description: 'Measures walking speed over a short distance.',
        population: 'All',
        time: '5 mins',
        cost: 'Free',
        tags: ['Vital Sign', 'Functional'],
        whatItIs: 'The "6th Vital Sign." Measures meters per second (m/s).',
        tips: [
          'Ensure a 2-meter "buffer" zone for acceleration and deceleration.',
          '< 0.8 m/s suggests a limited community ambulator.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Perturbation-Based Balance Training',
        description: 'Specific training to improve reactive postural adjustments.',
        evidenceLevel: 'High',
        candidates: 'History of falls, frequent trips.',
        instructions: 'Provide unexpected external perturbations (nudges/tugs) while the patient is standing or walking. Focus on "Catching" themselves safely.',
        tags: ['Reactive', 'Rehabilitative'],
        tips: [
          'Use a safety harness for high-risk patients.',
          'Gradually increase the force of perturbations.'
        ]
      },
      {
        name: 'High-Intensity Resistance Training (HIRT)',
        description: 'Progressive loading of lower extremity muscles (Squats, Lunges, Calf raises).',
        evidenceLevel: 'High',
        candidates: 'Sarcopenia, generalized weakness.',
        instructions: 'Load at 70-80% of 1RM (1 Rep Max). Perform 2-3 sets of 8-12 reps. Focus on power and eccentric control.',
        tags: ['Strength', 'Metabolic'],
        tips: [
          'Focus on functional movements relevant to ADLs (Sit-to-stand).',
          'Avoid "air exercises" without resistance.'
        ]
      }
    ],
    resources: [
      {
        title: 'APTA Geriatrics: Falls Prevention',
        description: '2025 Clinical Practice Guidelines.',
        type: 'Guide',
        url: 'https://www.aptageriatrics.org/'
      }
    ],
    visuals: [
      {
        title: 'Fall Risk Management Algorithm',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        description: 'Flowchart for clinical decision making based on 2025 CPG.'
      }
    ]
  },
  'pelvic-health': {
    id: 'pelvic-health',
    title: 'Pelvic Health Rehabilitation',
    overview: {
      whatItIs: 'Pelvic health physical therapy involves the evaluation and treatment of the pelvic floor muscle group and related structures addressing bladder, bowel, sexual function, and pelvic pain.',
      whyItHappens: 'Common etiologies include Pregnancy/Postpartum changes, Menopause, Prostatic surgery, Chronic Pelvis Pain Syndrome (CPPS), and Neurogenic conditions.',
      deficits: [
        'Pelvic Floor Muscle (PFM) weakness',
        'PFM overactivity',
        'Impaired PFM coordination',
        'Reduced pelvic organ support'
      ],
      symptoms: [
        'Urinary incontinence',
        'Urinary urgency and frequency',
        'Pelvic organ prolapse',
        'Chronic pelvic pain'
      ],
      clinicalPearl: 'The pelvic floor is part of the "deep core" canister. Breathing patterns often contribute significantly to symptoms.',
      bestPractices: [
        'Obtain informed consent.',
        'Screen for compensations.',
        'Integrate diaphragmatic breathing.'
      ]
    },
    assessments: [
      {
        name: 'Modified Oxford Scale',
        description: '0-5 MMT for pelvic floor.',
        population: 'Adults',
        time: '5 mins',
        cost: 'Free',
        tags: ['Strength'],
        instructions: 'Digital palpation to grade strength and lift.'
      }
    ],
    treatments: [
      {
        name: 'PFMT',
        description: 'Pelvic floor muscle training.',
        evidenceLevel: 'High',
        candidates: 'Stress/Urge UI.',
        tags: ['Rehabilitative'],
        instructions: 'Progressive resistive exercise for the pelvic floor.'
      }
    ],
    resources: [],
    visuals: []
  }
};
