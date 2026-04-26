import { SubspecialtyData } from './subspecialty-data';

export const OT_SUBSPECIALTY_DATA: Record<string, SubspecialtyData> = {
  'adl-training': {
    id: 'adl-training',
    title: 'Functional ADL Retraining',
    overview: {
      whatItIs: 'ADL retraining focuses on restoring independence in self-care tasks and high-value daily routines.',
      whyItHappens: 'Common drivers include stroke, TBI, SCI, orthopedic surgery, frailty, and deconditioning.',
      deficits: [
        'Upper extremity weakness or paralysis',
        'Impaired fine-motor coordination',
        'Executive dysfunction',
        'Visual-spatial neglect',
        'Reduced activity tolerance',
        'Sensory or proprioceptive loss'
      ],
      symptoms: [
        'Dependence for dressing or grooming',
        'Safety concerns during kitchen tasks',
        'Difficulty using adaptive equipment',
        'Slow task performance',
        'Poor sequencing during multi-step tasks'
      ],
      clinicalPearl: 'ADL performance is shaped by the person, the environment, and the task itself. “Just-right challenge” is usually more useful than isolated exercise alone.',
      bestPractices: [
        'Assess in the most natural environment possible.',
        'Prioritize transfer and fall safety during training.',
        'Use energy-conservation strategies early when endurance is limited.',
        'Collaborate with PT, SLP, nursing, and caregivers for carryover.'
      ]
    },
    types: [
      { name: 'Basic ADLs', description: 'Eating, bathing, dressing, toileting, and grooming.' },
      { name: 'Instrumental ADLs', description: 'Meal prep, medication management, shopping, and home management.' },
      { name: 'Community Mobility', description: 'Higher-level access, transport, and environmental navigation.' }
    ],
    assessments: [
      {
        name: 'Barthel Index of ADL',
        description: 'Measures performance in ADL and mobility domains.',
        population: 'Rehab populations',
        time: '5 mins',
        cost: 'Free',
        instructions: 'Score observed or recent real-world performance across feeding, bathing, dressing, toileting, transfers, and mobility items.',
        tags: ['Standardized', 'ADL'],
        tips: ['Score what the person actually does, not theoretical capacity.', 'Assistive-device use can still count as independence when no human help is required.'],
        limitations: ['Less sensitive to cognition and emotional factors.', 'Can show floor and ceiling effects.']
      },
      {
        name: 'Assessment of Motor and Process Skills',
        acronym: 'AMPS',
        description: 'Observational measure of ADL quality.',
        population: 'All ages and diagnoses',
        time: '30-45 mins',
        cost: 'Paid',
        tags: ['Functional', 'High-Level'],
        whatItIs: 'Measures motor and process skills during familiar ADL tasks.'
      },
      {
        name: 'Section GG / Functional Independence framing',
        acronym: 'Section GG',
        description: 'Functional assistance coding across self-care and mobility tasks.',
        population: 'Post-acute rehab',
        time: 'Ongoing',
        cost: 'Paid',
        tags: ['CMS', 'Outcome'],
        tips: ['Track assistance level and consistency.', 'Use realistic but ambitious discharge targets.']
      }
    ],
    treatments: [
      {
        name: 'Task-Oriented Training',
        description: 'Repetitive practice of meaningful ADL tasks.',
        evidenceLevel: 'High',
        candidates: 'Neurological and functional rehab populations',
        instructions: 'Break down a functional task, practice component skills as needed, and return quickly to whole-task performance.',
        tags: ['Rehabilitative', 'Neuroplasticity'],
        tips: ['Use meaningful real objects when possible.', 'Increase environmental complexity gradually.']
      },
      {
        name: 'Adaptive Equipment Training',
        description: 'Instruction in compensatory tool use.',
        evidenceLevel: 'High',
        candidates: 'Limited ROM, weakness, orthopedic precautions',
        instructions: 'Issue appropriate equipment, demonstrate, observe return demonstration, and confirm setup in the care environment.',
        tags: ['Compensatory', 'Safety'],
        tips: ['Equipment only helps if it is accessible and actually used.', 'Assess ability to remember the sequence and safety rules.']
      }
    ],
    resources: [
      {
        title: 'AOTA',
        description: 'Occupational therapy evidence and practice resources.',
        type: 'Guide',
        url: 'https://www.aota.org/'
      }
    ],
    visuals: [
      {
        title: 'One-handed dressing reference',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1542060717-d15f20667e63?auto=format&fit=crop&q=80&w=800',
        description: 'Reference media for hemiparesis-oriented dressing strategies.'
      }
    ]
  },
  'stroke-rehab': {
    id: 'stroke-rehab',
    title: 'Stroke Rehabilitation (Adult)',
    overview: {
      whatItIs: 'Occupational therapy stroke rehabilitation focuses on participation in daily life through motor, cognitive, perceptual, and environmental intervention.',
      whyItHappens: 'Ischemic or hemorrhagic stroke can produce sensorimotor, cognitive, and perceptual impairments that disrupt ADL and IADL performance.',
      deficits: [
        'Hemiparesis or hemiplegia',
        'Unilateral spatial neglect',
        'Executive dysfunction and cognitive fatigue',
        'Impaired sequencing and praxis',
        'Psychosocial adjustment challenges'
      ],
      symptoms: [
        'Reduced use of the affected arm',
        'Difficulty with bimanual tasks',
        'Collisions with items on the affected side',
        'Inability to complete multi-step routines',
        'Reduced balance and transfer safety'
      ],
      clinicalPearl: 'Task-specific practice in real contexts typically generalizes better than abstract drills alone.',
      bestPractices: [
        'Begin once medically stable.',
        'Use client-centered goals and meaningful occupations.',
        'Leverage intensive repetition when tolerated.',
        'Address caregiver and psychosocial burden early.'
      ]
    },
    types: [
      { name: 'Acute Phase', description: 'Medical stability, prevention, and early mobility.' },
      { name: 'Subacute Rehab', description: 'High-intensity restoration of function and ADL performance.' },
      { name: 'Community / Chronic', description: 'Community reintegration and high-level IADL focus.' }
    ],
    assessments: [
      {
        name: 'Wolf Motor Function Test',
        acronym: 'WMFT',
        description: 'Quantitative measure of upper-extremity motor ability.',
        population: 'Stroke, TBI',
        time: '30 mins',
        cost: 'Free',
        instructions: 'Have the person complete a series of timed UE tasks and score time and movement quality.',
        tags: ['Motor', 'Standardized'],
        tips: ['Useful for CIMT-style programs.', 'Track both speed and quality of movement.']
      },
      {
        name: 'Fugl-Meyer Upper Extremity',
        acronym: 'FMA-UE',
        description: 'Stroke-specific motor impairment index.',
        population: 'Stroke',
        time: '20-30 mins',
        cost: 'Free',
        tags: ['Impairment', 'Gold Standard'],
        whatItIs: 'Assesses reflexes, synergy, isolated movement, coordination, and sensation.'
      },
      {
        name: 'Executive Function Performance Test',
        acronym: 'EFPT',
        description: 'Functional assessment of executive function during real-world tasks.',
        population: 'Stroke, TBI, MS',
        time: '30-45 mins',
        cost: 'Free',
        tags: ['Cognitive', 'Functional'],
        whatItIs: 'Looks at cueing need during cooking, phone use, medication management, and bill payment tasks.'
      }
    ],
    treatments: [
      {
        name: 'Constraint-Induced Movement Therapy',
        acronym: 'CIMT',
        description: 'Forced use of the affected upper extremity through restraint and shaping.',
        evidenceLevel: 'High',
        candidates: 'People with some active wrist and finger extension',
        instructions: 'Use modified or full CIMT protocols with intensive functional task practice and constraint of the less-affected limb as appropriate.',
        tags: ['Intensive', 'Neuroplasticity'],
        tips: ['Patient motivation and task salience matter.', 'Grade the task to avoid pain and frustration.']
      },
      {
        name: 'Mirror Therapy',
        description: 'Uses visual illusion to drive motor activation and attention to the affected limb.',
        evidenceLevel: 'High',
        candidates: 'Severe weakness, early motor recovery, sensory-motor retraining',
        instructions: 'Place a mirror midsagittally and have the patient watch the unaffected limb while attempting matched movement with the affected limb.',
        tags: ['Visual', 'Early-Phase'],
        tips: ['Best when combined with meaningful task practice.', 'Use consistent short daily dosing.']
      }
    ],
    resources: [
      {
        title: 'AOTA adult stroke resources',
        description: 'Occupational therapy guidance for adult stroke care.',
        type: 'Guide',
        url: 'https://www.aota.org/'
      }
    ],
    visuals: [
      {
        title: 'Neuroplasticity training reference',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        description: 'Reference image for task-specific neurorehabilitation framing.'
      }
    ]
  }
};
