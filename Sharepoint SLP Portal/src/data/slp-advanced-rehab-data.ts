import { 
  ClipboardList, 
  Activity, 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Mic, 
  Users, 
  Stethoscope,
  Scaling,
  Wind
} from 'lucide-react';
import { SubspecialtyData } from './subspecialty-data';

export const SLP_ADVANCED_REHAB_DATA: Record<string, SubspecialtyData> = {
  'dysphagia-advanced': {
    id: 'dysphagia-advanced',
    title: 'Advanced Dysphagia Rehabilitation',
    overview: {
      whatItIs: 'High-intensity, evidence-based neuroplasticity-focused interventions for chronic and severe oropharyngeal dysphagia (2024-2025 standards).',
      whyItHappens: 'Chronic neurological conditions (Stroke, PD, HNC recovery) where traditional compensatory strategies have reached a plateau.',
      deficits: [
        'Poor pharyngeal bolus clearance',
        'Reduced laryngeal vestibule closure (Airway protection)',
        'Impaired UES opening / cricopharyngeal dysfunction',
        'Reduced tongue base retraction',
        'Weak cough reflexive response'
      ],
      symptoms: [
        'Persistent aspiration / coughing on liquids',
        'Pharyngeal residue after multiple swallows',
        'Inability to advance from Level 4 Puree to Level 5 Soft',
        'Recurrent respiratory infections'
      ],
      clinicalPearl: 'Intensity is the key to neuroplastic changes. Traditional "10 reps of Mendelsohn" once a day is insufficient. Modern protocols require structural overload and high-repetition functional swallowing.',
      bestPractices: [
        'Always verify safety via instrumental assessment (FEES/VFSS) before starting high-effort maneuvers.',
        'Utilize IDDSI Flow Testing to objectively verify liquid levels in the SNF kitchen.',
        'Implement the 5x5x5 EMST protocol for patients with Parkinson’s to improve cough and laryngeal elevation.',
        'If certified, use MDTP for patients with chronic pharyngeal residue who can tolerate intensive bolus practice.',
        'Monitor for signs of cardiovascular fatigue during high-effort exercises.',
        'Transition from "compensatory" to "rehabilitative" mindset as early as possible.'
      ]
    },
    types: [
      { name: 'Resistance Training', description: 'Using tools (EMST, IOPI) to overload specific muscle groups.' },
      { name: 'Intensive Functional Practice', description: 'Systematic bolus practice (MDTP) using the swallow as the exercise.' },
      { name: 'Neuromuscular Electrical Stimulation (NMES)', description: 'Adjunctive tool (VitalStim) to facilitate muscle recruitment during swallowing.' }
    ],
    assessments: [
      {
        name: 'IDDSI Flow Test',
        description: 'Objective measure of liquid thickness using a 10mL syringe.',
        population: 'All patients on thickened liquids',
        time: '2 mins',
        cost: 'Free',
        instructions: '1. Remove plunger from 10mL syringe. 2. Cover nozzle, fill to 10mL. 3. Release nozzle for exactly 10 seconds. 4. Measure remaining volume. (0-1mL = Level 0; 1-4mL = Level 1; 4-8mL = Level 2; 8-10mL = Level 3; 10mL = Level 4).',
        tags: ['Safety', 'Standardized'],
        tips: [
          'Essential for kitchen audits and surveyor compliance.',
          'Always use a "luer slip" syringe, not luer lock.'
        ]
      },
      {
        name: 'Maximum Expiratory Pressure (MEP)',
        description: 'Measures respiratory muscle strength via pressure meter.',
        population: 'Dysarthria, Parkinson\'s, Post-Extubation',
        time: '5 mins',
        cost: 'Paid',
        tags: ['Respiratory', 'Objective'],
        whatItIs: 'Indicator of cough strength and airway clearing ability.',
        tips: [
          'Use as the baseline for EMST settings (75% of MEP).',
          'Document MEP pre- and post-intervention to show skilled progress.'
        ]
      }
    ],
    treatments: [
      {
        name: 'McNeill Dysphagia Therapy Program (MDTP)',
        acronym: 'MDTP',
        description: 'Intensive, systematic exercise-based rehabilitation using a bolus hierarchy.',
        evidenceLevel: 'High',
        candidates: 'Chronic dysphagia, Stroke, HNC.',
        instructions: 'Follow the specific 3nd-edition hierarchy. 1 hour/day intensive therapy. Pass/fail criteria for bolus advancement. (Note: Requires official certification).',
        tags: ['Intensive', 'Rehabilitative'],
        whatItIs: 'A formal protocol that focuses on functional swallowing rather than isolated exercises.',
        tips: [
          'Forces the "swallow as exercise" principle.',
          'Requires strict adherence to the food hierarchy and pass/fail rules.'
        ]
      },
      {
        name: 'Expiratory Muscle Strength Training (EMST)',
        acronym: 'EMST',
        description: 'Resistance training to strengthen the expiratory muscles and improve cough.',
        evidenceLevel: 'High',
        candidates: 'Parkinson\'s, MS, patients with weak cough.',
        instructions: '1. Set device to 75% of patient\'s MEP. 2. 5 repetitions per set. 3. 5 sets per session. 4. 5 days per week (5x5x5 protocol).',
        tags: ['Respiratory', 'Neuroplasticity'],
        tips: [
          'Monitor for signs of dizziness.',
          'Ensure the patient exhales forcefully, not just a "gentle blow."'
        ]
      }
    ],
    resources: [
      {
        title: 'IDDSI Framework 2024',
        description: 'Latest official level descriptors and testing methods.',
        type: 'Guide',
        url: 'https://iddsi.org/'
      },
      {
        title: 'ASHA Practice Portal: Dysphagia',
        description: 'Live evidence maps and clinical guidelines.',
        type: 'Resource',
        url: 'https://www.asha.org/practice-portal/'
      }
    ],
    visuals: [
      {
        title: 'The MDTP Food Hierarchy',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        description: 'Visualizing the progression from thin liquids to regular solids in MDTP.'
      }
    ]
  }
};
