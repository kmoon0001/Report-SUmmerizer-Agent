import { 
  ClipboardList, 
  Activity, 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Mic, 
  Users, 
  Stethoscope,
  Wind,
  Home,
  Eye
} from 'lucide-react';
import { SubspecialtyData } from './subspecialty-data';

export const OT_SUBSPECIALTY_DATA: Record<string, SubspecialtyData> = {
  'adl-training': {
    id: 'adl-training',
    title: 'Functional ADL Retraining',
    overview: {
      whatItIs: 'ADL retraining focuses on restoring independence in basic self-care tasks (Eating, Bathing, Dressing, Toileting) and Instrumental ADLs (IADLs) such as meal prep and medication management.',
      whyItHappens: 'Common etiologies include Stroke (CVA), Traumatic Brain Injury (TBI), Spinal Cord Injury (SCI), Orthopedic surgery, and Frailty/Deconditioning.',
      deficits: [
        'Upper extremity weakness/paralysis',
        'Impaired fine motor coordination',
        'Cognitive executive dysfunction',
        'Visual-spatial neglect',
        'Decreased activity tolerance',
        'Sensory loss / Proprioceptive deficits'
      ],
      symptoms: [
        'Dependence on others for dressing/grooming',
        'Safety concerns during kitchen tasks',
        'Inability to manage adaptive equipment',
        'Slow task performance',
        'Poor task sequencing (e.g., trying to put on shoes before pants)'
      ],
      clinicalPearl: 'The "Just-Right Challenge" is the core of OT. Success in ADLs is not just about muscle strength, but about the intersection of the person, their environment, and the specific occupation. Always assess for "learned non-use" in hemiparetic patients.',
      bestPractices: [
        'Perform assessments in the most natural environment possible (e.g., real bathroom vs. clinic simulation).',
        'Always prioritize patient safety and fall prevention during transfers.',
        'Integrate "Energy Conservation" techniques early for patients with cardiopulmonary comorbidities.',
        'Use "Backward Chaining" for patients with significant cognitive or sequencing deficits.',
        'Collaborate with PT for safe transfer mechanics and nursing for skin integrity.',
        'Educate caregivers on the appropriate level of assistance (minimal vs. maximal) to promote independence.'
      ]
    },
    types: [
      { name: 'Self-Care (BADLs)', description: 'Fundamental tasks: Feeding, Bathing, Dressing, Toileting, Transfers.' },
      { name: 'Home Management (IADLs)', description: 'Complex tasks: Cooking, Cleaning, Shopping, Financial management, Medication management.' },
      { name: 'Community Mobility', description: 'Driving, public transit use, staircase navigation in the community.' }
    ],
    assessments: [
      {
        name: 'Barthel Index of ADL',
        description: 'Standardized scale measuring performance in 10 ADL/mobility domains.',
        population: 'Rehab (Stroke, Geriatrics, Neuromuscular)',
        time: '5 mins',
        cost: 'Free',
        instructions: '1. Observe the patient performing the 10 items (Feeding, Bathing, Grooming, etc.). 2. Score based on what they *actually do*, not what they could do. 3. Independence means the patient needs no help (physical or verbal cues). 4. Total score 0-100.',
        tags: ['Standardized', 'Cornerstone'],
        tips: [
          'Assess performance over the previous 48 hours.',
          'Use of assistive devices (walker, reacher) still allows for an "Independent" score if no human help is needed.',
          'High inter-rater reliability makes this excellent for tracking team progress.'
        ],
        limitations: [
          'Floor and ceiling effects.',
          'Does not measure cognitive or emotional contributions to independence.'
        ]
      },
      {
        name: 'Assessment of Motor and Process Skills',
        acronym: 'AMPS',
        description: 'Observational assessment that measures the quality of a person\'s ADL performance.',
        population: 'All ages/diagnoses',
        time: '30-45 mins',
        cost: 'Paid',
        tags: ['High-Level', 'Functional'],
        whatItIs: 'A specialized OT assessment that evaluates 16 motor skills and 20 process skills during the performance of familiar ADL tasks.'
      },
      {
        name: 'Functional Independence Measure',
        acronym: 'FIM / Section GG',
        description: 'Measures the level of assistance required for functional tasks (CMS standard).',
        population: 'Inpatient Rehab',
        time: 'Ongoing',
        cost: 'Paid',
        tags: ['CMS', 'Billing'],
        tips: [
          'Focus on Section GG codes (e.g., Eating, Oral Hygiene, Toileting hygiene).',
          'Scale 1-6 (Dependent to Independent).'
        ]
      }
    ],
    treatments: [
      {
        name: 'Task-Oriented Training',
        description: 'Repetitive practice of functional tasks to promote neuroplasticity.',
        evidenceLevel: 'High',
        candidates: 'Neurological patients (Stroke, TBI).',
        instructions: 'Identify a meaningful task (e.g., pouring water). Practice component parts, then whole task. Gradually increase environmental complexity.',
        tags: ['Rehabilitative', 'Neuroplasticity'],
        whatItIs: 'Evidence-based approach to motor learning focusing on real-world activities.',
        tips: [
          'Focus on high-repetition and task-salience.',
          'Provide feedback on "knowledge of results" rather than just movement quality.'
        ]
      },
      {
        name: 'Adaptive Equipment (AE) Training',
        description: 'Teaching the use of tools to compensate for physical limitations.',
        evidenceLevel: 'High',
        candidates: 'Limited ROM, hemiparesis, orthopedic restrictions.',
        instructions: '1. Issue appropriate tool (Reacher, Sock aid, Long-handled sponge). 2. Demonstrate proper mechanics. 3. Observe patient return demonstration. 4. Ensure tool is accessible in the patient\'s room.',
        tags: ['Compensatory', 'Safety'],
        tips: [
          'Equipment is only effective if the patient is motivated to use it.',
          'Assess cognitive ability to remember and follow instructions for tool use.'
        ]
      }
    ],
    resources: [
      {
        title: 'AOTA Evidence-Based Practice',
        description: 'Guidelines for ADL and IADL interventions.',
        type: 'Guide',
        url: 'https://www.aota.org/'
      }
    ],
    visuals: [
      {
        title: 'One-Handed Dressing Techniques',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1542060717-d15f20667e63?auto=format&fit=crop&q=80&w=800',
        description: 'Instructional video for patients with hemiparesis.'
      }
    ]
  },
  'stroke-rehab': {
    id: 'stroke-rehab',
    title: 'Stroke Rehabilitation (Adult)',
    overview: {
      whatItIs: 'AOTA Clinical Practice Guideline for adult stroke recovery focusing on maximizing participation in valued occupations (2024/2025 Evidence).',
      whyItHappens: 'Ischemic or Hemorrhagic Cerebrovascular Accident (CVA) leading to sensorimotor, cognitive, and perceptual impairments.',
      deficits: [
        'Hemiparesis / Hemiplegia (Upper extremity focus)',
        'Unilateral Spatial Neglect (Visual-spatial deficits)',
        'Executive dysfunction & Cognitive fatigue',
        'Impaired sequencing and praxis',
        'Post-stroke depression and anxiety'
      ],
      symptoms: [
        'Inability to use the affected arm for functional tasks',
        'Difficulty with bimanual coordination (e.g., cutting food)',
        'Collision with objects on the affected side',
        'Inability to initiate or complete multi-step tasks',
        'Reduced balance and functional mobility'
      ],
      clinicalPearl: 'Neuroplasticity is highly "Task-Specific." Interventions that involve real objects in real environments (e.g., pouring real milk from a real carton) produce significantly better outcomes than "rote" exercises or simulations.',
      bestPractices: [
        'Initiate rehabilitation as soon as the patient is medically stable (within 24-48 hours).',
        'Utilize a client-centered goal setting tool like the Canadian Occupational Performance Measure (COPM).',
        'Prioritize intensive, high-repetition task practice to capitalize on the period of rapid neurologic recovery.',
        'Always screen for and address the psychosocial impact of stroke on both the patient and caregiver.',
        'Coordinate closely with SLP for communication and swallowing integration during ADLs.',
        'Address "learned non-use" through graded forced-use strategies like CIMT.'
      ]
    },
    types: [
      { name: 'Acute Phase', description: 'Focus on medical stability, preventive care, and early mobilization.' },
      { name: 'Sub-Acute / Inpatient Rehab', description: 'Intensive therapy focusing on major functional restoration and ADL mastery.' },
      { name: 'Community / Chronic Phase', description: 'Focus on high-level IADLs, community mobility, and vocational/leisure reintegration.' }
    ],
    assessments: [
      {
        name: 'Wolf Motor Function Test',
        acronym: 'WMFT',
        description: 'Quantitative measure of upper extremity motor ability.',
        population: 'Stroke, TBI',
        time: '30 mins',
        cost: 'Free',
        instructions: '1. Patient performs 17 tasks (ranging from basic joint movement to complex functional tasks). 2. Score based on time and quality of movement. 3. Identifies specific deficits in reaching, grasping, and manipulation.',
        tags: ['Motor', 'Standardized'],
        tips: [
          'Excellent for tracking progress in CIMT programs.',
          'Focus on the "functional ability" score to guide treatment progression.'
        ]
      },
      {
        name: 'Fugl-Meyer Upper Extremity',
        acronym: 'FMA-UE',
        description: 'Stroke-specific performance-based impairment index.',
        population: 'Stroke',
        time: '20-30 mins',
        cost: 'Free',
        tags: ['Impairment', 'Gold Standard'],
        whatItIs: 'Assesses motor function, balance, sensation, and joint function in hemiparetic stroke patients.',
        tips: [
          'The motor subscale (max 66) is the most widely used in clinical research.',
          'Assess in a systematic order (e.g., reflex activity -> synergy -> out of synergy).'
        ]
      },
      {
        name: 'Executive Function Performance Test',
        acronym: 'EFPT',
        description: 'Functional assessment of executive function during real-world tasks.',
        population: 'Stroke, TBI, MS',
        time: '30-45 mins',
        cost: 'Free',
        tags: ['Cognitive', 'Functional'],
        whatItIs: 'Assesses 4 tasks: Cooking, Telephone use, Medication management, and Bill payment.',
        tips: [
          'Do not provide cues unless the patient is stuck; the goal is to observe the *level of cueing* required.',
          'Crucial for determining safety for independent living.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Constraint-Induced Movement Therapy',
        acronym: 'CIMT',
        description: 'Forced use of the affected limb by restraining the unaffected limb.',
        evidenceLevel: 'High',
        candidates: 'Patients with at least 10 deg of active wrist/finger extension.',
        instructions: '1. Restrain the "good" arm (mitt/sling) for 90% of waking hours. 2. Engaging the affected arm in intensive functional training (shaping) for 6 hours/day for 2 weeks.',
        tags: ['Intensive', 'Neuroplasticity'],
        whatItIs: 'One of the most evidence-based interventions for chronic hemiparesis.',
        tips: [
          'Patient motivation is the biggest barrier; use "modified CIMT" (shorter hours) if needed.',
          'Ensure the tasks are "just-right" to prevent frustration and pain.'
        ]
      },
      {
        name: 'Mirror Therapy',
        description: 'Using a mirror to create a visual illusion of normal movement in the affected limb.',
        evidenceLevel: 'High',
        candidates: 'Severe hemiparesis, phantom limb pain, complex regional pain syndrome.',
        instructions: '1. Place a mirror mid-sagittal between the arms. 2. Patient watches the reflection of the unaffected arm moving while trying to move the affected arm behind the mirror.',
        tags: ['Visual-Illusion', 'Early-Phase'],
        tips: [
          'Best results when combined with functional tasks.',
          'Perform for 20-30 mins/day, 5 days/week.'
        ]
      }
    ],
    resources: [
      {
        title: 'AOTA: Adult Stroke Practice Guidelines',
        description: 'Official clinical recommendations.',
        type: 'Guide',
        url: 'https://www.aota.org/'
      }
    ],
    visuals: [
      {
        title: 'Neuroplasticity Principles',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        description: 'Illustration of task-specific training impact on CNS.'
      }
    ]
  }
};
