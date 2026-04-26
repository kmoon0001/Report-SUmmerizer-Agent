import { SubspecialtyData } from './subspecialty-data';

export const PT_SUBSPECIALTY_DATA: Record<string, SubspecialtyData> = {
  'gait-balance': {
    id: 'gait-balance',
    title: 'Gait, Balance & Fall Prevention',
    overview: {
      whatItIs: 'Physical therapy management of mobility and fall risk focusing on community-dwelling older adults (APTA 2025 CPG).',
      whyItHappens: 'Multifactorial etiologies including age-related sarcopenia, sensory processing changes, neurological disorders, and pharmacological side effects.',
      deficits: [
        'Reduced postural stability',
        'Impaired anticipatory postural adjustments',
        'Reduced gait speed',
        'Decreased lower extremity power',
        'Impaired sensory integration'
      ],
      symptoms: [
        'Recent history of falls or near falls',
        'Fear of falling leading to activity restriction',
        'Unsteady gait or wide base of support',
        'Difficulty with stair navigation',
        'Dizziness or orthostatic hypotension'
      ],
      clinicalPearl: 'Timed Up and Go is a useful screener, but gait speed and Five Times Sit to Stand often reveal the real mobility and fall-risk story.',
      bestPractices: [
        'Use a multifactorial fall-risk assessment rather than a single test in isolation.',
        'Exercise must be progressive and challenging to change fall risk.',
        'Address environmental hazards and medication effects alongside mobility work.',
        'Tie goals to community participation and ADL safety.'
      ]
    },
    types: [
      { name: 'Mechanical / Orthopedic', description: 'Gait changes due to joint pain, range of motion limits, or structural issues.' },
      { name: 'Neurological / Sensory', description: 'Balance or gait change related to central, peripheral, vestibular, or visual processing problems.' },
      { name: 'Fear-Based / Psychosocial', description: 'Movement restriction and instability influenced by fear of falling.' }
    ],
    assessments: [
      {
        name: 'Timed Up and Go',
        acronym: 'TUG',
        description: 'Standardized assessment of functional mobility and balance.',
        population: 'Older adults',
        time: '< 2 mins',
        cost: 'Free',
        instructions: 'Patient stands from a chair, walks 3 meters, turns, returns, and sits. Time the full sequence.',
        tags: ['Screening', 'Mobility'],
        tips: ['Allow one practice trial.', 'Use a comfortable but safe walking pace.']
      },
      {
        name: 'Berg Balance Scale',
        acronym: 'BBS',
        description: '14-item objective measure of static and dynamic balance.',
        population: 'Stroke, geriatrics',
        time: '15-20 mins',
        cost: 'Free',
        tags: ['Comprehensive', 'Outcome Measure'],
        whatItIs: 'Functional balance assessment during sitting, standing, transfers, and reaching.',
        tips: ['Scores under 45 indicate elevated fall risk.', 'Single-leg and reach tasks often discriminate higher-risk patients.']
      },
      {
        name: 'Gait Speed (10-Meter Walk Test)',
        acronym: '10MWT',
        description: 'Measures walking speed over a short distance.',
        population: 'All',
        time: '5 mins',
        cost: 'Free',
        tags: ['Vital Sign', 'Functional'],
        whatItIs: 'The 10MWT provides walking speed in meters per second.',
        tips: ['Use acceleration and deceleration buffer zones.', 'Limited community mobility is suggested below 0.8 m/s.']
      }
    ],
    treatments: [
      {
        name: 'Perturbation-Based Balance Training',
        description: 'Training to improve reactive postural adjustments.',
        evidenceLevel: 'High',
        candidates: 'History of falls, frequent trips',
        instructions: 'Use graded external perturbations during standing or walking with appropriate guarding or harness support.',
        tags: ['Reactive', 'Rehabilitative'],
        tips: ['Increase force gradually.', 'Use strong guarding for high-risk patients.']
      },
      {
        name: 'High-Intensity Resistance Training',
        acronym: 'HIRT',
        description: 'Progressive loading of lower-extremity musculature for strength and power.',
        evidenceLevel: 'High',
        candidates: 'Sarcopenia, generalized weakness',
        instructions: 'Use progressive resistance with functional lower-extremity patterns such as sit-to-stand, squats, and step-ups.',
        tags: ['Strength', 'Functional'],
        tips: ['Avoid non-progressive “air exercise” programs.', 'Tie loading to ADLs and transfer performance.']
      }
    ],
    resources: [
      {
        title: 'APTA Geriatrics',
        description: 'Falls prevention and mobility guidance.',
        type: 'Guide',
        url: 'https://www.aptageriatrics.org/'
      }
    ],
    visuals: [
      {
        title: 'Fall risk management workflow',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        description: 'Reference image used for fall-prevention workflow orientation.'
      }
    ]
  },
  'pelvic-health': {
    id: 'pelvic-health',
    title: 'Pelvic Health Rehabilitation',
    overview: {
      whatItIs: 'Pelvic health physical therapy addresses bladder, bowel, sexual function, prolapse, and pelvic pain through evaluation and treatment of the pelvic floor and related systems.',
      whyItHappens: 'Common etiologies include pregnancy or postpartum change, menopause, surgery, chronic pelvic pain syndromes, and neurogenic conditions.',
      deficits: [
        'Pelvic floor weakness',
        'Pelvic floor overactivity',
        'Impaired coordination',
        'Reduced pelvic organ support'
      ],
      symptoms: [
        'Urinary incontinence',
        'Urinary urgency and frequency',
        'Pelvic organ prolapse',
        'Chronic pelvic pain'
      ],
      clinicalPearl: 'Breathing mechanics and the deep-core system often drive symptoms as much as pelvic-floor strength alone.',
      bestPractices: [
        'Obtain informed consent for internal or sensitive examination procedures.',
        'Screen for substitution patterns and abdominal bracing.',
        'Integrate diaphragmatic breathing and pressure management.'
      ]
    },
    types: [
      { name: 'Underactive', description: 'Weakness or poor recruitment limiting support and continence.' },
      { name: 'Overactive', description: 'High tone or poor relaxation contributing to pain, urgency, or obstruction.' }
    ],
    assessments: [
      {
        name: 'Modified Oxford Scale',
        description: 'Manual muscle testing scale for pelvic-floor strength.',
        population: 'Adults',
        time: '5 mins',
        cost: 'Free',
        tags: ['Strength'],
        instructions: 'Use digital palpation to grade lift and squeeze if trained and appropriate.'
      }
    ],
    treatments: [
      {
        name: 'Pelvic Floor Muscle Training',
        acronym: 'PFMT',
        description: 'Progressive pelvic-floor training for continence and support.',
        evidenceLevel: 'High',
        candidates: 'Stress or urge urinary incontinence',
        instructions: 'Use progressive dosage with coordination, relaxation, and functional carryover.',
        tags: ['Rehabilitative']
      }
    ],
    resources: [],
    visuals: []
  }
};
